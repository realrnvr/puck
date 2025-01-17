import "./account-setting.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UsernameSchema } from "../../assets/schema/UsernameSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../services/api/axios";
import { useAuth } from "../../hooks/useAuth";
import { hasErrors } from "../../helper/hasErrors";
import Input from "../../components/ui/input/Input";
import ChangePasswordBtn from "../../components/ChangePasswordBtn";
import Skeleton from "react-loading-skeleton";

const AccountSetting = () => {
  const { user, isPending } = useAuth();
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

  const { mutate, isPending: mutateIsPending } = useMutation({
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
      <div>
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
              inputWrapperClassName={"setting__input"}
            />
            <button
              type="submit"
              className="setting__btn"
              disabled={mutateIsPending || !isValid || hasErrors(errors)}
            >
              edit
            </button>
          </form>
        </div>
      </div>
      <div className="setting__bottom-container">
        <h2 className="setting__sec-title">Account Information</h2>
        <div className="setting__opt-container">
          <span className="setting__label">E-mail:</span>
          <span>
            {isPending ? (
              <Skeleton
                baseColor="#202020"
                highlightColor="#444"
                height={"100%"}
                width={"150px"}
              />
            ) : (
              user?.email
            )}
          </span>
        </div>
        <div className="setting__opt-container">
          <span className="setting__label">Password:</span>
          <ChangePasswordBtn user={user} isPending={isPending} />
        </div>
      </div>
    </section>
  );
};

export default AccountSetting;
