import { Outlet } from "react-router-dom";
import Footer from "../../components/ui/footer/Footer";
import Header from "../../components/ui/header/Header";
import NewsLetter from "../../components/ui/newsLetter/NewsLetter";
import "./layout.css";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
        <NewsLetter />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
