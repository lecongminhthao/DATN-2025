const express = require("express");
const router = express.Router();
const productController = require("../controller/ProductController");

// Lấy tất cả sản phẩm theo phân trang
router.get("/products", productController.getAllProducts);

// Tạo sản phẩm mới
router.post("/products", productController.createProduct);

// Cập nhật sản phẩm
router.put("/products/:id", productController.updateProduct);

router.get("/products/:id", productController.getProductById);

// Xóa sản phẩm
router.delete("/products/:id", productController.deleteProduct);

router.get(
  "/products/getbystatus/:status",
  productController.getProductsByStatus
);

module.exports = router;
