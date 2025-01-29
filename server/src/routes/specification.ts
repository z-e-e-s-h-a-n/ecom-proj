// routes/product.ts
import { Router } from "express";
import * as controller from "@/controllers/specification";

const router: Router = Router();

// Specification routes
router.route("/").get(controller.getSpecs).post(controller.createSpecs);

router
  .route("/:specsId")
  .get(controller.getSpecsById)
  .delete(controller.deleteSpecs);

export default router;
