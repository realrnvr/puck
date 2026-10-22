export interface FormField {
  label: string;
  name: string;
  type: "text" | "password";
  serverErr?: string;
  defaultMsg: string;
  toggle: boolean;
}

export interface ScrollVerticalImage {
  imgSrc: string;
  imgAlt: string;
}
