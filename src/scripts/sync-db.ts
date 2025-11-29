import sequelize from "../config/database";
import "../models/item.model";

async function syncDatabase() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    console.log("Syncing database models...");
    await sequelize.sync({ alter: true });
    console.log("Database models synced successfully");

    process.exit(0);
  } catch (error) {
    console.error("✗ Unable to sync database:", error);
    process.exit(1);
  }
}

syncDatabase();
