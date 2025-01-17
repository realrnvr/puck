import "./login-google-auth.css";
import Input from "../../ui/input/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { loginGoogleAuthData } from "../../../assets/data/loginGoogleAuthData";
import { loginGoogleAuthSchema } from "../../../assets/schema/loginGoogleAuthSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginGoogleAuthTwo } from "../../../services/mutation/authMutation";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { hasErrors } from "../../../helper/hasErrors";

const LoginGoogleAuth = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    watch,
    formState: { isValid, errors },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(loginGoogleAuthSchema),
    mode: "onChange",
  });

  const { mutate: loginGoogleAuthTwoMutate } = useMutation({
    mutationFn: loginGoogleAuthTwo,
    onSuccess: (data) => {
      console.log(data);
      auth.setToken(data?.data?.accessToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate("/account");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    loginGoogleAuthTwoMutate({
      email: localStorage.getItem("log-mail"),
      ...data,
    });
  };

  return (
    <article className="forgot">
      <div className="forgot__content">
        <h2 className="forgot__title">PUCK</h2>
        <p className="forgot__description">Google Login</p>
        <p className="forgot__description forgot__description--fs">
          Enter your password to proceed.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {loginGoogleAuthData.map((val, idx) => {
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
          <button
            className="forgot__btn"
            disabled={!isValid || hasErrors(errors)}
          >
            Log in
          </button>
        </form>
      </div>
    </article>
  );
};

export default LoginGoogleAuth;
