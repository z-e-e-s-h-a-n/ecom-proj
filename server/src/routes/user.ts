import { Router } from "express";
import * as controller from "@/controllers/user";

const router: Router = Router();

// User routes
router.get("/me", controller.getUser);

// Cart routes
router
  .route("/cart")
  .get(controller.getCart)
  .post(controller.addToCart)
  .put(controller.updateCart)
  .delete(controller.removeFromCart);

router
  .route("/wishlist")
  .get(controller.getWishlist)
  .post(controller.addToWishlist)
  .delete(controller.removeFromWishlist);

// Order routes
router.route("/orders").get(controller.getOrders).post(controller.placeOrder);
router.get("/orders/:orderId", controller.getOrderById);

// Payment routes
router.post("/payment/initiate", controller.initiatePayment);
router.post("/payment/verify", controller.verifyPayment);

router
  .route("/address")
  .get(controller.getAddresses)
  .post(controller.addAddress);

router
  .route("/address/:addressId")
  .get(controller.getAddress)
  .put(controller.updateAddress)
  .delete(controller.deleteAddress);

export default router;
