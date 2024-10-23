import React, { useEffect, useState } from "react";
import "./account.css";
import Header from "../../components/header/Header";
import { axiosInstance } from "../../services/api/axios";

const Account = () => {
  const [userData, setUserData] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/users");
      const { msg } = response.data;
      setUserData(msg);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Header />
      <section className="account">
        <p>{userData}</p>
      </section>
    </>
  );
};

export default Account;
