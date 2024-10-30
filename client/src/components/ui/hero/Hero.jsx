import React from "react";
import Carousel from "../LgScreens/carousel/Carousel";
import TextCarousel from "../LgScreens/textCarousel/TextCarousel";
import SmCarousel from "../SmScreens/carousel/SmCarousel";
import SmTextCarousel from "../SmScreens/textCarousel/SmTextCarousel";
import { scrollVerticalData } from "../../../assets/data/scrollVerticalData";
import "./hero.css";

const Hero = () => {
  return (
    <section className="hero | section-mg-top container">
      <h1 className="hero__title">Dive into the Bliss of Manga & Anime</h1>
      <div className="hero__carousel-container hero__lg-screen">
        <TextCarousel reversed={true} rotate={true} />
        {scrollVerticalData.map((val, index) => {
          return (
            <Carousel
              key={index}
              data={val}
              reversed={index % 2 === 0 ? true : false}
            />
          );
        })}
        <TextCarousel reversed={true} rotate={false} />
      </div>
      <div className="hero__sm-carousel-container hero__sm-screen">
        <SmTextCarousel />
        {scrollVerticalData.map((val, index) => {
          return (
            <SmCarousel
              key={index}
              data={val}
              reversed={index % 2 === 0 ? true : false}
            />
          );
        })}
        <SmTextCarousel reversed={true} />
      </div>
    </section>
  );
};

export default Hero;
