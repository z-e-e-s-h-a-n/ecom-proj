import { Router } from "express";
import * as controller from "@/controllers/shipping";

const shippingRouter: Router = Router();

// CRUD Routes
shippingRouter
  .route("/method")
  .post(controller.createShippingMethods)
  .get(controller.getShippingMethods);

shippingRouter
  .route("/method/:id")
  .put(controller.updateShippingMethod)
  .delete(controller.deleteShippingMethod);

// Calculate shipping cost
shippingRouter.post("/calculate", controller.calculateShipping);

export default shippingRouter;
