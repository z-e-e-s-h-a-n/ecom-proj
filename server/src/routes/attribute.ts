// routes/product.ts
import { Router } from "express";
import * as controller from "@/controllers/attribute";

const router: Router = Router();

// Attribute routes
router
  .route("/")
  .get(controller.getAttributes)
  .post(controller.createAttribute);

router
  .route("/:attrId")
  .get(controller.getAttribute)
  .delete(controller.deleteAttribute);

export default router;
