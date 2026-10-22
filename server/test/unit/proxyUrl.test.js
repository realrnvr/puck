import { describe, expect, it } from "vitest";
import { assertAllowedProxyUrl } from "../../utils/proxyUrl.js";

describe("assertAllowedProxyUrl", () => {
  it.each([
    "https://uploads.mangadex.org",
    "https://mangadex.org",
    "https://mangadex.network",
    "https://cmdxd98sb0x3yprd.mangadex.network/data/abc/1.png",
    "https://uploads.mangadex.org:443/data/abc/1.png",
  ])("accepts %s", (url) => {
    expect(() => assertAllowedProxyUrl(url)).not.toThrow();
  });

  it.each([
    "http://uploads.mangadex.org/data/abc/1.png",
    "https://169.254.169.254/latest/meta-data",
    "https://127.0.0.1",
    "https://[::1]",
    "https://localhost",
    "https://mangadex.org.evil.com",
    "https://uploads.mangadex.org.evil.com",
    "https://evil.com",
    "https://mangadex.org@evil.com",
    "https://user:pass@uploads.mangadex.org",
    "https://uploads.mangadex.org:444",
    "file:///etc/passwd",
  ])("rejects %s", (url) => {
    expect(() => assertAllowedProxyUrl(url)).toThrow();
  });
});
