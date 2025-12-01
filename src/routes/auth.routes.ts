import { Elysia } from "elysia";
import * as v from "valibot";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from "../schemas/auth.schemas";

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
