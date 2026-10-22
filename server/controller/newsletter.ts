import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";
import { BadRequestError } from "../errors/badRequestError.js";
import Newsletter from "../models/newsletter.js";

interface AddSubscriberBody {
  email?: string;
}

interface RemoveSubscriberParams {
  email: string;
}

export const addSubscriber = async (
  req: Request<{}, unknown, AddSubscriberBody>,
  res: Response,
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("please provide email");
  }

  const existingSubscriber = await Newsletter.findOne({ email });
  if (existingSubscriber) {
    if (existingSubscriber.isSubscribed) {
      res.status(StatusCodes.OK).json({
        message: "You are already subscribed to the newsletter",
      });
      return;
    }
    existingSubscriber.isSubscribed = true;
    existingSubscriber.subscriptionDate = new Date();
    await existingSubscriber.save();

    res.status(StatusCodes.OK).json({
      message: "You have successfully resubscribed to the newsletter!",
      subscriber: existingSubscriber,
    });
    return;
  }

  const newSubscriber = new Newsletter({
    email,
    isSubscribed: true,
  });

  await newSubscriber.save();

  res.status(StatusCodes.CREATED).json({
    message: "You are now subscribed to our newsletter!",
    subscriber: newSubscriber,
  });
};

export const removeSubscriber = async (
  req: Request<RemoveSubscriberParams>,
  res: Response,
): Promise<void> => {
  const { email } = req.params;

  if (!email) {
    throw new BadRequestError("please provide email");
  }

  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber || !subscriber.isSubscribed) {
    res.status(StatusCodes.OK).json({
      message:
        "You are not subscribed to the newsletter, so cannot unsubscribe.",
    });
    return;
  }

  subscriber.isSubscribed = false;
  await subscriber.save();

  res.status(StatusCodes.OK).json({
    message: "Your subscription has been successfully removed.",
    subscriber,
  });
};
