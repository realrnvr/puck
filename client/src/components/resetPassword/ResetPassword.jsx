import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "../../assets/schema/ResetPasswordSchema";
import { resetPasswordData } from "../../assets/resetPasswordData";
import { useResetPasswordMutation } from "../../hooks/useResetPasswordMutation";
import Input from "../input/Input";

const ResetPassword = () => {
  const { verificationId } = useParams();

  const {
    handleSubmit,
    register,
    watch,
    formState: { isValid, isSubmitting, errors },
  } = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
  });

  const { mutateAsync: resetPasswordMutate } = useResetPasswordMutation({
    onMutate: () => {
      toast.loading("Loading...", { id: "password-toast" });
    },
    onSuccess: (data) => {
      localStorage.removeItem("passwordEmail");
      if (data?.data?.message) {
        toast.success(data?.data?.message, { id: "password-toast" });
      }
    },
    onError: (error) => {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, { id: "password-toast" });
      }
    },
  });

  const onSubmit = async (data) => {
    await resetPasswordMutate({ verificationId, data });
  };

  return (
    <article className="forgot">
      <div className="forgot__content">
        <h2 className="forgot__title">PUCK</h2>
        <p className="forgot__description">New Password</p>
        <p className="forgot__description forgot__description--fs">
          Set the new Password so that you can access all features!
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {resetPasswordData.map((val, idx) => {
            return (
              <Input
                key={idx}
                register={register}
                watch={watch}
                errors={errors}
                formData={val}
              />
            );
          })}
          <button className="forgot__btn" disabled={!isValid || isSubmitting}>
            Reset
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

export default ResetPassword;
