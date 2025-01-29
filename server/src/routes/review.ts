// routes/product.ts
import { Router } from "express";
import * as controller from "@/controllers/review";
import { authGuard } from "@/middlewares/auth";

const router: Router = Router();

// Review routes
router
  .route("/:productId")
  .post(authGuard(), controller.addReview)
  .get(controller.getReviews);

router.delete("/:reviewId", authGuard(), controller.deleteReview);

export default router;
