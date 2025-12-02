import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user.model";
import { Item } from "./item.model";

export interface WishlistAttributes {
  id: number;
  userId: number;
  productId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WishlistCreationAttributes extends Optional<WishlistAttributes, "id"> {}

export class Wishlist
  extends Model<WishlistAttributes, WishlistCreationAttributes>
  implements WishlistAttributes
{
  declare id: number;
  declare userId: number;
  declare productId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Wishlist.init(
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
  },
  {
    sequelize,
    tableName: "wishlists",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["user_id", "product_id"],
      },
    ],
  }
);

// Define associations
User.hasMany(Wishlist, { foreignKey: "userId", as: "wishlist" });
Wishlist.belongsTo(User, { foreignKey: "userId", as: "user" });
Item.hasMany(Wishlist, { foreignKey: "productId", as: "wishlistedBy" });
Wishlist.belongsTo(Item, { foreignKey: "productId", as: "product" });

export class WishlistModel {
  async findAllByUserId(userId: number): Promise<Wishlist[]> {
    return await Wishlist.findAll({
      where: { userId },
      include: [{ model: Item, as: "product" }],
    });
  }

  async add(userId: number, productId: number): Promise<Wishlist> {
    // Check if already exists
    const existing = await Wishlist.findOne({ where: { userId, productId } });
    if (existing) return existing;

    return await Wishlist.create({ userId, productId });
  }

  async remove(userId: number, productId: number): Promise<boolean> {
    const deleted = await Wishlist.destroy({ where: { userId, productId } });
    return deleted > 0;
  }
}

export const wishlistModel = new WishlistModel();
