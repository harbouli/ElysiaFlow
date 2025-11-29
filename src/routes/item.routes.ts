import { Elysia } from "elysia";
import * as v from "valibot";
import { ItemController } from "../controllers/item.controller";

// Validation schemas
const createItemSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "Name is required")),
  description: v.pipe(v.string(), v.minLength(1, "Description is required")),
});

const updateItemSchema = v.object({
  name: v.optional(v.pipe(v.string(), v.minLength(1, "Name cannot be empty"))),
  description: v.optional(
    v.pipe(v.string(), v.minLength(1, "Description cannot be empty"))
  ),
});

export const itemRoutes = new Elysia({ prefix: "/items" })
  .get("/", ItemController.getAll)

  .get("/:id", ItemController.getById)

  .post("/", ItemController.create, {
    body: createItemSchema,
  })

  .put("/:id", ItemController.update, {
    body: updateItemSchema,
  })

  .delete("/:id", ItemController.delete);
