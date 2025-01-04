import { Router } from "express";
import { createFakeProducts, createFakeCategories } from "@/faker/product";
import { sendResponse } from "@/utils/helper";
import logger from "@/utils/logger";

const router: Router = Router();

router.post("/create-categories", async (_, res) => {
  try {
    const categories = await createFakeCategories();
    logger.info("categories created successfully!");
    sendResponse(res, 200, true, "Categories created successfully.", {
      categories,
    });
  } catch (error) {
    logger.error("Error creating categories:", error);
    sendResponse(res, 500, false, "Failed to create categories.");
  }
});

router.post("/create-products", async (req, res) => {
  try {
    const { count = 10 } = req.body;
    const products = await createFakeProducts(count);
    logger.info(`${count} products created successfully!`);
    sendResponse(res, 200, true, "Products created successfully.", {
      products,
    });
  } catch (error) {
    logger.error("Error creating products:", error);
    sendResponse(res, 500, false, "Failed to create products.");
  }
});

export default router;
