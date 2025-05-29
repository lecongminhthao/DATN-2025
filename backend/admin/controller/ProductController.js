const Product = require("../model/ProductModel");

// tạo sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image } = req.body;
    const existingProduct = await checkProductExists(name);
    if (existingProduct) {
      return res.status(400).json({ message: "Sản phẩm đã tồn tại" });
    }
    const productCode = await generateProductCode();
    const discountPrice = 0;
    const newProduct = new Product({
      name,
      price,
      description,
      category,
      image,
      productCode,
      discountPrice,
    });
    await newProduct.save();
    res.status(201).json({
      message: "Sản phẩm đã được tạo thành công",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "tạo thất bại",
    });
  }
};

// tạo mới produtc
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, importPrice, salePrice, discountPrice } = req.body;

    const existingProduct = await checkProdcutNameExists(name);
    if (existingProduct && existingProduct._id.toString() !== id) {
      return res.status(400).json({ message: "Tên sản phẩm đã tồn tại" });
    }
    const updatProduct = await Product.finbdByIdAndUpdate(
      id,
      {
        name,
        status,
        importPrice,
        salePrice,
        discountPrice,
      },
      { new: true }
    );
    if (!updatProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json(updatProduct);
  } catch (error) {
    res.status(500).json({
      message: "Cập nhật sản phẩm thất bại",
    });
  }
};
// sửa sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, importPrice, salePrice, discountPrice } = req.body;
    const existingProduct = await checkProdcutNameExists(name);
    if (existingProduct && existingProduct._id.toString() !== id) {
      return res.status(400).json({ message: "Tên sản phẩm đã tồn tại" });
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        status,
        importPrice,
        salePrice,
        discountPrice,
      },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Cập nhật sản phẩm thất bại",
    });
  }
};
//xóa sản phẩm

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json({ message: "Sản phẩm đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({
      message: "Xóa sản phẩm thất bại",
    });
  }
};
// lấy sản phẩm theo id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Lấy sản phẩm thất bại",
    });
  }
};
