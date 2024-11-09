import "./login.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { formData } from "../../../assets/data/logInData";
import { EmailSchema } from "../../../assets/schema/EmailSchema";
import { useMutation } from "@tanstack/react-query";
import { loginAuthOne } from "../../../services/mutation/authMutation";
import { hasErrors } from "../../../helper/hasErrors";
import Input from "../../ui/input/Input";
import toast from "react-hot-toast";
import VerificationToast from "../verificationToast/VerificationToast";

const Login = () => {
  const navigate = useNavigate();

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

  const { mutate: loginAuthOneMutate, isPending } = useMutation({
    mutationFn: loginAuthOne,
    onSuccess: (data) => {
      localStorage.setItem("log-mail", data?.data?.user?.email);
      navigate(data?.data?.navigate);
    },
    onError: (error) => {
      const { type, message, email } = error.response.data;
      setError("email", { message });
      setFocus("email");
      if (type === "email") {
        toast(<VerificationToast email={email} navigate={navigate} />, {
          duration: 10000,
          id: "verification-toast",
        });
      }
    },
  });

  const onSubmit = (data) => {
    loginAuthOneMutate(data);
  };

  return (
    <>
      <form className="login__form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          register={register}
          watch={watch}
          errors={errors}
          formData={formData[0]}
        />
        <button
          className="login__btn"
          type="submit"
          disabled={!isValid || isPending || hasErrors(errors)}
        >
          continue
        </button>
      </form>
    </>
  );
};

export default Login;
