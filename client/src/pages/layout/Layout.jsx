import "./layout.css";
import { Outlet } from "react-router-dom";
import Footer from "../../components/ui/footer/Footer";
import Header from "../../components/ui/header/Header";
import NewsLetter from "../../components/ui/newsLetter/NewsLetter";
import useScrollToTopOrSection from "../../hooks/useScrollToTopOrSection";

const Layout = () => {
  useScrollToTopOrSection();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
        <NewsLetter />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
