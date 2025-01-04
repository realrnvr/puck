import { BadRequestError } from "../errors/badRequestError.js";
import Newsletter from "../models/newsletter.js";
import StatusCodes from "http-status-codes";

export const addSubscriber = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new BadRequestError("please provide email");
  }

  const existingSubscriber = await Newsletter.findOne({ email });
  if (existingSubscriber) {
    if (existingSubscriber.isSubscribed) {
      return res.status(StatusCodes.OK).json({
        message: "You are already subscribed to the newsletter",
      });
    }
    existingSubscriber.isSubscribed = true;
    existingSubscriber.subscriptionDate = Date.now();
    await existingSubscriber.save();

    return res.status(StatusCodes.OK).json({
      message: "You have successfully resubscribed to the newsletter!",
      subscriber: existingSubscriber,
    });
  }

  const newSubscriber = new Newsletter({
    email,
    isSubscribed: true,
  });

  await newSubscriber.save();

  return res.status(StatusCodes.CREATED).json({
    message: "You are now subscribed to our newsletter!",
    subscriber: newSubscriber,
  });
};

export const removeSubscriber = async (req, res) => {
  const { email } = req.params;
  console.log(email);

  if (!email) {
    throw new BadRequestError("please provide email");
  }

  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber || !subscriber.isSubscribed) {
    return res.status(StatusCodes.OK).json({
      message:
        "You are not subscribed to the newsletter, so cannot unsubscribe.",
    });
  }

  subscriber.isSubscribed = false;
  await subscriber.save();

  return res.status(StatusCodes.OK).json({
    message: "Your subscription has been successfully removed.",
    subscriber: subscriber,
  });
};
