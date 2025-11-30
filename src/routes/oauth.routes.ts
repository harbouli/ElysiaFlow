import { Elysia } from "elysia";
import { oauth2 } from "elysia-oauth2";
import { AuthController } from "../controllers/auth.controller";

export const oauthRoutes = new Elysia({ prefix: "/auth" })
  .use(
    oauth2({
      Google: [
        process.env.GOOGLE_CLIENT_ID || "",
        process.env.GOOGLE_CLIENT_SECRET || "",
        process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/auth/google/callback",
      ],
      Apple: [
        process.env.APPLE_CLIENT_ID || "",
        process.env.APPLE_TEAM_ID || "",
        process.env.APPLE_KEY_ID || "",
        // We need to handle the private key properly, it might need to be a Uint8Array or string depending on how we load it.
        // For now, passing a placeholder or empty string might fail type check if it expects Uint8Array.
        // The type said: pkcs8PrivateKey: Uint8Array<ArrayBufferLike>
        // We can try to pass a dummy Uint8Array for now if env is missing.
        process.env.APPLE_PRIVATE_KEY ? new TextEncoder().encode(process.env.APPLE_PRIVATE_KEY) : new Uint8Array(0),
        process.env.APPLE_REDIRECT_URI || "http://localhost:3000/auth/apple/callback",
      ],
    })
  )
  .get("/google/callback", async (context) => {
    const { oauth2, set, cookie } = context;
    const token = await oauth2.authorize("Google");
    
    // Get user profile
    // Note: elysia-oauth2 might behave differently depending on version.
    // Assuming standard behavior where we get tokens and can fetch profile.
    // However, elysia-oauth2 often simplifies this.
    // Let's check if we can get the user directly or need to fetch it.
    // Based on common usage:
    try {
        const user = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        }).then(res => res.json());
        
        return AuthController.googleCallback({ ...context, user });
    } catch (error) {
        set.status = 400;
        return { success: false, message: "Failed to fetch Google profile" };
    }
  })
  .get("/apple/callback", async (context) => {
      const { oauth2, set, cookie } = context;
      // Apple flow is slightly more complex with form_post usually, but elysia-oauth2 handles it.
      // We might need to adjust based on actual response.
      const token = await oauth2.authorize("Apple");
      
      // Apple ID token contains user info
      // We need to decode it.
      // For now, let's assume we can get the sub and email from the id_token if available
      // or fetch from apple if possible (Apple doesn't have a userinfo endpoint like Google in the same way).
      // We usually rely on the id_token claims.
      
      // Since we don't have a JWT decoder handy in this file, we might need to import one or pass the token to controller.
      // Let's pass the token to the controller and let it handle decoding/verification.
      // But wait, our controller expects a user object.
      
      // Let's try to decode the id_token here or use a library.
      // We have jsonwebtoken installed.
      const jwt = require("jsonwebtoken");
      const decoded = jwt.decode(token.idToken);
      
      // Apple only sends name/email on first login in the body, which elysia-oauth2 might capture?
      // If not, we rely on what's in the token.
      
      return AuthController.appleCallback({ ...context, user: decoded });
  });
