import { Router } from "express";
import * as controller from "@/controllers/currency";

const router: Router = Router();

router
  .route("/")
  .get(controller.getAllCurrencies)
  .post(controller.createCurrency);

router.get("/:currency", controller.getCurrencyInfo);

router
  .route("/:id")
  .put(controller.updateCurrency)
  .delete(controller.deleteCurrency);

export default router;
