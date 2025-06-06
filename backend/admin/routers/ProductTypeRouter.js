const express = require("express");
const router = express.Router();
const productTypeController = require("../controller/ProductTypeController");

router.post("/ProductType", productTypeController.createProductType);

router.get("/ProductTypes", productTypeController.getProductTypes);

router.get("/ProductType/:id", productTypeController.getProductTypeById);

router.put("/ProductType/:id", productTypeController.updateProductType);

router.delete("/ProductType/:id", productTypeController.deleteProductType);

router.get(
  "/ProductType/category/:id",
  productTypeController.getProductTypesByCategory
);

module.exports = router;
