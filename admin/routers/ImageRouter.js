const express = require("express");
const router = express.Router();
const imageController = require("../controller/ImageController");
// Tạo ảnh
router.post("/Img", imageController.createImage);

// Cập nhật ảnh theo id
router.put("/Img/:id", imageController.updateImage);

// Lấy danh sách ảnh theo productId
router.get("/Img/product/:productId", imageController.getImagesByProduct);

router.get("/Imgs", imageController.getPaginatedImages);

router.get("/Img/:id", imageController.getImageById);

// 📌 API xóa ảnh theo ID
router.delete("/Img/:id", imageController.deleteImage);
module.exports = router;
