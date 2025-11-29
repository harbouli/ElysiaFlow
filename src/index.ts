import { Elysia } from "elysia";
import sequelize from "./config/database";
import { itemRoutes } from "./routes/item.routes";
import { authRoutes } from "./routes/auth.routes";
import { openapi } from "@elysiajs/openapi";
import { toJsonSchema } from "@valibot/to-json-schema";
import { cookie } from "@elysiajs/cookie";
import { cors } from "@elysiajs/cors";
import { csrfProtection } from "./middleware/csrf.middleware";
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log("✓ Database connection established successfully");
  } catch (error) {
    console.error("✗ Unable to connect to database:", error);
    process.exit(1);
  }
}

await initializeDatabase();

const app = new Elysia()
  // CORS configuration for cookie-based auth
  .use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3001",
      credentials: true, // Required for cookies
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  // Cookie plugin
  .use(cookie())
  // CSRF Protection for cookie-based auth
  .onBeforeHandle(csrfProtection)
  // OpenAPI documentation
  .use(
    openapi({
      mapJsonSchema: { valibot: toJsonSchema },
    })
  )
  .use(authRoutes)
  .use(itemRoutes)
  .listen(3000);

console.log(
  `🫡 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
