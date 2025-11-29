import { Elysia, t } from "elysia";
import { ItemController } from "../controllers/item.controller";

export const itemRoutes = new Elysia({ prefix: "/items" })
  .get("/", ItemController.getAll)
  .get("/:id", ItemController.getById)
  .post("/", ItemController.create, {
    body: t.Object({
      name: t.String(),
      description: t.String(),
    }),
  })
  .put("/:id", ItemController.update, {
    body: t.Object({
      name: t.Optional(t.String()),
      description: t.Optional(t.String()),
    }),
  })
  .delete("/:id", ItemController.delete);
