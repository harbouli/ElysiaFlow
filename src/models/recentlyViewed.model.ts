import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user.model";
import { Item } from "./item.model";

export interface RecentlyViewedAttributes {
  id: number;
  userId: number;
  productId: number;
  viewedAt: Date;
}

interface RecentlyViewedCreationAttributes
  extends Optional<RecentlyViewedAttributes, "id" | "viewedAt"> {}

export class RecentlyViewed
  extends Model<RecentlyViewedAttributes, RecentlyViewedCreationAttributes>
  implements RecentlyViewedAttributes
{
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare viewedAt: Date;
}

RecentlyViewed.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Item,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    viewedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "recently_viewed",
    timestamps: false,
    underscored: true,
  }
);

// Define associations
User.hasMany(RecentlyViewed, { foreignKey: "userId", as: "recentlyViewed" });
RecentlyViewed.belongsTo(User, { foreignKey: "userId", as: "user" });
Item.hasMany(RecentlyViewed, { foreignKey: "productId", as: "views" });
RecentlyViewed.belongsTo(Item, { foreignKey: "productId", as: "product" });

export class RecentlyViewedModel {
  async getRecent(userId: number, limit: number = 20): Promise<RecentlyViewed[]> {
    return await RecentlyViewed.findAll({
      where: { userId },
      order: [["viewedAt", "DESC"]],
      limit,
      include: [{ model: Item, as: "product" }],
    });
  }

  async add(userId: number, productId: number): Promise<RecentlyViewed> {
    // Check if exists, update time if so
    const existing = await RecentlyViewed.findOne({ where: { userId, productId } });
    if (existing) {
      existing.viewedAt = new Date();
      return await existing.save();
    }

    // Check limit (keep last 20)
    const count = await RecentlyViewed.count({ where: { userId } });
    if (count >= 20) {
      // Delete oldest
      const oldest = await RecentlyViewed.findOne({
        where: { userId },
        order: [["viewedAt", "ASC"]],
      });
      if (oldest) await oldest.destroy();
    }

    return await RecentlyViewed.create({ userId, productId });
  }
}

export const recentlyViewedModel = new RecentlyViewedModel();
