import { createModule } from "yet-another-react-lightbox";
import MangaController from "../module/mangaController/mangaController";

const MangaControllerModule = createModule(
  "MangaControllerModule",
  MangaController
);

function MangaControllerPlugin({ addModule, MangaControllerProps }) {
  addModule(MangaControllerModule, { MangaControllerProps });
}

export default MangaControllerPlugin;
