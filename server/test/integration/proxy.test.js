import request from "supertest";
import { Readable } from "node:stream";
import axios from "axios";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../app.js";
import {
  MAX_PROXY_BYTES,
  MAX_PROXY_REDIRECTS,
  PROXY_TIMEOUT_MS,
} from "../../utils/proxyUrl.js";

const app = createApp();
const allowedBaseUrl = "https://uploads.mangadex.org";

const proxyPath = (
  baseUrl,
  { quality = "data", hash = "abc123", val = "1.png" } = {},
) =>
  `/api/v1/manga/proxy/chapter-image/${encodeURIComponent(baseUrl)}/${quality}/${hash}/${val}`;

const imageResponse = ({
  contentType = "image/png",
  contentLength = "11",
  body = "image-bytes",
} = {}) => ({
  status: 200,
  headers: {
    "content-type": contentType,
    ...(contentLength ? { "content-length": contentLength } : {}),
  },
  data: Readable.from([Buffer.from(body)]),
});

describe("proxyChapterImage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it.each([
    ["http://uploads.mangadex.org", "HTTP URLs"],
    ["https://169.254.169.254/latest/meta-data", "link-local IPs"],
    ["https://127.0.0.1", "loopback IPs"],
    ["https://[::1]", "IPv6 loopback"],
    ["https://localhost", "localhost"],
    ["https://uploads.mangadex.org.evil.com", "lookalike hosts"],
    ["https://mangadex.org@evil.com", "userinfo host confusion"],
    ["https://user:pass@uploads.mangadex.org", "credentials"],
    ["https://uploads.mangadex.org:444", "non-standard ports"],
    ["https://evil.com", "non-allowlisted hosts"],
  ])("rejects %s (%s) without fetching", async (baseUrl) => {
    const getSpy = vi.spyOn(axios, "get").mockResolvedValue(imageResponse());

    const response = await request(app).get(proxyPath(baseUrl));

    expect(response.status).toBe(400);
    expect(getSpy).not.toHaveBeenCalled();
  });

  it("streams an allowlisted MangaDex image", async () => {
    const getSpy = vi.spyOn(axios, "get").mockResolvedValue(imageResponse());

    const response = await request(app).get(proxyPath(allowedBaseUrl));

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toBe("image/png");
    expect(Buffer.from(response.body).toString()).toBe("image-bytes");
    expect(getSpy).toHaveBeenCalledTimes(1);

    const [url, options] = getSpy.mock.calls[0];

    expect(url).toBe("https://uploads.mangadex.org/data/abc123/1.png");
    expect(options).toMatchObject({
      responseType: "stream",
      timeout: PROXY_TIMEOUT_MS,
      maxRedirects: MAX_PROXY_REDIRECTS,
      maxContentLength: MAX_PROXY_BYTES,
    });
    expect(() =>
      options.beforeRedirect({ href: "http://169.254.169.254" }),
    ).toThrow();
    expect(() =>
      options.beforeRedirect({ href: "https://uploads.mangadex.org/next" }),
    ).not.toThrow();
  });

  it("rejects non-image upstream responses", async () => {
    vi.spyOn(axios, "get").mockResolvedValue(
      imageResponse({ contentType: "application/json", body: "{}" }),
    );

    const response = await request(app).get(proxyPath(allowedBaseUrl));

    expect(response.status).toBe(502);
  });

  it("rejects SVG upstream responses", async () => {
    vi.spyOn(axios, "get").mockResolvedValue(
      imageResponse({ contentType: "image/svg+xml", body: "<svg />" }),
    );

    const response = await request(app).get(proxyPath(allowedBaseUrl));

    expect(response.status).toBe(502);
  });

  it("rejects oversized upstream images", async () => {
    vi.spyOn(axios, "get").mockResolvedValue(
      imageResponse({ contentLength: String(MAX_PROXY_BYTES + 1) }),
    );

    const response = await request(app).get(proxyPath(allowedBaseUrl));

    expect(response.status).toBe(502);
  });

  it("rejects unsupported quality values before fetching", async () => {
    const getSpy = vi.spyOn(axios, "get").mockResolvedValue(imageResponse());

    const response = await request(app).get(
      proxyPath(allowedBaseUrl, { quality: "original" }),
    );

    expect(response.status).toBe(400);
    expect(getSpy).not.toHaveBeenCalled();
  });
});
