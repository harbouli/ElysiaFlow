import { describe, expect, it } from "bun:test";
import { Elysia } from "elysia";
import { authRoutes } from "../src/routes/auth.routes";
import { cookie } from "@elysiajs/cookie";

const app = new Elysia()
  .use(cookie())
  .use(authRoutes);

describe("Auth Flow", () => {
  it("should register a user and set cookies", async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = "password123";
    const name = "Test User";

    const response = await app.handle(
      new Request("http://localhost/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })
    );

    expect(response.status).toBe(201);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("accessToken");
    expect(setCookie).toContain("refreshToken");
  });

  it("should login and set cookies", async () => {
    // First register
    const email = `login-${Date.now()}@example.com`;
    const password = "password123";
    const name = "Login User";

    await app.handle(
      new Request("http://localhost/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })
    );

    // Then login
    const response = await app.handle(
      new Request("http://localhost/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
    );

    if (response.status !== 200) {
      console.log(await response.json());
    }
    expect(response.status).toBe(200);
    const setCookie = response.headers.get("set-cookie");
    expect(setCookie).toContain("accessToken");
  });
});
