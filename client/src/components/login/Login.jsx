import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { LogInSchema } from "../../assets/schema/LogInSchema";
import { formData } from "../../assets/logInData";
import { useAuth } from "../../hooks/useAuth";
import { useLoginMutation } from "../../hooks/useLoginMutation";
import Input from "../input/Input";
import "./login.css";

const Login = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(LogInSchema),
    mode: "onChange",
  });

  const { mutateAsync: loginMutate } = useLoginMutation({
    onSuccess: (data) => {
      auth.setToken(data?.data?.accessToken);
      navigate("/account");
    },
    onError: (error) => {
      const serverError = error.response.data.message;
      if (serverError.includes("email")) {
        setError("email", { message: serverError });
        setFocus("email");
      } else if (serverError.includes("password")) {
        setError("password", { message: serverError });
        setError("root", { message: serverError });
        setFocus("password");
      } else if (serverError.includes("verify")) {
        setError("root", { message: serverError });
      }
    },
  });

  const onSubmit = async (data) => {
    await loginMutate(data);
  };

  return (
    <>
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="login__link-wrapper">
          <Link className="login__link" to="/forgot-password">
            Forgot password?
          </Link>
        </div>
        <button
          className="login__btn"
          type="submit"
          disabled={!isValid || isSubmitting || !watch("password")}
        >
          Log in
        </button>
      </form>
      <p className="login__error-msg">{errors.root?.message}</p>
    </>
  );
};

export default Login;
