import React from "react";
import Header from "../../components/ui/header/Header";
import Hero from "../../components/ui/hero/Hero";
// import Showcase from "../../components/ui/showcase/Showcase";
import Community from "../../components/ui/community/Community";
import NewsLetter from "../../components/ui/newsLetter/NewsLetter";
import Footer from "../../components/ui/footer/Footer";
import "./home.css";

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        {/* <Showcase title={"Watch Anime"} /> */}
        {/* <Showcase title={"Read Manga"} /> */}
        <Community />
        <NewsLetter />
      </main>
      <Footer />
    </>
  );
};

export default Home;
