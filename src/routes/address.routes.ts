import { Elysia } from "elysia";
import { AddressController, createAddressSchema, updateAddressSchema } from "../controllers/address.controller";
import { authenticate as authMiddleware } from "../middleware/auth.middleware";

export const addressRoutes = new Elysia({ prefix: "/users/me/addresses" })
  .derive(authMiddleware)
  .get("/", (context) => {
    const { user, set } = context as any;
    return AddressController.getAll({ user, set });
  }, {
    detail: { tags: ["Address"], security: [{ cookieAuth: [] }] },
  })
  .post("/", (context) => {
    const { user, body, set } = context as any;
    return AddressController.create({ user, body, set });
  }, {
    body: createAddressSchema,
    detail: { tags: ["Address"], security: [{ cookieAuth: [] }] },
  })
  .put("/:id", (context) => {
    const { user, params, body, set } = context as any;
    return AddressController.update({ user, params, body, set });
  }, {
    body: updateAddressSchema,
    detail: { tags: ["Address"], security: [{ cookieAuth: [] }] },
  })
  .delete("/:id", (context) => {
    const { user, params, set } = context as any;
    return AddressController.delete({ user, params, set });
  }, {
    detail: { tags: ["Address"], security: [{ cookieAuth: [] }] },
  });
