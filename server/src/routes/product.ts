// routes/product.ts
import { Router } from "express";
import * as controller from "@/controllers/product";

const router: Router = Router();

// CRUD Routes for Products
router.route("/").post(controller.createProduct).get(controller.getProducts);

router
  .route("/:productId")
  .get(controller.getProduct)
  .put(controller.updateProduct)
  .delete(controller.deleteProduct);

export default router;
