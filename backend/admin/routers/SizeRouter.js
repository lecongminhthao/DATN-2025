// routes/sizeRoutes.js
const express = require("express");
const router = express.Router();
const sizeController = require("../controller/SizeController");

// Route API để tạo size
router.post("/Size", sizeController.createSize);

// Route API để lấy danh sách size với phân trang
router.get("/Size", sizeController.getSizes);

// Route API để lấy chi tiết size theo ID
router.get("/Size/:id", sizeController.getSizeById);

router.put("/Size/:id", sizeController.updateSize);

router.get("/Size/category/:id", sizeController.getSizesByCategory);

module.exports = router;
