import { describe, expect, it } from "vitest";
import { toPublicUser } from "../../utils/publicUser.js";

describe("toPublicUser", () => {
  it("returns null for a missing user", () => {
    expect(toPublicUser(null)).toBeNull();
    expect(toPublicUser(undefined)).toBeNull();
  });

  it("maps the database id and public fields", () => {
    expect(
      toPublicUser({
        _id: "user-1",
        username: "ada",
        email: "ada@example.com",
        type: "local",
        isVerified: 1,
      }),
    ).toEqual({
      id: "user-1",
      username: "ada",
      email: "ada@example.com",
      type: "local",
      isVerified: true,
    });
  });

  it("falls back to the virtual id when _id is absent", () => {
    expect(toPublicUser({ id: "user-2", isVerified: 0 })).toEqual({
      id: "user-2",
      username: undefined,
      email: undefined,
      type: undefined,
      isVerified: false,
    });
  });
});
