import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import { User } from "./user.model";

export interface PasswordResetAttributes {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PasswordResetCreationAttributes
  extends Optional<PasswordResetAttributes, "id"> {}

export class PasswordReset
  extends Model<PasswordResetAttributes, PasswordResetCreationAttributes>
  implements PasswordResetAttributes
{
  declare id: number;
  declare userId: number;
  declare token: string;
  declare expiresAt: Date;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

PasswordReset.init(
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
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "password_resets",
    timestamps: true,
    underscored: true,
  }
);

// Define associations
User.hasMany(PasswordReset, { foreignKey: "userId", as: "passwordResets" });
PasswordReset.belongsTo(User, { foreignKey: "userId", as: "user" });

export class PasswordResetModel {
  async create(userId: number, token: string, expiresInMinutes: number = 15): Promise<PasswordReset> {
    // Invalidate existing tokens for this user
    await PasswordReset.destroy({ where: { userId } });

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
    return await PasswordReset.create({ userId, token, expiresAt });
  }

  async findByToken(token: string): Promise<PasswordReset | null> {
    return await PasswordReset.findOne({ where: { token } });
  }

  async delete(id: number): Promise<void> {
    await PasswordReset.destroy({ where: { id } });
  }
}

export const passwordResetModel = new PasswordResetModel();
