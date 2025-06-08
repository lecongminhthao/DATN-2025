const Product = require("../model/ProductModel");

// Lấy sản phẩm theo phân trang
exports.getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(Number(limit))
      .exec();

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy sản phẩm." });
  }
};

// Kiểm tra tên sản phẩm đã tồn tại
const checkProductNameExist = async (name) => {
  const product = await Product.findOne({
    name: { $regex: new RegExp("^" + name + "$", "i") },
  });
  return product;
};

// Tạo mã sản phẩm tự động
const generateProductCode = async () => {
  const lastProduct = await Product.findOne().sort({ code: -1 }).exec();
  if (!lastProduct) return "P001";

  const lastCode = lastProduct.code;
  const lastNumber = parseInt(lastCode.replace("P", ""));
  const newNumber = lastNumber + 1;

  return `P${newNumber.toString().padStart(3, "0")}`;
};

// Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
  try {
    const { name, status, importPrice, salePrice } = req.body;

    const existingProduct = await checkProductNameExist(name);
    if (existingProduct) {
      return res.status(400).json({ message: "Tên sản phẩm đã tồn tại." });
    }

    const productCode = await generateProductCode();
    const discountPrice = 0;

    const newProduct = new Product({
      name,
      code: productCode,
      status: status || 1,
      importPrice,
      salePrice,
      discountPrice,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Không thể tạo sản phẩm." });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, importPrice, salePrice, discountPrice } = req.body;

    const existingProduct = await checkProductNameExist(name);
    if (existingProduct && existingProduct._id.toString() !== id) {
      return res.status(400).json({ message: "Tên sản phẩm đã tồn tại." });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, status, importPrice, salePrice, discountPrice },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Không thể cập nhật sản phẩm." });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm." });
    }
    res.status(200).json({ message: "Sản phẩm đã được xóa." });
  } catch (error) {
    res.status(500).json({ message: "Không thể xóa sản phẩm." });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy." });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy sản phẩm." });
  }
};

// Lấy danh sách sản phẩm đang hoạt động
exports.getActiveProducts = async (req, res) => {
  try {
    const activeProducts = await Product.find({ status: 1 });
    res.status(200).json(activeProducts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Không thể lấy danh sách sản phẩm đang hoạt động." });
  }
};

// Lấy sản phẩm theo trạng thái
exports.getProductsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const statusNumber = Number(status);

    const products = await Product.find({ status: statusNumber });
    res.status(200).json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Không thể lấy danh sách sản phẩm theo trạng thái." });
  }
};
