const express = require("express");
const router = express.Router();
const ProductDetailController = require("../controller/ProductDetailController");

// API để tạo chi tiết sản phẩm mới
router.post("/productdetail", ProductDetailController.createProductDetail);
router.post(
  "/productdetail/check-barcode",
  ProductDetailController.checkBarcode
);
//list productdetails
router.get("/productdetails", ProductDetailController.getProductDetailList);
//get productdetaaaill
router.get("/productdetail/:id", ProductDetailController.getProductDetailById);

router.put("/productdetail/:id", ProductDetailController.updateProductDetail);

module.exports = router;
