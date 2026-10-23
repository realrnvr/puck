export const formData = [
  {
    label: "Username",
    name: "username",
    type: "text",
    serverErr: "username already exists.",
    defaultMsg: "At least 4 characters",
    toggle: false,
  },
  {
    label: "Email",
    name: "email",
    type: "text",
    serverErr: "email already exists.",
    defaultMsg: "Valid email.",
    toggle: false,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    serverErr: "",
    defaultMsg: "At least 8 characters",
    toggle: true,
  },
];
