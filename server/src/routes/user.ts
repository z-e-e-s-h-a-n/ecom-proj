import { Router } from "express";
import { authGuard } from "@/middlewares/auth";
import * as controller from "@/controllers/user";

const router: Router = Router();

// User routes
router.get("/me", authGuard(), controller.getUser);

// Cart routes
router.get("/cart", authGuard(), controller.getCart);
router.post("/cart", authGuard(), controller.addToCart);
router.delete("/cart/:productId", authGuard(), controller.removeFromCart);

// Wishlist routes
router.get("/wishlist", authGuard(), controller.getWishlist);
router.post("/wishlist", authGuard(), controller.addToWishlist);
router.delete(
  "/wishlist/:productId",
  authGuard(),
  controller.removeFromWishlist
);

// Order routes
router.get("/orders", authGuard(), controller.getUserOrders);
router.post("/orders", authGuard(), controller.placeOrder);
router.get("/orders/:orderId", authGuard(), controller.getOrderById);

// Payment routes
router.post("/payment/initiate", authGuard(), controller.initiatePayment);
router.post("/payment/verify", authGuard(), controller.verifyPayment);

export default router;
