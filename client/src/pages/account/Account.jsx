import React from "react";
import { axiosInstance } from "../../services/api/axios";
import { googleLogout } from "@react-oauth/google";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/header/Header";
import "./account.css";

const Account = () => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => axiosInstance.get("/api/v1/users"),
  });

  return (
    <>
      <Header />
      <section className="account">
        <p>{data?.data?.msg}</p>
        <button onClick={googleLogout}>logout</button>
      </section>
    </>
  );
};

export default Account;
