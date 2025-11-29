import { DataTypes, Model, Optional, Op } from "sequelize";
import sequelize from "../config/database";
import { User } from "./user.model";

export interface RefreshTokenAttributes {
  id: number;
  token: string;
  userId: number;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RefreshTokenCreationAttributes
  extends Optional<RefreshTokenAttributes, "id" | "isRevoked"> {}

export class RefreshToken
  extends Model<RefreshTokenAttributes, RefreshTokenCreationAttributes>
  implements RefreshTokenAttributes
{
  declare id: number;
  declare token: string;
  declare userId: number;
  declare expiresAt: Date;
  declare isRevoked: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

RefreshToken.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isRevoked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "refresh_tokens",
    timestamps: true,
    underscored: true,
  }
);

// Define relationship
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });

class RefreshTokenModel {
  // Create refresh token
  async create(
    token: string,
    userId: number,
    expiresAt: Date
  ): Promise<RefreshToken> {
    return await RefreshToken.create({ token, userId, expiresAt });
  }

  // Find token by value
  async findByToken(token: string): Promise<RefreshToken | null> {
    return await RefreshToken.findOne({
      where: { token },
      include: [{ model: User, as: "user" }],
    });
  }

  // Find all tokens for a user
  async findByUserId(userId: number): Promise<RefreshToken[]> {
    return await RefreshToken.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
  }

  // Revoke a token
  async revokeToken(token: string): Promise<boolean> {
    const refreshToken = await RefreshToken.findOne({ where: { token } });
    if (!refreshToken) return false;

    refreshToken.isRevoked = true;
    await refreshToken.save();
    return true;
  }

  // Revoke all tokens for a user
  async revokeAllUserTokens(userId: number): Promise<number> {
    const [affectedCount] = await RefreshToken.update(
      { isRevoked: true },
      { where: { userId, isRevoked: false } }
    );
    return affectedCount;
  }

  // Delete expired tokens (cleanup)
  async deleteExpiredTokens(): Promise<number> {
    const count = await RefreshToken.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date(),
        },
      },
    });
    return count;
  }

  // Check if token is valid
  async isTokenValid(token: string): Promise<boolean> {
    const refreshToken = await this.findByToken(token);
    if (!refreshToken) return false;
    if (refreshToken.isRevoked) return false;
    if (new Date() > refreshToken.expiresAt) return false;
    return true;
  }
}

export const refreshTokenModel = new RefreshTokenModel();
