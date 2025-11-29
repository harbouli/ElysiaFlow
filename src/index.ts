import { Elysia } from "elysia";
import sequelize from "./config/database";
import { itemRoutes } from "./routes/item.routes";

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
  .get("/", () => ({
    message: "Welcome to Elysia CRUD API with MVC Architecture + Sequelize",
    endpoints: {
      "GET /items": "Get all items",
      "GET /items/:id": "Get item by ID",
      "POST /items": "Create new item",
      "PUT /items/:id": "Update item",
      "DELETE /items/:id": "Delete item",
    },
  }))
  .use(itemRoutes)
  .listen(3000);

console.log(
  `🫡 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
