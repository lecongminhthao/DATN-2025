// controllers/ProductTypeController.js
const ProductType = require("../model/ProductTypeModel");
const Category = require("../model/Category");

const generateProductTypeCode = async () => {
  const lastProductType = await ProductType.findOne().sort({ code: -1 }); // Lấy loại sản phẩm có mã mới nhất
  if (!lastProductType) {
    return "T001"; // Nếu chưa có loại sản phẩm nào, trả về mã đầu tiên là T001
  }

  const lastCode = lastProductType.code; // Mã sản phẩm cuối cùng, ví dụ: T005
  const numericPart = lastCode.substring(1); // Lấy phần số của mã (ví dụ: từ 'T005' lấy '005')
  const nextNumber = parseInt(numericPart) + 1; // Tăng số lên 1, ví dụ: từ 5 -> 6
  const nextCode = "T" + String(nextNumber).padStart(3, "0"); // Tạo mã mới, ví dụ: 'T006'

  return nextCode; // Trả về mã mới
};

// API tạo mới loại sản phẩm
exports.createProductType = async (req, res) => {
  try {
    const { name, description, category, status } = req.body;

    // Kiểm tra xem category có tồn tại trong cơ sở dữ liệu không
    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

    // Tạo mã loại sản phẩm tự động (ví dụ T001)
    const lastProductType = await ProductType.findOne().sort({ code: -1 }); // Lấy loại sản phẩm có mã mới nhất
    const nextCode = lastProductType
      ? `T${String(parseInt(lastProductType.code.substring(1)) + 1).padStart(
          3,
          "0"
        )}`
      : "T001";

    // Tạo đối tượng loại sản phẩm mới
    const newProductType = new ProductType({
      name,
      description,
      category,
      status: status || 1, // Nếu không có giá trị status, mặc định là 1
      code: nextCode, // Sinh mã tự động
    });

    // Lưu loại sản phẩm vào cơ sở dữ liệu
    await newProductType.save();
    res
      .status(201)
      .json({ message: "Loại sản phẩm đã được tạo", data: newProductType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi tạo loại sản phẩm", error: err });
  }
};
exports.getProductTypes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
    const limit = parseInt(req.query.limit) || 1; // Số lượng product types mỗi trang (mặc định là 10)
    const searchQuery = req.query.searchQuery || ""; // Tìm kiếm theo tên hoặc mã Product Type

    const skip = (page - 1) * limit; // Số lượng bỏ qua, tùy theo trang hiện tại

    // Truy vấn dữ liệu Product Types với thông tin phân trang và tìm kiếm
    const productTypes = await ProductType.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } }, // Tìm kiếm theo tên, không phân biệt chữ hoa/thường
        { code: { $regex: searchQuery, $options: "i" } }, // Tìm kiếm theo mã, không phân biệt chữ hoa/thường
      ],
    })
      .populate("category") // Lấy thông tin thể loại
      .skip(skip) // Bỏ qua các sản phẩm trước đó
      .limit(limit); // Giới hạn số lượng sản phẩm trong mỗi trang

    // Tính tổng số Product Types sau khi lọc theo searchQuery
    const totalProductTypes = await ProductType.countDocuments({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { code: { $regex: searchQuery, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(totalProductTypes / limit); // Tính tổng số trang

    // Log totalPages trước khi trả về phản hồi
    console.log("Total Pages:", totalPages); // In ra totalPages

    // Trả về kết quả dưới dạng JSON với đầy đủ thông tin phân trang
    res.status(200).json({
      productTypes, // Danh sách các Product Types
      currentPage: page, // Trang hiện tại
      totalPages, // Tổng số trang
      totalProductTypes, // Tổng số Product Types trong cơ sở dữ liệu
    });
  } catch (err) {
    // Xử lý lỗi nếu có
    console.error("Error fetching product types:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách Product Types", error: err });
  }
};

// API cập nhật ProductType
exports.updateProductType = async (req, res) => {
  try {
    // Destructure incoming data
    const { name, categoryId, description, status } = req.body;
    const { id } = req.params;

    // Validate inputs
    if (!name || !categoryId || status === undefined) {
      return res
        .status(400)
        .json({
          message:
            "Vui lòng cung cấp đầy đủ thông tin (name, categoryId, status).",
        });
    }

    // Check if category exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Thể loại không tồn tại" });
    }

    // Find product type by ID
    const productType = await ProductType.findById(id);
    if (!productType) {
      return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
    }

    // Update product type fields
    productType.name = name;
    productType.category = categoryId;
    productType.description = description || productType.description; // Allow description to be optional (fallback to current description if not provided)
    productType.status = status;

    // Save the updated product type
    await productType.save();

    // Return the updated product type
    res.status(200).json(productType);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi sửa loại sản phẩm", error: err.message });
  }
};

// API xóa ProductType
exports.deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;

    const productType = await ProductType.findById(id);
    console.log(productType);
    if (!productType) {
      return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
    }

    // Thử dùng deleteOne thay vì remove
    const result = await ProductType.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return res.status(400).json({ message: "Không thể xóa loại sản phẩm" });
    }

    res.status(200).json({ message: "Xóa loại sản phẩm thành công" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa loại sản phẩm", error: err.message });
  }
};
// API lấy chi tiết loại sản phẩm theo ID
exports.getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm kiếm loại sản phẩm theo ID
    const productType = await ProductType.findById(id).populate("category"); // Dùng .populate() nếu bạn muốn lấy thêm thông tin từ bảng 'category'

    if (!productType) {
      return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
    }

    // Trả về thông tin chi tiết loại sản phẩm
    res.status(200).json(productType);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy chi tiết loại sản phẩm",
        error: err.message,
      });
  }
};

exports.getProductTypesByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id; // Lấy từ route param

    // Tìm theo categoryId và status = 1
    const productTypes = await ProductType.find({
      category: categoryId,
      status: 1,
    }).populate("category");

    if (!productTypes || productTypes.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy loại sản phẩm cho danh mục này" });
    }

    res.status(200).json(productTypes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách loại sản phẩm",
        error: err.message,
      });
  }
};
