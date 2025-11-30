import { Context } from "elysia";
import * as v from "valibot";
import { wishlistModel } from "../models/wishlist.model";
import { recentlyViewedModel } from "../models/recentlyViewed.model";
import { AuthContext } from "../middleware/auth.middleware";

export class CustomerController {
  // Wishlist
  static async getWishlist(context: Pick<AuthContext, "user" | "set">) {
    const { user, set } = context;
    try {
      const wishlist = await wishlistModel.findAllByUserId(user.userId);
      return {
        success: true,
        data: wishlist,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error fetching wishlist",
      };
    }
  }

  static async addToWishlist(context: Pick<AuthContext, "user" | "params" | "set">) {
    const { user, params, set } = context;
    const productId = parseInt(params.productId as string);
    try {
      const item = await wishlistModel.add(user.userId, productId);
      set.status = 201;
      return {
        success: true,
        message: "Added to wishlist",
        data: item,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error adding to wishlist",
      };
    }
  }

  static async removeFromWishlist(context: Pick<AuthContext, "user" | "params" | "set">) {
    const { user, params, set } = context;
    const productId = parseInt(params.productId as string);
    try {
      const removed = await wishlistModel.remove(user.userId, productId);
      if (!removed) {
        set.status = 404;
        return {
          success: false,
          message: "Item not found in wishlist",
        };
      }
      return {
        success: true,
        message: "Removed from wishlist",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error removing from wishlist",
      };
    }
  }

  // Recently Viewed
  static async getRecentlyViewed(context: Pick<AuthContext, "user" | "set">) {
    const { user, set } = context;
    try {
      const recent = await recentlyViewedModel.getRecent(user.userId);
      return {
        success: true,
        data: recent,
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error fetching history",
      };
    }
  }

  static async addRecentlyViewed(context: Pick<AuthContext, "user" | "params" | "set">) {
    const { user, params, set } = context;
    const productId = parseInt(params.productId as string);
    try {
      await recentlyViewedModel.add(user.userId, productId);
      return {
        success: true,
        message: "Recorded view",
      };
    } catch (error: unknown) {
      set.status = 400;
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error recording view",
      };
    }
  }

  // Order History (Stub)
  static async getOrders(context: Pick<AuthContext, "user" | "set">) {
    const { user, set } = context;
    // Stub implementation
    return {
      success: true,
      data: [
        {
          id: 1,
          date: new Date(),
          total: 99.99,
          status: "delivered",
          items: [{ name: "Sample Item", price: 99.99, quantity: 1 }],
        },
      ],
    };
  }
}
