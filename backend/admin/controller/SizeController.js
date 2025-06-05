const Size = require("../model/SizeModel");
const Category = require("../model/Category");

// Hàm tạo mã size tự động (S001, S002, ...)
const generateSizeCode = async () => {
  const lastSize = await Size.findOne().sort({ code: -1 }); // Lấy size có mã mới nhất
  if (!lastSize) {
    return "S001"; // Nếu chưa có size nào, trả về mã đầu tiên
  }

  const lastCode = lastSize.code;
  const numericPart = lastCode.substring(1);
  const nextNumber = parseInt(numericPart) + 1;
  const nextCode = "S" + String(nextNumber).padStart(3, "0");

  return nextCode;
};

// API tạo Size
exports.createSize = async (req, res) => {
  try {
    const { name, categoryId, count } = req.body;

    // Kiểm tra xem size với tên và danh mục đã tồn tại chưa
    const existingSize = await Size.findOne({ name, category: categoryId });
    if (existingSize) {
      return res
        .status(400)
        .json({ message: "Size này đã tồn tại trong danh mục này!" });
    }

    const code = await generateSizeCode(); // Sinh mã size tự động

    const size = new Size({
      code,
      name,
      category: categoryId,
      count,
    });

    await size.save();
    res.status(201).json(size); // Trả về thông tin size đã tạo
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi thêm size", error: err });
  }
};

// API cập nhật Size
exports.updateSize = async (req, res) => {
  try {
    const { name, categoryId, count } = req.body;
    const { id } = req.params;

    // Kiểm tra xem size với tên và danh mục đã tồn tại chưa (trừ size hiện tại)
    const existingSize = await Size.findOne({
      name,
      category: categoryId,
      _id: { $ne: id },
    });
    if (existingSize) {
      return res
        .status(400)
        .json({ message: "Size này đã tồn tại trong danh mục này!" });
    }

    const size = await Size.findById(id);
    if (!size) {
      return res.status(404).json({ message: "Size không tồn tại" });
    }

    // Cập nhật thông tin size
    size.name = name;
    size.category = categoryId;
    size.count = count;

    await size.save();
    res.status(200).json(size);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi sửa size", error: err });
  }
};

// API lấy danh sách Size với phân trang
exports.getSizes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
    const limit = parseInt(req.query.limit) || 10; // Số lượng size mỗi trang (mặc định là 10)

    const skip = (page - 1) * limit;

    const sizes = await Size.find()
      .populate("category") // Lấy thông tin danh mục
      .skip(skip)
      .limit(limit);

    const totalSizes = await Size.countDocuments(); // Tổng số size có trong cơ sở dữ liệu
    const totalPages = Math.ceil(totalSizes / limit);

    res.status(200).json({
      sizes,
      currentPage: page,
      totalPages,
      totalSizes,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách size", error: err });
  }
};

// API lấy chi tiết Size theo ID
exports.getSizeById = async (req, res) => {
  try {
    const size = await Size.findById(req.params.id).populate("category");
    if (!size) {
      return res.status(404).json({ message: "Size không tồn tại" });
    }
    res.status(200).json(size);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy chi tiết size", error: err });
  }
};
exports.getSizesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;

    const sizes = await Size.find({ category: categoryId, status: 1 });

    if (!sizes || sizes.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy kích thước cho danh mục này" });
    }

    res.status(200).json(sizes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách size", error: err.message });
  }
};
