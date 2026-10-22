import type { FormField } from "../../types/forms";

export const formData: FormField[] = [
  {
    label: "Email",
    name: "email",
    type: "text",
    serverErr: "no account found with this email.",
    defaultMsg: "Valid email.",
    toggle: false,
  },
];
