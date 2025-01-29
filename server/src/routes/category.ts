import { Router } from "express";
import * as controller from "@/controllers/category";

const router: Router = Router();

// CRUD Routes for Categories
router
  .route("/")
  .get(controller.getCategories)
  .post(controller.createCategories);

router
  .route("/:categoryId")
  .get(controller.getCategoryById)
  .delete(controller.deleteCategory);

export default router;
