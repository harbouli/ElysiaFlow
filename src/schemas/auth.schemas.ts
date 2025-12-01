import * as v from "valibot";

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
  firstName: v.optional(
    v.pipe(v.string(), v.minLength(1, "First name cannot be empty"))
  ),
  lastName: v.optional(
    v.pipe(v.string(), v.minLength(1, "Last name cannot be empty"))
  ),
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
