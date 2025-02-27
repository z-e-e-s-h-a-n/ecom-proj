import { Router } from "express";
import * as controller from "@/controllers/shipping";

const shippingRouter: Router = Router();

// CRUD Routes
shippingRouter
  .route("/method")
  .post(controller.createShippingZone)
  .get(controller.getShippingZone);

shippingRouter
  .route("/method/:zoneId")
  .put(controller.updateShippingZone)
  .delete(controller.deleteShippingZone);

// Calculate shipping cost
shippingRouter.post("/calculate", controller.calculateShipping);

export default shippingRouter;
