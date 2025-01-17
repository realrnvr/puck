import "./change-password.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { hasErrors } from "../../helper/hasErrors";
import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import { ChangePasswordSchema } from "../../assets/schema/ChangePasswordSchema";
import { changePassword } from "../../assets/data/changePasswordData";
import Input from "../../components/ui/input/Input";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    setError,
    watch,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    resolver: zodResolver(ChangePasswordSchema),
    mode: "onChange",
  });

  const updatePassword = (data) => {
    return axiosInstance.patch("/api/v1/client/update-password", data);
  };

  const { mutate, isPending: mutateIsPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      const { type, message } = error.response.data;
      if (type === "oldPassword") {
        setError("oldPassword", { message });
        setFocus("username");
      }
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <section className="change | container">
      <h2 className="change__title">Change Your Password</h2>
      <p className="change__description">
        You can use this page to change your password. Please enter a new
        password below:
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {changePassword.map((val, idx) => {
          return (
            <Input
              key={idx}
              register={register}
              watch={watch}
              errors={errors}
              formData={val}
              inputWrapperClassName={"change__input"}
            />
          );
        })}
        <button
          className="change__btn"
          type="submit"
          disabled={mutateIsPending || !isValid || hasErrors(errors)}
        >
          save password
        </button>
      </form>
    </section>
  );
};

export default ChangePassword;
