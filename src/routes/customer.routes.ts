import { Elysia } from "elysia";
import { CustomerController } from "../controllers/customer.controller";
import { authenticate as authMiddleware } from "../middleware/auth.middleware";

export const customerRoutes = new Elysia()
  .derive(authMiddleware)
  // Wishlist
  .get("/wishlist", (context) => {
    const { user, set } = context as any;
    return CustomerController.getWishlist({ user, set });
  }, {
    detail: { tags: ["Customer"], security: [{ cookieAuth: [] }] },
  })
  .post("/wishlist/:productId", (context) => {
    const { user, params, set } = context as any;
    return CustomerController.addToWishlist({ user, params, set });
  }, {
    detail: { tags: ["Customer"], security: [{ cookieAuth: [] }] },
  })
  .delete("/wishlist/:productId", (context) => {
    const { user, params, set } = context as any;
    return CustomerController.removeFromWishlist({ user, params, set });
  }, {
    detail: { tags: ["Customer"], security: [{ cookieAuth: [] }] },
  })
  // Recently Viewed
  .get("/users/me/recently-viewed", (context) => {
    const { user, set } = context as any;
    return CustomerController.getRecentlyViewed({ user, set });
  }, {
    detail: { tags: ["Customer"], security: [{ cookieAuth: [] }] },
  })
  .post("/users/me/recently-viewed/:productId", (context) => {
    const { user, params, set } = context as any;
    return CustomerController.addRecentlyViewed({ user, params, set });
  }, {
    detail: { tags: ["Customer"], security: [{ cookieAuth: [] }] },
  })
  // Orders
  .get("/users/me/orders", (context) => {
    const { user, set } = context as any;
    return CustomerController.getOrders({ user, set });
  }, {
    detail: { tags: ["Customer"], security: [{ cookieAuth: [] }] },
  });
