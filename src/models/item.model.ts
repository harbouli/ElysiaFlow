import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
export interface ItemAttributes {
  id: number;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}
interface ItemCreationAttributes extends Optional<ItemAttributes, "id"> {}
export class Item
  extends Model<ItemAttributes, ItemCreationAttributes>
  implements ItemAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Item.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty",
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description cannot be empty",
        },
      },
    },
  },
  {
    sequelize,
    tableName: "items",
    timestamps: true,
    underscored: true,
  }
);
class ItemModel {
  async findAll(): Promise<Item[]> {
    return await Item.findAll({
      order: [["createdAt", "DESC"]],
    });
  }
  async findById(id: number): Promise<Item | null> {
    return await Item.findByPk(id);
  }
  async create(name: string, description: string): Promise<Item> {
    return await Item.create({ name, description });
  }
  async update(
    id: number,
    name?: string,
    description?: string
  ): Promise<Item | null> {
    const item = await Item.findByPk(id);
    if (!item) {
      return null;
    }
    const updateData: Partial<ItemAttributes> = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    await item.update(updateData);
    return item;
  }
  async delete(id: number): Promise<Item | null> {
    const item = await Item.findByPk(id);
    if (!item) {
      return null;
    }
    await item.destroy();
    return item;
  }
}

export const itemModel = new ItemModel();
