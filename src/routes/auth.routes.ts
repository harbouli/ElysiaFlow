import { Elysia } from "elysia";
import * as v from "valibot";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

// Validation schemas
export const registerSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email address")),
  password: v.pipe(
    v.string(),
    v.minLength(6, "Password must be at least 6 characters")
  ),
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
});

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email address")),
  password: v.string(),
});

export const updateProfileSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.minLength(1, "Name cannot be empty"))),
  email: v.optional(v.pipe(v.string(), v.email("Invalid email address"))),
});

export const changePasswordSchema = v.object({
  currentPassword: v.string(),
  newPassword: v.pipe(
    v.string(),
    v.minLength(6, "New password must be at least 6 characters")
  ),
});

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post("/register", AuthController.register, {
    body: registerSchema,
  })

  .post("/login", AuthController.login, {
    body: loginSchema,
  })

  .post("/refresh", AuthController.refresh)

  .post("/logout", AuthController.logout)

  .guard(
    {
      beforeHandle: async ({ request, set, cookie }) => {
        const authResult = await authenticate({ request, set, cookie });

        if (!("user" in authResult)) {
          set.status = 401;
          return {
            success: false,
            message: "Authentication required",
          };
        }
      },
    },
    (app) =>
      app
        .derive(async ({ request, set, cookie }) => {
          const authResult = await authenticate({ request, set, cookie });
          if ("user" in authResult) {
            return { user: authResult.user };
          }
          throw new Error("Authentication required");
        })

        .get("/profile", ({ user, set }) => {
          return AuthController.getProfile({ user, set });
        })

        .put(
          "/profile",
          ({ user, body, set }) => {
            return AuthController.updateProfile({ user, body, set });
          },
          {
            body: updateProfileSchema,
          }
        )

        .post(
          "/change-password",
          ({ user, body, set }) => {
            return AuthController.changePassword({ user, body, set });
          },
          {
            body: changePasswordSchema,
          }
        )

        .post("/logout-all", ({ user, set, cookie }) => {
          return AuthController.logoutAll({ user, set, cookie });
        })
  );
