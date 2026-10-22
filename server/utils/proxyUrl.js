import net from "node:net";
import { BadRequestError } from "../errors/badRequestError.js";

export const ALLOWED_PROXY_DOMAINS = ["mangadex.org", "mangadex.network"];
export const MAX_PROXY_BYTES = 5 * 1024 * 1024;
export const MAX_PROXY_REDIRECTS = 3;
export const PROXY_TIMEOUT_MS = 10000;

export const isAllowedProxyHost = (hostname) =>
  ALLOWED_PROXY_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
  );

export const assertAllowedProxyUrl = (rawUrl) => {
  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new BadRequestError("Invalid image URL.");
  }

  if (url.protocol !== "https:") {
    throw new BadRequestError("Image URL must use HTTPS.");
  }

  if (url.username || url.password) {
    throw new BadRequestError("Image URL cannot contain credentials.");
  }

  if (url.port && url.port !== "443") {
    throw new BadRequestError("Image URL must use the standard HTTPS port.");
  }

  const hostname = url.hostname
    .toLowerCase()
    .replace(/^\[|\]$/g, "")
    .replace(/\.$/, "");

  if (!hostname) {
    throw new BadRequestError("Image URL must include a hostname.");
  }

  if (
    net.isIP(hostname) ||
    hostname === "localhost" ||
    hostname.endsWith(".localhost")
  ) {
    throw new BadRequestError("Image URL cannot point to a private host.");
  }

  if (!isAllowedProxyHost(hostname)) {
    throw new BadRequestError("Image URL host is not allowed.");
  }

  return url;
};
