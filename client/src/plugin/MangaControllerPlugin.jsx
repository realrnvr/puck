import { createModule } from "yet-another-react-lightbox";
import { MangaController } from "../modules/mangaController/MangaController";

const MangaControllerModule = createModule(
  "MangaControllerModule",
  MangaController
);

export function MangaControllerPlugin({ addModule, MangaControllerProps }) {
  addModule(MangaControllerModule, { MangaControllerProps });
}
