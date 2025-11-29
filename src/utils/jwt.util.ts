import jwt from "jsonwebtoken";

// JWT Payload interface
export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  jti?: string;
}

// JWT utility class
export class JWTUtil {
  private static ACCESS_TOKEN_SECRET =
    process.env.JWT_ACCESS_SECRET || "access-secret-key-change-in-production";
  private static REFRESH_TOKEN_SECRET =
    process.env.JWT_REFRESH_SECRET || "refresh-secret-key-change-in-production";
  private static ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || "15m";
  private static REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRY || "7d";

  static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.ACCESS_TOKEN_SECRET, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
    } as jwt.SignOptions);
  }

  static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
    } as jwt.SignOptions);
  }

  static verifyAccessToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired access token");
    }
  }

  static verifyRefreshToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  }

  static decodeToken(token: string): JWTPayload | null {
    const decoded = jwt.decode(token);
    return decoded as JWTPayload | null;
  }

  static getTokenExpiry(expiryString: string): Date {
    const now = new Date();
    const matches = expiryString.match(/^(\d+)([smhd])$/);

    if (!matches) {
      throw new Error("Invalid expiry format");
    }

    const value = parseInt(matches[1]);
    const unit = matches[2];

    switch (unit) {
      case "s":
        now.setSeconds(now.getSeconds() + value);
        break;
      case "m":
        now.setMinutes(now.getMinutes() + value);
        break;
      case "h":
        now.setHours(now.getHours() + value);
        break;
      case "d":
        now.setDate(now.getDate() + value);
        break;
    }

    return now;
  }

  // Generate both tokens
  static generateTokenPair(payload: JWTPayload): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }
}
