import { Router } from "express";
import * as controller from "@/controllers/shipping";

const shippingRouter: Router = Router();

// CRUD Routes
shippingRouter
  .route("/zone")
  .post(controller.addShippingZone)
  .get(controller.getShippingZone);

shippingRouter
  .route("/zone/:zoneId")
  .put(controller.updateShippingZone)
  .delete(controller.deleteShippingZone);

shippingRouter.post("/zone/:zoneId/method", controller.addShippingMethod);
shippingRouter
  .route("/zone/:zoneId/method/:methodId")
  .put(controller.updateShippingMethod)
  .delete(controller.deleteShippingMethod);

// Calculate shipping cost
shippingRouter.post("/calculate", controller.calculateShipping);

export default shippingRouter;
