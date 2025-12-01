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
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../schemas/auth.schemas";
import { passwordResetModel } from "../models/passwordReset.model";

export class AuthController {
  static async register({ body, set, cookie }: Context) {
    try {
      const { email, password, firstName, lastName } = body as v.InferOutput<typeof registerSchema>;

      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        set.status = 409;
        return {
          success: false,
          message: "User with this email already exists",
        };
      }

      const user = await userModel.create(email, password, firstName, lastName);

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        jti: crypto.randomUUID(),
      };

      const { accessToken, refreshToken } =
        JWTUtil.generateTokenPair(tokenPayload);

      const refreshTokenExpiry = JWTUtil.getTokenExpiry(
        process.env.JWT_REFRESH_EXPIRY || "7d"
      );
      await refreshTokenModel.create(refreshToken, user.id, refreshTokenExpiry);
      cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/",
      });

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

  static async login({ body, set, cookie }: Context) {
    try {
      const { email, password } = body as v.InferOutput<typeof loginSchema>;
      const user = await userModel.findByEmail(email);
      if (!user) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid email or password",
        };
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        jti: crypto.randomUUID(),
      };

      const { accessToken, refreshToken } =
        JWTUtil.generateTokenPair(tokenPayload);

      const refreshTokenExpiry = JWTUtil.getTokenExpiry(
        process.env.JWT_REFRESH_EXPIRY || "7d"
      );
      await refreshTokenModel.create(refreshToken, user.id, refreshTokenExpiry);
      cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
        path: "/",
      });

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

      const payload = JWTUtil.verifyRefreshToken(refreshToken);

      const isValid = await refreshTokenModel.isTokenValid(refreshToken);
      if (!isValid) {
        set.status = 401;
        return {
          success: false,
          message: "Invalid or expired refresh token",
        };
      }

      const user = await userModel.findById(payload.userId);
      if (!user) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
        };
      }

      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        jti: crypto.randomUUID(),
      };

      const newAccessToken = JWTUtil.generateAccessToken(tokenPayload);

      cookie.accessToken.set({
        value: newAccessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
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

      const revoked = await refreshTokenModel.revokeToken(refreshToken);

      if (!revoked) {
        set.status = 404;
        return {
          success: false,
          message: "Refresh token not found",
        };
      }

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

  static async logoutAll(context: Pick<AuthContext, "user" | "set" | "cookie">) {
    const { user, set, cookie } = context;
    try {
      const count = await refreshTokenModel.revokeAllUserTokens(user.userId);
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

  static async updateProfile(
    context: Pick<AuthContext, "user" | "body" | "set">
  ) {
    const { user, body, set } = context;
    try {
      const { firstName, lastName, email, bio, avatarUrl, phoneNumber, gender, birthday } = body as v.InferOutput<typeof updateProfileSchema>;

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

      const updatedUser = await userModel.update(user.userId, {
        firstName,
        lastName,
        email,
        bio,
        avatarUrl,
        phoneNumber,
        gender,
        birthday: birthday ? new Date(birthday) : undefined,
      });

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

  static async uploadProfileImage(context: Pick<AuthContext, "user" | "body" | "set">) {
    const { user, body, set } = context;
    try {
      const { image } = body as { image?: string };
      if (!image) {
        set.status = 400;
        return { success: false, message: "Image is required" };
      }

      // In a real app, upload to S3/Cloudinary here.
      // For now, we'll assume the client sends a URL or base64 string that we just save.
      // If it's a file upload, we'd need to handle multipart/form-data and save to disk.
      
      // Simplified: Assume 'image' is a URL string for now as per plan assumption
      const imageUrl = image; 

      await userModel.update(user.userId, { avatarUrl: imageUrl });

      return {
        success: true,
        message: "Profile image updated successfully",
        data: { avatarUrl: imageUrl },
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error uploading image",
      };
    }
  }

  static async changePassword(
    context: Pick<AuthContext, "user" | "body" | "set">
  ) {
    const { user, body, set } = context;
    try {
      const { currentPassword, newPassword } = body as v.InferOutput<
        typeof changePasswordSchema
      >;

      const userData = await userModel.findById(user.userId);
      if (!userData) {
        set.status = 404;
        return {
          success: false,
          message: "User not found",
        };
      }

      const isPasswordValid = await userData.comparePassword(currentPassword);
      if (!isPasswordValid) {
        set.status = 401;
        return {
          success: false,
          message: "Current password is incorrect",
        };
      }

      await userModel.update(user.userId, { password: newPassword });

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

  static async forgotPassword({ body, set }: Context) {
    try {
      const { email } = body as v.InferOutput<typeof forgotPasswordSchema>;

      const user = await userModel.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return {
          success: true,
          message: "If an account exists, a password reset email has been sent.",
        };
      }

      const token = crypto.randomUUID();
      await passwordResetModel.create(user.id, token);

      // Mock sending email
      console.log(`[EMAIL] Password reset token for ${email}: ${token}`);

      return {
        success: true,
        message: "If an account exists, a password reset email has been sent.",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error processing request",
      };
    }
  }

  static async resetPassword({ body, set }: Context) {
    try {
      const { token, newPassword } = body as v.InferOutput<typeof resetPasswordSchema>;

      const resetRecord = await passwordResetModel.findByToken(token);
      if (!resetRecord) {
        set.status = 400;
        return {
          success: false,
          message: "Invalid or expired token",
        };
      }

      if (new Date() > resetRecord.expiresAt) {
        await passwordResetModel.delete(resetRecord.id);
        set.status = 400;
        return {
          success: false,
          message: "Token expired",
        };
      }

      // Update password
      await userModel.update(resetRecord.userId, { password: newPassword });

      // Invalidate token
      await passwordResetModel.delete(resetRecord.id);

      // Revoke all sessions
      await refreshTokenModel.revokeAllUserTokens(resetRecord.userId);

      return {
        success: true,
        message: "Password reset successfully",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error resetting password",
      };
    }
  }

  static async verifyEmail({ body, set }: Context) {
    // Mock implementation
    return {
      success: true,
      message: "Email verified successfully",
    };
  }


  static async googleCallback(context: Context & { user: any }) {
    const { user: oauthUser, set, cookie } = context;
    try {
      const { id, email, name, picture } = oauthUser;

      let existingUser = await userModel.findByProviderId("google", id);

      if (!existingUser) {
        const userByEmail = await userModel.findByEmail(email);
        if (userByEmail) {
          existingUser = await userModel.update(userByEmail.id, {
            authProvider: "google",
            authProviderId: id,
          });
        } else {
          // Create new user
          // Generate a random password for OAuth users
          const randomPassword = crypto.randomUUID();
          existingUser = await userModel.create(
            email,
            randomPassword,
            oauthUser.given_name || "Google",
            oauthUser.family_name || "User",
            "user",
            "google",
            id,
            { avatarUrl: picture }
          );
          await userModel.verifyEmail(existingUser.id);
        }
      }

      if (!existingUser) {
        throw new Error("Failed to create or retrieve user");
      }

      const tokenPayload = {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        jti: crypto.randomUUID(),
      };

      const { accessToken, refreshToken } =
        JWTUtil.generateTokenPair(tokenPayload);

      const refreshTokenExpiry = JWTUtil.getTokenExpiry(
        process.env.JWT_REFRESH_EXPIRY || "7d"
      );
      await refreshTokenModel.create(
        refreshToken,
        existingUser.id,
        refreshTokenExpiry
      );

      cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      cookie.accessToken.set({
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
        path: "/",
      });

      return {
        success: true,
        message: "Google login successful",
        data: {
          user: existingUser.toJSON(),
          accessToken,
        },
      };
    } catch (error: unknown) {
      console.error("Google login error:", error);
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error logging in with Google",
      };
    }
  }

  static async appleCallback(context: Context & { user: any }) {
    const { user: oauthUser, set, cookie } = context;
    try {
      const { sub, email, name } = oauthUser;
      
      // Note: Apple only sends name on first login. You might need to handle this.
      // Fallback name if not provided
      const firstName = name ? name.firstName : "Apple";
      const lastName = name ? name.lastName : "User";

      // Check if user exists by provider ID
      let existingUser = await userModel.findByProviderId("apple", sub);

      if (!existingUser) {
        if (email) {
            const userByEmail = await userModel.findByEmail(email);
            if (userByEmail) {
            existingUser = await userModel.update(userByEmail.id, {
                authProvider: "apple",
                authProviderId: sub,
            });
            } else {
            const randomPassword = crypto.randomUUID();
            existingUser = await userModel.create(
                email,
                randomPassword,
                firstName,
                lastName,
                "user",
                "apple",
                sub
            );
            await userModel.verifyEmail(existingUser.id);
            }
        } else {
            throw new Error("Email required from Apple");
        }
      }

      if (!existingUser) {
        throw new Error("Failed to create or retrieve user");
      }

      const tokenPayload = {
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role,
        jti: crypto.randomUUID(),
      };

      const { accessToken, refreshToken } =
        JWTUtil.generateTokenPair(tokenPayload);

      const refreshTokenExpiry = JWTUtil.getTokenExpiry(
        process.env.JWT_REFRESH_EXPIRY || "7d"
      );
      await refreshTokenModel.create(
        refreshToken,
        existingUser.id,
        refreshTokenExpiry
      );

      cookie.refreshToken.set({
        value: refreshToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });

      cookie.accessToken.set({
        value: accessToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60,
        path: "/",
      });

      return {
        success: true,
        message: "Apple login successful",
        data: {
          user: existingUser.toJSON(),
          accessToken,
        },
      };
    } catch (error: unknown) {
      console.error("Apple login error:", error);
      set.status = 400;
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error logging in with Apple",
      };
    }
  }
}
