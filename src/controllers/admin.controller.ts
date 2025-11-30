import { Context } from "elysia";
import * as v from "valibot";
import { userModel } from "../models/user.model";
import { AuthContext } from "../middleware/auth.middleware";

export const updateUserRoleSchema = v.object({
  role: v.picklist(["user", "admin"]),
});

export class AdminController {
  static async getAllUsers(context: Pick<AuthContext, "set">) {
    const { set } = context;
    try {
      const users = await userModel.findAll();
      return {
        success: true,
        data: users.map(u => u.toJSON()),
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error fetching users",
      };
    }
  }

  static async banUser(context: Pick<AuthContext, "params" | "set">) {
    const { params, set } = context;
    const id = parseInt(params.id as string);
    try {
      const user = await userModel.findById(id);
      if (!user) {
        set.status = 404;
        return { success: false, message: "User not found" };
      }

      await userModel.update(id, { isBanned: true });

      return {
        success: true,
        message: "User banned successfully",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error banning user",
      };
    }
  }

  static async unbanUser(context: Pick<AuthContext, "params" | "set">) {
    const { params, set } = context;
    const id = parseInt(params.id as string);
    try {
      const user = await userModel.findById(id);
      if (!user) {
        set.status = 404;
        return { success: false, message: "User not found" };
      }

      await userModel.update(id, { isBanned: false });

      return {
        success: true,
        message: "User unbanned successfully",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error unbanning user",
      };
    }
  }

  static async updateUserRole(context: Pick<AuthContext, "params" | "body" | "set">) {
    const { params, body, set } = context;
    const id = parseInt(params.id as string);
    try {
      const { role } = body as v.InferOutput<typeof updateUserRoleSchema>;
      
      const user = await userModel.findById(id);
      if (!user) {
        set.status = 404;
        return { success: false, message: "User not found" };
      }

      await userModel.update(id, { role });

      return {
        success: true,
        message: "User role updated successfully",
        data: { id, role },
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error updating role",
      };
    }
  }
}
