import type { FormField } from "../../types/forms";

export const changePassword: FormField[] = [
  {
    label: "Old Password",
    name: "oldPassword",
    type: "password",
    serverErr: "user not found.",
    defaultMsg: "At least 8 characters",
    toggle: true,
  },
  {
    label: "New Password",
    name: "newPassword",
    type: "password",
    serverErr: "user not found.",
    defaultMsg: "At least 8 characters",
    toggle: true,
  },
  {
    label: "Confirm New Password",
    name: "confirmNewPassword",
    type: "password",
    serverErr: "user not found.",
    defaultMsg: "Valid",
    toggle: true,
  },
];
