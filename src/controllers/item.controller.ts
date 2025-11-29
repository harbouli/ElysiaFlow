import { Context } from "elysia";
import { itemModel } from "../models/item.model";

export class ItemController {
  static async getAll() {
    const items = await itemModel.findAll();
    return {
      success: true,
      data: items,
      count: items.length,
    };
  }
  static async getById({ params, set }: Context) {
    const id = parseInt(params.id as string);
    const item = await itemModel.findById(id);

    if (!item) {
      set.status = 404;
      return {
        success: false,
        message: `Item with id ${id} not found`,
      };
    }

    return {
      success: true,
      data: item,
    };
  }
  static async create({ body, set }: Context) {
    const { name, description } = body as {
      name: string;
      description: string;
    };
    if (!name || !description) {
      set.status = 400;
      return {
        success: false,
        message: "Name and description are required",
      };
    }
    try {
      const newItem = await itemModel.create(name, description);
      set.status = 201;
      return {
        success: true,
        message: "Item created successfully",
        data: newItem,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error creating item",
      };
    }
  }
  static async update({ params, body, set }: Context) {
    const id = parseInt(params.id as string);
    const { name, description } = body as {
      name?: string;
      description?: string;
    };
    try {
      const updatedItem = await itemModel.update(id, name, description);
      if (!updatedItem) {
        set.status = 404;
        return {
          success: false,
          message: `Item with id ${id} not found`,
        };
      }
      return {
        success: true,
        message: "Item updated successfully",
        data: updatedItem,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error updating item",
      };
    }
  }
  static async delete({ params, set }: Context) {
    const id = parseInt(params.id as string);
    try {
      const deletedItem = await itemModel.delete(id);

      if (!deletedItem) {
        set.status = 404;
        return {
          success: false,
          message: `Item with id ${id} not found`,
        };
      }
      return {
        success: true,
        message: "Item deleted successfully",
        data: deletedItem,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error deleting item",
      };
    }
  }
}
