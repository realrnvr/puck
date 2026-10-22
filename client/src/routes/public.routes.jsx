import Home from "../pages/home/Home";
import Community from "../pages/community/Community";
import Watch from "../pages/watch/Watch";
import Mangas from "../pages/mangas/Mangas";
import MainPageTemplate from "../utils/mainPageTemplate/MainPageTemplate";
import ReadSkeleton from "../utils/skeletons/read/ReadSkeleton";
import AboutSkeleton from "../utils/skeletons/about/AboutSkeleton";
import MangaSkeleton from "../utils/skeletons/manga/MangaSkeleton";
import { LazyAbout, LazyManga, LazyRead } from "./lazyPages";
import { LazyRouteElement } from "./lazyRouteElement";
import { mangaLoader } from "./loaders";

export const publicRoutes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/read",
    element: (
      <MainPageTemplate
        img={"/pattern.svg"}
        title={"READ"}
        description={
          "Step into a world where ink meets magic. Each page is a portal, each panel a universe waiting to be discovered. Ready to turn the page? Your adventure starts now!"
        }
      >
        <LazyRouteElement component={LazyRead} fallback={<ReadSkeleton />} />
      </MainPageTemplate>
    ),
  },
  {
    path: "/about",
    element: (
      <MainPageTemplate
        img={"/pattern-4.svg"}
        title={"About"}
        description={
          "Your gateway to discovering and enjoying the best of manga and anime. Explore timeless classics, discover new favorites, and immerse yourself in the stories you love—all in one place."
        }
      >
        <LazyRouteElement component={LazyAbout} fallback={<AboutSkeleton />} />
      </MainPageTemplate>
    ),
  },
  {
    path: "/community",
    element: (
      <MainPageTemplate
        img={"/pattern-6.svg"}
        title={"Community"}
        description={
          " Connect with fellow manga and anime enthusiasts! Share your thoughts, discuss favorites, and discover recommendations in a vibrant and welcoming space."
        }
        titleClassName={"main-page__title--fs"}
      >
        <Community />
      </MainPageTemplate>
    ),
  },
  {
    path: "/watch",
    element: (
      <MainPageTemplate
        img={"/pattern-5.svg"}
        title={"Watch"}
        description={
          " From action-packed adventures to heartwarming tales, explore a diverse collection of anime and watch it all in one place."
        }
      >
        <Watch />
      </MainPageTemplate>
    ),
  },
  {
    path: "/manga/:mangaId/:authorId",
    element: (
      <LazyRouteElement component={LazyManga} fallback={<MangaSkeleton />} />
    ),
    loader: mangaLoader,
  },
  {
    path: "/mangas",
    element: <Mangas />,
  },
];
