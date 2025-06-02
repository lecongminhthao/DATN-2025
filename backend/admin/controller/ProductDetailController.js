const ProductDetail = require("../model/ProductDetailModel");
const Image = require("../model/ImageModel");

exports.createProductDetail = async (req, res) => {
  try {
    const { product, color, size, category, producttype, quantity, barcode } =
      req.body;

    const errors = [];

    if (!product) errors.product = "Sản phẩm không được để trống.";
    if (!color) errors.color = "Màu sắc không được để trống.";
    if (!size) errors.size = "Kích thước không được để trống.";
    if (!category) errors.category = "Danh mục không được để trống.";
    if (!producttype) errors.producttype = "Loại sản phẩm không được để trống.";
    if (!quantity || quantity < 0) errors.quantity = "Số lượng không hợp lệ";
    if (!barcode || barcode.length !== 13)
      errors.barcode = "Mã vạch phải có 13 ký tự";

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    const existingDetail = await ProductDetail.findOne({
      product,
      color,
      size,
      category,
      producttype,
    });

    if (existingDetail) {
      return res.status(400).json({ error: "Sản phẩm đã tồn tại" });
    }

    const status = 1;
    const discountPrice = 0;

    const newProductDetail = new ProductDetail({
      product,
      color,
      size,
      category,
      producttype,
      quantity,
      barcode,
      status,
      discountPrice,
    });

    const saveProductDetail = await newProductDetail.save();

    res.status(201).json(saveProductDetail);
  } catch (error) {
    res.status(500).json({ error: "Đã xảy ra lỗi server" });
  }
};

exports.checkBarcode = async (req, res) => {
    const { barcode }   = req.body;

    try {
        if (barcode.length !== 13) {
            return res.status(400).json({ error: "Mã vạch không hợp lệ" });
        }
        
        const existingProduct = await ProductDetail.findOne({ barcode });
        
        if (existingProduct) {
            return res.status(200).json({ isUnique: false });
        }

        res.status(200).json({ isUnique: true });
    }
    catch (error) {
        res.status(500).json({ error: "Có lỗi khi kiểm tra barcode" });
    }
}

exports.getProductDetailList = async (req, res) => {
  try {
    let { page, limit } = req.query;

    // Nếu page hoặc limit không được cung cấp, mặc định là trang 1 và giới hạn 5 sản phẩm mỗi trang
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 5;
    const skip = (page - 1) * limit;

    console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`); // Log thông tin phân trang

    // Lấy danh sách chi tiết sản phẩm với phân trang và populate các dữ liệu liên quan
    const productDetails = await ProductDetail.find()
      .skip(skip)
      .limit(limit)
      .populate("product") // Populate thông tin sản phẩm (tên sản phẩm, giá...)
      .populate("category") // Populate thông tin danh mục sản phẩm
      .populate("producttype") // Populate loại sản phẩm
      .populate("color") // Populate màu sắc sản phẩm
      .populate("size"); // Populate kích cỡ sản phẩm

    // Lấy tổng số chi tiết sản phẩm
    const totalProductDetails = await ProductDetail.countDocuments();

    console.log(`Total Product Details: ${totalProductDetails}`); // Log tổng số chi tiết sản phẩm

    // Trả về kết quả
    res.status(200).json({
      productDetails,
      pagination: {
        total: totalProductDetails,
        page,
        limit,
        totalPages: Math.ceil(totalProductDetails / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Có lỗi xảy ra" });
  }
};

exports.getProductDetailById = async (req, res) => {
  const { id } = req.params; // Lấy ID từ tham số URL

  try {
    // Tìm chi tiết sản phẩm theo ID và populate các trường liên quan
    const productDetail = await ProductDetail.findById(id)
      .populate("product") // Populating thông tin sản phẩm
      .populate("category") // Populating danh mục sản phẩm
      .populate("producttype") // Populating loại sản phẩm
      .populate("color") // Populating màu sắc sản phẩm
      .populate("size"); // Populating kích cỡ sản phẩm

    // Nếu không tìm thấy chi tiết sản phẩm
    if (!productDetail) {
      return res
        .status(404)
        .json({ error: "Chi tiết sản phẩm không tồn tại." });
    }

    // Trả về chi tiết sản phẩm
    res.status(200).json(productDetail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Có lỗi xảy ra khi lấy chi tiết sản phẩm." });
  }
};

exports.updateProductDetail = async (req, res) => {
  const { id } = req.params;
  const { product, color, size, category, producttype, quantity, status } =
    req.body;

  try {
    const productDetail = await ProductDetail.findById(id);

    if (!productDetail) {
      return res
        .status(404)
        .json({ error: "Chi tiết sản phẩm không tồn tại." });
    }

    // ✅ Chỉ cập nhật nếu không phải undefined (cho phép falsy như 0)
    if (product !== undefined) productDetail.product = product;
    if (color !== undefined) productDetail.color = color;
    if (size !== undefined) productDetail.size = size;
    if (category !== undefined) productDetail.category = category;
    if (producttype !== undefined) productDetail.producttype = producttype;
    if (quantity !== undefined) productDetail.quantity = quantity;
    if (status !== undefined) productDetail.status = status;

    const updatedProductDetail = await productDetail.save();

    res.status(200).json(updatedProductDetail);
  } catch (err) {
    console.error("[ERROR] updateProductDetail:", err);
    res
      .status(500)
      .json({ error: "Có lỗi xảy ra khi cập nhật chi tiết sản phẩm." });
  }
};
