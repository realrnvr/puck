import { createModule } from "yet-another-react-lightbox";
import SliderPanel from "../module/SliderPanel";

const SliderPanelModule = createModule("SliderPanelModule", SliderPanel);

function SliderPanelPlugin({ addModule, SliderPanelProps }) {
  addModule(SliderPanelModule, { SliderPanelProps });
}

export default SliderPanelPlugin;
