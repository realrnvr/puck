import "./news-letter.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "../../../assets/schema/EmailSchema";
import { hasErrors } from "../../../helper/hasErrors";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../../services/api/axios";
import { useState } from "react";
import Input from "../input/Input";
import toast from "react-hot-toast";

const NewsLetter = () => {
  const [sub, setSub] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    watch,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(EmailSchema),
    mode: "onChange",
  });

  const { mutate: addSubscriberMutate, isPending: asmIsPending } = useMutation({
    mutationFn: (data) =>
      axiosInstance.post("/api/v1/newsletter/add-subscriber", data),
    onSuccess: (data) => {
      toast(data.data.message);
    },
    onError: (error) => {
      const { message } = error.response.data;
      setError("email", { message });
      setFocus("email");
    },
  });

  const { mutate: removeSubscriberMutate, rsmisPending } = useMutation({
    mutationFn: (data) =>
      axiosInstance.delete(
        `/api/v1/newsletter/remove-subscriber/${data.email}`
      ),
    onSuccess: (data) => {
      toast(data.data.message);
    },
    onError: (error) => {
      const { message } = error.response.data;
      setError("email", { message });
      setFocus("email");
    },
  });

  const onSubmit = (data) => {
    if (sub) {
      removeSubscriberMutate(data);
    } else {
      addSubscriberMutate(data);
    }
  };

  const hasErr = hasErrors(errors);

  return (
    <section className="newsletter">
      <img src="/pattern-1.svg" className="newsletter__bg-img" alt="" />
      <div className="newsletter__container | container">
        <h2 className="newsletter__title">
          Get the latest manga & anime news!
        </h2>
        <p className="newsletter__description">
          You will never miss a beat when you subscribe to our newsletter.
        </p>
        <form className="newsletter__form" onSubmit={handleSubmit(onSubmit)}>
          <div className="newsletter__input-wrapper">
            <Input
              register={register}
              watch={watch}
              errors={errors}
              formData={{
                name: "email",
                type: "text",
                serverErr: "Something went wrong",
                defaultMsg: "Valid email.",
                toggle: false,
              }}
              className="newsletter__input"
            />
            <button
              type="submit"
              className="newsletter__btn"
              disabled={!isValid || asmIsPending || rsmisPending || hasErr}
            >
              {sub ? "Sign out" : "Sign in"}
            </button>
          </div>
          {sub ? (
            <button
              type="button"
              className="newsletter__unsub-btn"
              onClick={() => {
                setSub(false);
              }}
            >
              subscribe?
            </button>
          ) : (
            <button
              type="button"
              className="newsletter__unsub-btn"
              onClick={() => {
                setSub(true);
              }}
            >
              unsubscribe?
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default NewsLetter;
