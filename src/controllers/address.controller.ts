import { Context } from "elysia";
import * as v from "valibot";
import { addressModel } from "../models/address.model";
import { AuthContext } from "../middleware/auth.middleware";

export const createAddressSchema = v.object({
  fullName: v.pipe(v.string(), v.minLength(1, "Full name is required")),
  phone: v.pipe(v.string(), v.minLength(1, "Phone is required")),
  addressLine1: v.pipe(v.string(), v.minLength(1, "Address line 1 is required")),
  addressLine2: v.optional(v.string()),
  city: v.pipe(v.string(), v.minLength(1, "City is required")),
  country: v.pipe(v.string(), v.minLength(1, "Country is required")),
  postalCode: v.pipe(v.string(), v.minLength(1, "Postal code is required")),
  isDefault: v.optional(v.boolean()),
});

export const updateAddressSchema = v.partial(createAddressSchema);

export class AddressController {
  static async getAll(context: Pick<AuthContext, "user" | "set">) {
    const { user, set } = context;
    try {
      const addresses = await addressModel.findAllByUserId(user.userId);
      return {
        success: true,
        data: addresses,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error fetching addresses",
      };
    }
  }

  static async create(context: Pick<AuthContext, "user" | "body" | "set">) {
    const { user, body, set } = context;
    try {
      const data = body as v.InferOutput<typeof createAddressSchema>;
      const address = await addressModel.create({
        ...data,
        userId: user.userId,
      });

      set.status = 201;
      return {
        success: true,
        message: "Address created successfully",
        data: address,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error creating address",
      };
    }
  }

  static async update(context: Pick<AuthContext, "user" | "params" | "body" | "set">) {
    const { user, params, body, set } = context;
    const id = parseInt(params.id as string);
    try {
      const data = body as v.InferOutput<typeof updateAddressSchema>;
      const address = await addressModel.update(id, user.userId, data);

      if (!address) {
        set.status = 404;
        return {
          success: false,
          message: "Address not found",
        };
      }

      return {
        success: true,
        message: "Address updated successfully",
        data: address,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error updating address",
      };
    }
  }

  static async delete(context: Pick<AuthContext, "user" | "params" | "set">) {
    const { user, params, set } = context;
    const id = parseInt(params.id as string);
    try {
      const deleted = await addressModel.delete(id, user.userId);

      if (!deleted) {
        set.status = 404;
        return {
          success: false,
          message: "Address not found",
        };
      }

      return {
        success: true,
        message: "Address deleted successfully",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error deleting address",
      };
    }
  }
}
