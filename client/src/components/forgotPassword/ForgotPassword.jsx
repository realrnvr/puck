import React from "react";
import Input from "../input/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmailSchema } from "../../assets/schema/EmailSchema";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../services/mutation/authMutation";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
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

  const { mutate: forgotPasswordMutate } = useMutation({
    mutationFn: forgotPassword,
    onMutate: () => {
      toast.loading("Sending verification email...", {
        id: "toast-verification",
      });
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message, {
        id: "toast-verification",
      });
      localStorage.setItem("passwordEmail", data?.data?.user?.email);
      navigate("/password-verification");
    },
    onError: (error) => {
      localStorage.removeItem("passwordEmail");
      toast.error(error.response?.data?.message, {
        id: "toast-verification",
      });
    },
  });

  const onSubmit = (data) => {
    forgotPasswordMutate(data);
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
    </article>
  );
};

export default ForgotPassword;
