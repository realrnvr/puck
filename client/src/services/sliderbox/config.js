import Captions from "yet-another-react-lightbox/plugins/captions";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import SliderPanelPlugin from "./plugin/SliderPanelPlugin";

export const plugins = [
  Thumbnails,
  Captions,
  Inline,
  Slideshow,
  SliderPanelPlugin,
];

export const slideshow = {
  autoplay: true,
  delay: 3000,
};

export const thumbnails = {
  width: 40,
  height: 40,
};

export const carousel = {
  preload: 5,
};
