import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema } from "../../../assets/schema/ResetPasswordSchema";
import { resetPasswordData } from "../../../assets/data/resetPasswordData";
import { resetPassword } from "../../../services/mutation/authMutation";
import { useMutation } from "@tanstack/react-query";
import Input from "../../../components/ui/input/Input";

const ResetPassword = () => {
  const navigate = useNavigate();
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

  const { mutate: resetPasswordMutate, isError } = useMutation({
    mutationFn: resetPassword,
    onMutate: () => {
      toast.loading("Loading...", { id: "password-toast" });
    },
    onSuccess: (data) => {
      if (data?.data?.message) {
        toast.success(data?.data?.message, { id: "password-toast" });
        navigate("/password-verified");
      }
    },
    onError: (error) => {
      if (error?.response?.data?.message) {
        toast.error(error?.response?.data?.message, { id: "password-toast" });
      }
    },
  });

  const onSubmit = (data) => {
    resetPasswordMutate({ verificationId, data });
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
    </article>
  );
};

export default ResetPassword;
