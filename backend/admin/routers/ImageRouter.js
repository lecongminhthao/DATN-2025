const express = require("express");
const router = express.Router();
const imageController = require("../controller/ImageController");

router.post("/Img", imageController.createImage);

router.put("/Img/:id", imageController.updateImage);

router.get("/Img/product/:productId", imageController.getImagesByProduct);

router.get("/Imgs", imageController.getPaginatedImages);

router.get("/Img/:id", imageController.getImageById);

router.delete("/Img/:id", imageController.deleteImage);
module.exports = router;
