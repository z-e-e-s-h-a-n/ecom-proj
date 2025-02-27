import { Router } from "express";
import * as controller from "@/controllers/category";

const router: Router = Router();

// CRUD Routes for Categories
router.route("/").get(controller.getCategories).post(controller.createCategory);

router
  .route("/:categoryId")
  .get(controller.getCategory)
  .delete(controller.deleteCategory);

export default router;
