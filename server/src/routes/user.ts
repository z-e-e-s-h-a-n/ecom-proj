import { Router } from "express";
import * as controller from "@/controllers/user";

const router: Router = Router();

// User routes
router.get("/me", controller.getUser);

// Cart routes
router.get("/cart", controller.getCart);
router.post("/cart", controller.addToCart);
router.put("/cart", controller.updateCart);
router.delete("/cart/:productId", controller.removeFromCart);

router.get("/wishlist", controller.getWishlist);
router.post("/wishlist", controller.addToWishlist);
router.delete("/wishlist/:productId", controller.removeFromWishlist);

// Order routes
router.get("/orders", controller.getUserOrders);
router.post("/orders", controller.placeOrder);
router.get("/orders/:orderId", controller.getOrderById);

// Payment routes
router.post("/payment/initiate", controller.initiatePayment);
router.post("/payment/verify", controller.verifyPayment);

export default router;
