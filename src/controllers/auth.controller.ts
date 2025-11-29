import { Context } from "elysia";
import * as v from "valibot";
import { userModel } from "../models/user.model";
import { refreshTokenModel } from "../models/refreshToken.model";
import { JWTUtil } from "../utils/jwt.util";
import { AuthContext } from "../middleware/auth.middleware";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../routes/auth.routes";

export class AuthController {
  // Register new user
  static async register({ body, set, cookie }: Context) {
    try {
      const { email, password, name } = body as v.InferOutput<typeof registerSchema>;

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        set.status = 409;
        return {
          success: false,
          message: "User with this email already exists",
        };
      }

      // Create new user
      const user = await userModel.create(email, password, name);

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        jti: crypto.randomUUID(),
      };

      const { accessToken, refreshToken } =
        JWTUtil.generateTokenPair(tokenPayload);

      // Save refresh token to database
      const refreshTokenExpiry = JWTUtil.getTokenExpiry(
        process.env.JWT_REFRESH_EXPIRY || "7d"
      );
      await refreshTokenModel.create(refreshToken, user.id, refreshTokenExpiry);

      // Set refresh token in httpOnly cookie
      cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/",
      });

      // Set access token in httpOnly cookie
      cookie.accessToken.set({
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60, // 15 minutes
        path: "/",
      });

      set.status = 201;
      return {
        success: true,
        message: "User registered successfully",
        data: {
          user: user.toJSON(),
          accessToken,
        },
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error registering user",
      };
    }
  }

  // Login user
  static async login({ body, set, cookie }: Context) {
    try {
      const { email, password } = body as v.InferOutput<typeof loginSchema>;

      // Find user by email
      const user = await userModel.findByEmail(email);
      if (!user) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      // Generate tokens
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        jti: crypto.randomUUID(),
      };

      const { accessToken, refreshToken } =
        JWTUtil.generateTokenPair(tokenPayload);

      // Save refresh token to database
      const refreshTokenExpiry = JWTUtil.getTokenExpiry(
        process.env.JWT_REFRESH_EXPIRY || "7d"
      );
      await refreshTokenModel.create(refreshToken, user.id, refreshTokenExpiry);

      // Set refresh token in httpOnly cookie
      cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/",
      });

      // Set access token in httpOnly cookie
      cookie.accessToken.set({
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60, // 15 minutes
        path: "/",
      });

      return {
        success: true,
        message: "Login successful",
        data: {
          user: user.toJSON(),
          accessToken,
        },
      };
    } catch (error: unknown) {
      console.error("Login error:", error);
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error logging in",
      };
    }
  }



  // Refresh access token
  static async refresh({ cookie, set }: Context) {
    try {
      const refreshToken = cookie.refreshToken.value as string | undefined;

      if (!refreshToken) {
        set.status = 400;
        return {
          success: false,
          message: "Refresh token is required",
        };
      }

      // Verify refresh token
      const payload = JWTUtil.verifyRefreshToken(refreshToken);

      // Check if token exists and is valid in database
      const isValid = await refreshTokenModel.isTokenValid(refreshToken);
      if (!isValid) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid or expired refresh token",
        };
      }

      // Get user
      const user = await userModel.findById(payload.userId);
      if (!user) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
        };
      }

      // Generate new access token
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        jti: crypto.randomUUID(),
      };

      const newAccessToken = JWTUtil.generateAccessToken(tokenPayload);

      // Set new access token in cookie
      cookie.accessToken.set({
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60, // 15 minutes
        path: "/",
      });

      return {
        success: true,
        message: "Token refreshed successfully",
        data: {
          accessToken: newAccessToken,
        },
      };
    } catch (error: unknown) {
      set.status = 401;
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Invalid or expired refresh token",
      };
    }
  }

  // Logout user (revoke refresh token)
  static async logout({ cookie, set }: Context) {
    try {
      const refreshToken = cookie.refreshToken.value as string | undefined;

      if (!refreshToken) {
        set.status = 400;
        return {
          success: false,
          message: "Refresh token is required",
        };
      }

      // Revoke the refresh token
      const revoked = await refreshTokenModel.revokeToken(refreshToken);

      if (!revoked) {
        set.status = 404;
        return {
          success: false,
          message: "Refresh token not found",
        };
      }

      // Clear the refresh token cookie
      cookie.refreshToken.remove();

      return {
        success: true,
        message: "Logged out successfully",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error logging out",
      };
    }
  }

  // Logout from all devices (revoke all refresh tokens)
  static async logoutAll(context: Pick<AuthContext, "user" | "set" | "cookie">) {
    const { user, set, cookie } = context;
    try {
      // Revoke all tokens for this user
      const count = await refreshTokenModel.revokeAllUserTokens(user.userId);

      // Clear the refresh token cookie
      cookie.refreshToken.remove();

      return {
        success: true,
        message: `Logged out from ${count} device(s) successfully`,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error logging out from all devices",
      };
    }
  }

  // Get current user profile
  static async getProfile(context: Pick<AuthContext, "user" | "set">) {
    const { user, set } = context;
    try {
      const userData = await userModel.findById(user.userId);

      if (!userData) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        data: userData.toJSON(),
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error fetching profile",
      };
    }
  }

  // Update user profile
  static async updateProfile(
    context: Pick<AuthContext, "user" | "body" | "set">
  ) {
    const { user, body, set } = context;
    try {
      const { name, email } = body as v.InferOutput<typeof updateProfileSchema>;

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
          set.status = 409;
          return {
            success: false,
            message: "Email already in use",
          };
        }
      }

      const updatedUser = await userModel.update(user.userId, { name, email });

      if (!updatedUser) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
        };
      }

      return {
        success: true,
        message: "Profile updated successfully",
        data: updatedUser.toJSON(),
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error updating profile",
      };
    }
  }

  // Change password
  static async changePassword(
    context: Pick<AuthContext, "user" | "body" | "set">
  ) {
    const { user, body, set } = context;
    try {
      const { currentPassword, newPassword } = body as v.InferOutput<
        typeof changePasswordSchema
      >;

      // Get user with password
      const userData = await userModel.findById(user.userId);
      if (!userData) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
        };
      }

      // Verify current password
      const isPasswordValid = await userData.comparePassword(currentPassword);
      if (!isPasswordValid) {
        set.status = 401;
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      // Update password
      await userModel.update(user.userId, { password: newPassword });

      // Revoke all refresh tokens for security
      await refreshTokenModel.revokeAllUserTokens(user.userId);

      return {
        success: true,
        message:
          "Password changed successfully. Please login again with your new password.",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error changing password",
      };
    }
  }
}
