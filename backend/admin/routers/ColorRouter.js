const express = require("express");
const router = express.Router();
const colorController = require("../controller/ColorController");

router.get("/Colors", colorController.getAllColors);
router.post("/Color", colorController.createColor);
router.put("/Color/:id", colorController.updateColor);
router.delete("/Color/:id", colorController.deleteColor);
router.get("/Color/:id", colorController.getColorById);
router.get("/Color/status/:status", colorController.getColorsByStatus);

module.exports = router;
