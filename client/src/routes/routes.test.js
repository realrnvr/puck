import { describe, expect, it } from "vitest";
import RestrictAccountSection from "../services/auth/RestrictAccountSection";
import RestrictFavourite from "../services/auth/RestrictFavourite";
import { mangaLoader } from "./loaders";
import { routeConfig } from "./routeConfig";

const topLevelPaths = [
  "/",
  "/viewer/:mangaId",
  "/login",
  "/login/loginTwo",
  "/login/loginGoogleAuth",
  "/signup",
  "/verification",
  "/verified/:verificationId",
  "/forgot-password",
  "/reset-password/:verificationId",
  "/password-verification",
  "/password-verified",
  "/redirect",
  "*",
];

const layoutChildPaths = [
  "/",
  "/read",
  "/about",
  "/community",
  "/watch",
  "/manga/:mangaId/:authorId",
  "/mangas",
  "/favourite",
  "/account",
  "/account-setting",
  "/change-password",
];

const getLayoutRoute = () => routeConfig.find((route) => route.path === "/");

describe("route config", () => {
  it("preserves every top-level path", () => {
    expect(routeConfig.map((route) => route.path)).toEqual(topLevelPaths);
  });

  it("preserves every layout child path", () => {
    expect(getLayoutRoute().children.map((route) => route.path)).toEqual(
      layoutChildPaths,
    );
  });

  it("keeps the manga loader attached to the manga route", () => {
    const mangaRoute = getLayoutRoute().children.find(
      (route) => route.path === "/manga/:mangaId/:authorId",
    );

    expect(mangaRoute.loader).toBe(mangaLoader);
  });

  it("keeps protected pages behind their guards", () => {
    const favouriteRoute = getLayoutRoute().children.find(
      (route) => route.path === "/favourite",
    );
    const accountRoute = getLayoutRoute().children.find(
      (route) => route.path === "/account",
    );

    expect(favouriteRoute.element.type).toBe(RestrictFavourite);
    expect(accountRoute.element.type).toBe(RestrictAccountSection);
  });
});
