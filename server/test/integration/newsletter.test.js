import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Newsletter from "../../models/newsletter.js";
import { mailer } from "../../services/mailer.js";
import { sendNewsLetter } from "../../services/newsletter.js";
import { fetchMangaUpdates } from "../../utils/fetchMangaUpdates.js";

vi.mock("../../utils/fetchMangaUpdates.js", () => ({
  fetchMangaUpdates: vi.fn(),
}));

const mangaUpdate = {
  title: "Berserk",
  chapter: "1",
  publishAt: "2024-01-01T00:00:00.000Z",
  pages: 20,
  link: "http://localhost:5173/viewer/berserk",
};

describe("sendNewsLetter", () => {
  beforeEach(() => {
    vi.mocked(fetchMangaUpdates).mockResolvedValue(mangaUpdate);
    vi.mocked(mailer).mockReset().mockResolvedValue(undefined);
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("awaits delivery to every subscribed subscriber", async () => {
    await Newsletter.create([
      { email: "first@example.com", isSubscribed: true },
      { email: "second@example.com", isSubscribed: true },
      { email: "unsubscribed@example.com", isSubscribed: false },
    ]);

    const result = await sendNewsLetter();

    expect(result).toEqual({ sent: 2, failed: 0 });
    expect(mailer).toHaveBeenCalledTimes(2);
    expect(mailer).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "first@example.com",
        subject: "Your Weekly Manga Update",
        html: expect.stringContaining("Berserk"),
      }),
    );
    expect(console.log).toHaveBeenCalledWith(
      "All newsletters sent successfully.",
    );
  });

  it("surfaces failed deliveries and continues without rejecting", async () => {
    await Newsletter.create([
      { email: "first@example.com", isSubscribed: true },
      { email: "second@example.com", isSubscribed: true },
    ]);
    const deliveryError = new Error("SMTP unavailable");
    vi.mocked(mailer)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(deliveryError);

    const result = await sendNewsLetter();

    expect(result).toEqual({ sent: 1, failed: 1 });
    expect(mailer).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenCalledWith(
      "newsletter delivery failed",
      deliveryError,
    );
    expect(console.log).not.toHaveBeenCalledWith(
      "All newsletters sent successfully.",
    );
  });
});
