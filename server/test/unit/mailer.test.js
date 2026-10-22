import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.hoisted(() => vi.fn());

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({ sendMail })),
  },
}));

let mailer;

beforeAll(async () => {
  ({ mailer } = await vi.importActual("../../services/mailer.js"));
});

describe("mailer", () => {
  beforeEach(() => {
    sendMail.mockReset();
  });

  it("rejects when required options are missing", async () => {
    await expect(mailer()).rejects.toThrow(/requires/i);
  });

  it("sends with the configured sender", async () => {
    const options = {
      to: "reader@example.com",
      subject: "Hello",
      html: "<p>Hi</p>",
    };

    await mailer(options);

    expect(sendMail).toHaveBeenCalledWith({
      from: process.env.AUTH_USER,
      ...options,
    });
  });

  it("propagates delivery failures", async () => {
    sendMail.mockRejectedValueOnce(new Error("SMTP unavailable"));

    await expect(
      mailer({
        to: "reader@example.com",
        subject: "Hello",
        html: "<p>Hi</p>",
      }),
    ).rejects.toThrow("SMTP unavailable");
  });
});
