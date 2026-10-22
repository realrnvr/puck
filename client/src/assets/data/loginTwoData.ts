import type { FormField } from "../../types/forms";

export const loginTwoData: FormField[] = [
  {
    label: "Password",
    name: "password",
    type: "password",
    serverErr: "password is incorrect.",
    defaultMsg: "At least 8 characters",
    toggle: true,
  },
];
