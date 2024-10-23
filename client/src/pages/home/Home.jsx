import React from "react";
import Header from "../../components/header/Header";
import Hero from "../../components/hero/Hero";
// import Showcase from "../../components/showcase/Showcase";
import Community from "../../components/community/Community";
import NewsLetter from "../../components/newsLetter/NewsLetter";
import Footer from "../../components/footer/Footer";
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
