import "./login-two.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginTwoData } from "../../../assets/data/loginTwoData";
import { PasswordSchema } from "../../../assets/schema/PasswordSchema";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { loginAuthTwo } from "../../../services/mutation/authMutation";
import { hasErrors } from "../../../helper/hasErrors";
import Input from "../../ui/input/Input";
import toast from "react-hot-toast";

const LoginTwo = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    watch,
    setError,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(PasswordSchema),
    mode: "onChange",
  });

  const { mutate: loginAuthTwoMutate, isPending } = useMutation({
    mutationFn: loginAuthTwo,
    onSuccess: (data) => {
      console.log(data);
      auth.setToken(data?.data?.accessToken);
      toast.success("logged in.");
      navigate("/account");
      localStorage.removeItem("log-mail");
    },
    onError: (error) => {
      setError("password", { message: error.response.data.message });
    },
  });

  const onSubmit = (data) => {
    loginAuthTwoMutate({
      email: localStorage.getItem("log-mail"),
      ...data,
    });
  };

  return (
    <article className="forgot">
      <div className="forgot__content">
        <h2 className="forgot__title">PUCK</h2>
        <p className="forgot__description">Password</p>
        <p className="forgot__description forgot__description--fs">
          Enter your password to proceed.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            watch={watch}
            errors={errors}
            formData={loginTwoData[0]}
          />
          <div className="login__link-wrapper">
            <Link className="login__link" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <button
            className="login-two__btn forgot__btn"
            disabled={!isValid || isPending || hasErrors(errors)}
          >
            Log in
          </button>
        </form>
      </div>
    </article>
  );
};

export default LoginTwo;
