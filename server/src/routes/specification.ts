// routes/product.ts
import { Router } from "express";
import * as controller from "@/controllers/specification";

const router: Router = Router();

// Specification routes
router
  .route("/")
  .get(controller.getSpecifications)
  .post(controller.createSpecification);

router
  .route("/:specsId")
  .get(controller.getSpecification)
  .delete(controller.deleteSpecification);

export default router;
