import "./signup.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { SignUpSchema } from "../../../assets/schema/SignUpSchema";
import { formData } from "../../../assets/data/signUpData";
import { signup } from "../../../services/mutation/authMutation";
import { useMutation } from "@tanstack/react-query";
import Input from "../../ui/input/Input";
import toast from "react-hot-toast";
import Loader from "../../ui/loader/Loader";
import { hasErrors } from "../../../helper/hasErrors";

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
    onSuccess: (data) => {
      localStorage.setItem("sign-mail", data?.data?.user?.email);
      navigate("/verification");
    },
    onError: (error) => {
      const { type, message } = error.response.data;
      switch (type) {
        case "username":
          setError("username", { message });
          setFocus("username");
          break;

        case "email":
          setError("email", { message });
          setFocus("email");
          break;

        case "verification-incomplete":
          // toast pop up here
          // navigate user to /verification
          setError("email", { message });
          setFocus("email");
          break;

        default:
          // make it better
          toast.error("Something went wrong");
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
          disabled={isPending || !isValid || hasErrors(errors)}
          className="signup__btn"
          type="submit"
        >
          Sign Up
        </button>
        {isPending && <Loader />}
      </div>
    </form>
  );
};

export default Signup;
