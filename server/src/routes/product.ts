// routes/product.ts
import { Router } from "express";
import * as controller from "@/controllers/product";
import { authGuard } from "@/middlewares/auth";

const router: Router = Router();

// CRUD Routes for Products
router.post("/", controller.createProduct);
router.put("/:productId", controller.updateProduct);
router.get("/:productId", controller.getProduct);
router.get("/", controller.getProducts);
router.delete("/:productId", controller.deleteProduct);

// Review routes
router.post("/:productId/review", authGuard(), controller.addReview);
router.get("/:productId/reviews", controller.getReviewsForProduct);

export default router;
