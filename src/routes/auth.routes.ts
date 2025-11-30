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
  firstName: v.pipe(v.string(), v.minLength(1, "First name is required")),
  lastName: v.pipe(v.string(), v.minLength(1, "Last name is required")),
});

export const loginSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email address")),
  password: v.string(),
});

export const updateProfileSchema = v.object({
  firstName: v.optional(v.pipe(v.string(), v.minLength(1, "First name cannot be empty"))),
  lastName: v.optional(v.pipe(v.string(), v.minLength(1, "Last name cannot be empty"))),
  email: v.optional(v.pipe(v.string(), v.email("Invalid email address"))),
  bio: v.optional(v.string()),
  avatarUrl: v.optional(v.pipe(v.string(), v.url("Invalid URL"))),
  phoneNumber: v.optional(v.string()),
  gender: v.optional(v.picklist(["male", "female", "other"])),
  birthday: v.optional(v.pipe(v.string(), v.isoDate("Invalid date format"))),
});

export const forgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email address")),
});

export const resetPasswordSchema = v.object({
  token: v.pipe(v.string(), v.minLength(1, "Token is required")),
  newPassword: v.pipe(
    v.string(),
    v.minLength(6, "Password must be at least 6 characters")
  ),
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

  .post("/forgot-password", AuthController.forgotPassword, {
    body: forgotPasswordSchema,
    detail: { tags: ["Auth"] },
  })
  .post("/reset-password", AuthController.resetPassword, {
    body: resetPasswordSchema,
    detail: { tags: ["Auth"] },
  })
  .post("/verify-email", AuthController.verifyEmail, {
    detail: { tags: ["Auth"] },
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
