import type { Response } from "express";

interface SetCacheHeadersOptions {
  res: Response;
  cacheStatus: string;
  ttl: number;
  cType?: string;
}

export const setCacheHeaders = ({
  res,
  cacheStatus,
  ttl,
  cType = "application/json",
}: SetCacheHeadersOptions): void => {
  if (!res) return;

  res.set({
    "X-Cache": cacheStatus,
    "Cache-Control": `public, max-age=${ttl}, s-maxage=${ttl}`,
  });

  if (!res.get("Content-Type")) {
    res.set("Content-Type", cType);
  }
};
