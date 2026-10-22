import { describe, expect, it } from "vitest";
import { mailTemplate } from "../../utils/mailTemplate.js";

describe("mailTemplate", () => {
  it("renders the username and verification link", () => {
    const html = mailTemplate({
      username: "Ada",
      redirect: "https://example.com/verify?token=abc",
      template: "email-verification",
    });

    expect(html).toContain("Hi Ada");
    expect(html).toContain('href="https://example.com/verify?token=abc"');
    expect(html).not.toContain("{{username}}");
    expect(html).not.toContain("{{verificationLink}}");
  });
});
