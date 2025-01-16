import "./account-setting.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsernameSchema } from "../../assets/schema/UsernameSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import { useAuth } from "../../hooks/useAuth";
import { hasErrors } from "../../helper/hasErrors";
import Input from "../../components/ui/input/Input";

const AccountSetting = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setError,
    watch,
    setFocus,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      newUsername: "",
    },
    resolver: zodResolver(UsernameSchema),
    mode: "onChange",
  });

  const updateUsername = (data) => {
    return axiosInstance.patch("/api/v1/client/update-username", data);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updateUsername,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.log(error);
      const message = error.response.data.message;
      setError("newUsername", { message });
      setFocus("newUsername");
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <section className="setting | container">
      <h2 className="setting__title">Edit Account Settings</h2>
      <div className="setting__option">
        <h3 className="setting__sec-title">Profile</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            register={register}
            watch={watch}
            errors={errors}
            formData={{
              label: "Username",
              name: "newUsername",
              type: "text",
              serverErr: "username already exists.",
              defaultMsg: "At least 4 characters",
              toggle: false,
            }}
            placeholder={user?.username}
          />
          <button
            type="submit"
            className="setting__btn"
            disabled={isPending || !isValid || hasErrors(errors)}
          >
            edit
          </button>
        </form>
      </div>
    </section>
  );
};

export default AccountSetting;
