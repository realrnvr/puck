import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { SignUpSchema } from "../../assets/schema/SignUpSchema";
import { formData } from "../../assets/signUpData";
import { signup } from "../../services/mutation/authMutation";
import { useMutation } from "@tanstack/react-query";
import Input from "../input/Input";
import "./signup.css";
import toast from "react-hot-toast";

const Signup = () => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(SignUpSchema),
    mode: "onChange",
  });

  const navigate = useNavigate();

  const { mutate: signupMutate, isPending } = useMutation({
    mutationFn: signup,
    onMutate: () => {
      toast.loading("Loading...", {
        id: "signup-toast",
      });
    },
    onSuccess: (data) => {
      toast.dismiss("signup-toast");
      localStorage.setItem("userEmail", data?.data?.user?.email);
      navigate("/verification");
    },
    onError: (error) => {
      toast.dismiss("signup-toast");
      const serverError = error.response.data.message;
      if (serverError.includes("username")) {
        setError("username", { message: serverError });
        setFocus("username");
      } else if (serverError.includes("email")) {
        setError("email", { message: serverError });
        setFocus("email");
      }
    },
  });

  const onSubmit = (data) => {
    signupMutate(data);
  };

  return (
    <form className="signup__form" onSubmit={handleSubmit(onSubmit)}>
      {formData.map((val, idx) => {
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
      <div className="signup__btn-wrapper">
        <button
          disabled={isPending || !isValid}
          className="signup__btn"
          type="submit"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default Signup;
