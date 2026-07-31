import { hashPassword, verifyPassword, signToken, verifyToken } from "../src/services/authService.js";

describe("authService", () => {
  test("hashes and verifies a password", async () => {
    const hash = await hashPassword("secret123");
    expect(hash).not.toBe("secret123");
    expect(await verifyPassword("secret123", hash)).toBe(true);
    expect(await verifyPassword("wrong", hash)).toBe(false);
  });

  test("signs and verifies a JWT round-trip", () => {
    const token = signToken({ id: 7, email: "a@b.com" });
    const payload = verifyToken(token);
    expect(payload.id).toBe(7);
    expect(payload.email).toBe("a@b.com");
  });

  test("rejects a tampered token", () => {
    expect(() => verifyToken("not.a.token")).toThrow();
  });
});
