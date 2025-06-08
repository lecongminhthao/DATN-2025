const Image = require("../model/ImageModel");

exports.createImage = async (req, res) => {
  try {
    const { productId, url, altText } = req.body;

    const status = 1;
    const newImage = new Image({
      productId,
      url,
      altText,
      status,
    });

    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tạo ảnh", error });
  }
};

// 📌 Cập nhật ảnh
exports.updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, altText, status } = req.body;

    const updated = await Image.findByIdAndUpdate(
      id,
      { url, altText, status },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Không tìm thấy ảnh" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật ảnh", error });
  }
};

// 📌 Lấy danh sách ảnh theo productId
exports.getImagesByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await Image.find({ productId });
    res.json(images);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy ảnh", error });
  }
};

// 📌 Lấy danh sách ảnh có phân trang và kèm thông tin sản phẩm
exports.getPaginatedImages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      Image.find()
        .populate("productId", "name importPrice salePrice")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Image.countDocuments(),
    ]);

    res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalImages: total,
      images,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi lấy danh sách ảnh phân trang", error });
  }
};
exports.getImageById = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await Image.findById(id).populate(
      "productId",
      "name importPrice salePrice"
    );

    if (!image) return res.status(404).json({ message: "Không tìm thấy ảnh" });

    res.json(image);
  } catch (error) {
    res.status(500).json({ message: "Lỗi lấy chi tiết ảnh", error });
  }
};
exports.deleteImage = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Image.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ message: "Không tìm thấy ảnh" });

    res.json({ message: "Ảnh đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa ảnh", error });
  }
};
