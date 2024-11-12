import "./home.css";
import Hero from "../../components/ui/hero/Hero";
// import Showcase from "../../components/ui/showcase/Showcase";
import Community from "../../components/ui/community/Community";

const Home = () => {
  return (
    <>
      <Hero />
      {/* <Showcase title={"Watch Anime"} /> */}
      {/* <Showcase title={"Read Manga"} /> */}
      <Community />
    </>
  );
};

export default Home;
