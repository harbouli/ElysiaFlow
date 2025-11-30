import sequelize from "../config/database";
import "../models/item.model";
import "../models/user.model";
import "../models/refreshToken.model";
import "../models/address.model";
import "../models/wishlist.model";
import "../models/recentlyViewed.model";
import "../models/passwordReset.model";

async function syncDatabase() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("✓ Database connection established successfully");

    console.log("Syncing database models...");
    await sequelize.sync({ alter: true });
    console.log("✓ Database models synced successfully");
    console.log("  - users");
    console.log("  - refresh_tokens");
    console.log("  - items");
    console.log("  - addresses");
    console.log("  - wishlists");
    console.log("  - recently_viewed");
    console.log("  - password_resets");

    process.exit(0);
  } catch (error) {
    console.error("✗ Unable to sync database:", error);
    process.exit(1);
  }
}

syncDatabase();
