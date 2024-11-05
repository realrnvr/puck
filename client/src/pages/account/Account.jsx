import { axiosInstance } from "../../services/api/axios";
import { useQuery } from "@tanstack/react-query";
import Header from "../../components/ui/header/Header";
import "./account.css";

const Account = () => {
  const { data, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => axiosInstance.get("/api/v1/users"),
  });

  console.log("accounts fetch error:", error);

  return (
    <>
      <Header />
      <section className="account">
        <p>{data?.data?.msg}</p>
      </section>
    </>
  );
};

export default Account;
