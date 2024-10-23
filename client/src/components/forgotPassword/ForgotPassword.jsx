import React from "react";
import Input from "../input/Input";
import { useForm } from "react-hook-form";
import { useForgotPasswordMutation } from "../../hooks/useForgotPasswordMutation";
import { Toaster } from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "../../assets/schema/EmailSchema";
import { useNavigate } from "react-router-dom";
import "./forgot-password.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(EmailSchema),
    mode: "onChange",
  });

  const { mutateAsync: forgotPasswordMutate } = useForgotPasswordMutation({
    onSuccess: (data) => {
      localStorage.setItem("passwordEmail", data?.data?.user?.email);
      navigate("/password-verification");
    },
    onError: (error) => {
      localStorage.removeItem("passwordEmail");
      console.log(error);
    },
  });

  const onSubmit = async (data) => {
    try {
      await forgotPasswordMutate(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <article className="forgot">
      <div className="forgot__content">
        <h2 className="forgot__title">PUCK</h2>
        <p className="forgot__description">Forgot Password</p>
        <p className="forgot__description forgot__description--fs">
          Enter your email to proceed for verification.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            watch={watch}
            errors={errors}
            formData={{
              label: "Email",
              name: "email",
              type: "text",
              serverErr: "user not found.",
              defaultMsg: "Valid email.",
              toggle: false,
            }}
          />
          <button
            className="forgot__btn"
            type="submit"
            disabled={!isValid || isSubmitting}
          >
            Continue
          </button>
        </form>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            color: "#191815",
            fontSize: "1rem",
          },
          iconTheme: {
            primary: "#191815",
            secondary: "#ffffe3",
          },
        }}
      />
    </article>
  );
};

export default ForgotPassword;
