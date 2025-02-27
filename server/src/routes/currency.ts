import { Router } from "express";
import * as controller from "@/controllers/currency";

const router: Router = Router();

router.route("/").get(controller.getCurrencies).post(controller.createCurrency);

router.get("/:currency", controller.getCurrency);

router
  .route("/:currencyId")
  .put(controller.updateCurrency)
  .delete(controller.deleteCurrency);

export default router;
