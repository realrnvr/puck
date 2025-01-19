import "./home.css";
import Hero from "../../components/ui/hero/Hero";
import Community from "../../components/ui/community/Community";
import CaseManga from "../../components/ui/caseManga/CaseManga";

const Home = () => {
  return (
    <>
      <Hero />
      <CaseManga />
      <Community />
    </>
  );
};

export default Home;
