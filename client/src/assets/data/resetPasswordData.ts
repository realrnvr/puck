import type { FormField } from "../../types/forms";

export const resetPasswordData: FormField[] = [
  {
    label: "New Password",
    name: "newPassword",
    type: "password",
    serverErr: "user not found.",
    defaultMsg: "At least 8 characters",
    toggle: true,
  },
  {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
    serverErr: "user not found.",
    defaultMsg: "Valid",
    toggle: true,
  },
];
