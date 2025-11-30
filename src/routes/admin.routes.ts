import { Elysia } from "elysia";
import { AdminController, updateUserRoleSchema } from "../controllers/admin.controller";
import { authenticate as authMiddleware, authorize } from "../middleware/auth.middleware";

export const adminRoutes = new Elysia({ prefix: "/admin" })
  .derive(authMiddleware)
  .onBeforeHandle((context) => {
    const { user, set } = context as any;
    if (!user) {
      set.status = 401;
      return { success: false, message: "Authentication required" };
    }
    if (user.role !== "admin") {
      set.status = 403;
      return { success: false, message: "You do not have permission to access this resource" };
    }
  })
  .get("/users", (context) => {
    const { set } = context as any;
    return AdminController.getAllUsers({ set });
  }, {
    detail: { tags: ["Admin"], security: [{ cookieAuth: [] }] },
  })
  .put("/users/:id/ban", (context) => {
    const { params, set } = context as any;
    return AdminController.banUser({ params, set });
  }, {
    detail: { tags: ["Admin"], security: [{ cookieAuth: [] }] },
  })
  .put("/users/:id/unban", (context) => {
    const { params, set } = context as any;
    return AdminController.unbanUser({ params, set });
  }, {
    detail: { tags: ["Admin"], security: [{ cookieAuth: [] }] },
  })
  .put("/users/:id/role", (context) => {
    const { params, body, set } = context as any;
    return AdminController.updateUserRole({ params, body, set });
  }, {
    body: updateUserRoleSchema,
    detail: { tags: ["Admin"], security: [{ cookieAuth: [] }] },
  });
