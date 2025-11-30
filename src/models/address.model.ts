import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { User } from "./user.model";

export interface AddressAttributes {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AddressCreationAttributes
  extends Optional<AddressAttributes, "id" | "isDefault" | "addressLine2"> {}

export class Address
  extends Model<AddressAttributes, AddressCreationAttributes>
  implements AddressAttributes
{
  declare id: number;
  declare userId: number;
  declare fullName: string;
  declare phone: string;
  declare addressLine1: string;
  declare addressLine2: string | null;
  declare city: string;
  declare country: string;
  declare postalCode: string;
  declare isDefault: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Address.init(
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
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "addresses",
    timestamps: true,
    underscored: true,
  }
);

// Define associations
User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId", as: "user" });

export class AddressModel {
  async findAllByUserId(userId: number): Promise<Address[]> {
    return await Address.findAll({ where: { userId } });
  }

  async findById(id: number): Promise<Address | null> {
    return await Address.findByPk(id);
  }

  async create(data: AddressCreationAttributes): Promise<Address> {
    // If setting as default, unset other defaults for this user
    if (data.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId: data.userId } }
      );
    }
    return await Address.create(data);
  }

  async update(
    id: number,
    userId: number,
    data: Partial<AddressAttributes>
  ): Promise<Address | null> {
    const address = await Address.findOne({ where: { id, userId } });
    if (!address) return null;

    if (data.isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId } }
      );
    }

    await address.update(data);
    return address;
  }

  async delete(id: number, userId: number): Promise<boolean> {
    const deleted = await Address.destroy({ where: { id, userId } });
    return deleted > 0;
  }
}

export const addressModel = new AddressModel();
