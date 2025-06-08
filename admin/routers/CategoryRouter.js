const express = require("express");
const router = express.Router();
const categoryController = require("../controller/CategoryController");

router.get("/category", categoryController.getAllCategories);

router.post("/category", categoryController.createCategory);

router.get("/category/:id", categoryController.getCategoryById);
router.put("/category/:id", categoryController.updateCategory);

router.delete("/category/:id", categoryController.deleteCategory);

router.get(
  "/category/categories-active/:status",
  categoryController.getCategoriesByStatus
);

module.exports = router;
