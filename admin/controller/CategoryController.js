const Category = require("../model/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    // Tính toán offset
    const skip = (page - 1) * limit;

    const categories = await Category.find().skip(skip).limit(limit);

    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / limit);

    res.status(200).json({
      categories,
      totalCategories,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh mục sản phẩm", error: err });
  }
};
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findById(id);

    if (!category) {
      return res
        .status(404)
        .json({ message: "Danh mục sản phẩm không tồn tại" });
    }

    res.status(200).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh mục sản phẩm", error: err });
  }
};

exports.createCategory = async (req, res) => {
  const { name, status } = req.body;

  try {
    const lastCategory = await Category.findOne().sort({ count: -1 });

    const newCode = lastCategory
      ? `MDS${String(lastCategory.count + 1).padStart(3, "0")}`
      : "MDS001";

    const newCategory = new Category({
      code: newCode,
      name,
      status,
      count: lastCategory ? lastCategory.count + 1 : 1,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi thêm danh mục sản phẩm", error: err });
  }
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { code, name, status } = req.body;

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { code, name, status },
      { new: true }
    );

    if (!updatedCategory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để cập nhật" });
    }

    res.status(200).json(updatedCategory);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật danh mục sản phẩm", error: err });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh mục để xóa" });
    }

    res.status(204).json({ message: "Danh mục sản phẩm đã được xóa" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa danh mục sản phẩm", error: err });
  }
};
exports.getCategoriesByStatus = async (req, res) => {
  try {
    const status = req.params.status;

    const categories = await Category.find({ status: status });
    console.log("Dữ liệu danh mục theo trạng thái: ", categories);
    if (!categories || categories.length === 0) {
      return res
        .status(404)
        .json({
          message: `Không tìm thấy danh mục sản phẩm có trạng thái ${status}`,
        });
    }
    return res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Lỗi khi lấy danh mục sản phẩm",
      error: error.message,
    });
  }
};
