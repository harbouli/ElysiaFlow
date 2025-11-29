import { Context } from "elysia";
import { JWTUtil, JWTPayload } from "../utils/jwt.util";

// Extend Context to include user
export interface AuthContext extends Context {
  user: JWTPayload;
}

// Type for authentication result
type AuthResult =
  | { user: JWTPayload }
  | { success: false; message: string };

// Authentication middleware
export const authenticate = async (context: Pick<Context, "request" | "set" | "cookie">): Promise<AuthResult> => {
  const { request, set, cookie } = context;
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get("authorization");

    if ((!authHeader || !authHeader.startsWith("Bearer ")) && !cookie.accessToken.value) {
      set.status = 401;
      return {
        success: false,
        message: "No token provided. Please provide a valid access token.",
      };
    }

    // Extract token
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookie.accessToken.value) {
      token = cookie.accessToken.value as string;
    } else {
      set.status = 401;
      return {
        success: false,
        message: "No token provided. Please provide a valid access token.",
      };
    }

    // Verify token
    const payload = JWTUtil.verifyAccessToken(token);

    // Attach user to context
    return { user: payload };
  } catch (error: unknown) {
    set.status = 401;
    return {
      success: false,
      message: error instanceof Error ? error.message : "Invalid or expired token",
    };
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles: string[]) => {
  return ({ user, set }: AuthContext) => {
    if (!user) {
      set.status = 401;
      return {
        success: false,
        message: "Authentication required",
      };
    }

    if (!allowedRoles.includes(user.role)) {
      set.status = 403;
      return {
        success: false,
        message: "You do not have permission to access this resource",
      };
    }

    return { user };
  };
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = async ({ request, cookie }: Context) => {
  try {
    const authHeader = request.headers.get("authorization");

    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookie.accessToken.value) {
      token = cookie.accessToken.value as string;
    } else {
      return { user: null };
    }
    const payload = JWTUtil.verifyAccessToken(token);

    return { user: payload };
  } catch (error) {
    return { user: null };
  }
};
