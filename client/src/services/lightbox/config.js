import Counter from "yet-another-react-lightbox/plugins/counter";
import Download from "yet-another-react-lightbox/plugins/download";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Inline from "yet-another-react-lightbox/plugins/inline";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import MangaControllerPlugin from "./plugin/MangaControllerPlugin";

export const plugins = [
  Inline,
  Fullscreen,
  Zoom,
  Download,
  Slideshow,
  Counter,
  MangaControllerPlugin,
];

export const zoom = {
  maxZoomPixelRatio: 2,
  zoomInMultiplier: 2,
  doubleClickMaxStops: 2,
  keyboardMoveDistance: 100,
};

export const carousel = {
  finite: true,
};

export const animation = {
  zoom: 500,
};
