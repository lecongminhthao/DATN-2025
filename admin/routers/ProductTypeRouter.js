// routes/productTypeRoutes.js
const express = require("express");
const router = express.Router();
const productTypeController = require("../controller/ProductTypeController");

// Route để tạo loại sản phẩm
router.post("/ProductType", productTypeController.createProductType);

// Route để lấy tất cả loại sản phẩm
router.get("/ProductTypes", productTypeController.getProductTypes);

router.get("/ProductType/:id", productTypeController.getProductTypeById);

// Route để cập nhật loại sản phẩm
router.put("/ProductType/:id", productTypeController.updateProductType);

// Route để xóa loại sản phẩm
router.delete("/ProductType/:id", productTypeController.deleteProductType);

router.get(
  "/ProductType/category/:id",
  productTypeController.getProductTypesByCategory
);

module.exports = router;
