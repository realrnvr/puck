import { axiosInstance } from "../api/axios";

export const verify = (verificationId) => {
  return axiosInstance.get(`/api/v1/auth/verification/${verificationId}`);
};
