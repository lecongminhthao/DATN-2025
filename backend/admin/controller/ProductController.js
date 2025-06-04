const Product = require("../model/ProductModel");

// tạo sản phẩm
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


// cập nhật sản phẩm 
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
// lấy thêm các sảm phẩm theo status
exports.getProductsBystatus = async(req,res)=>{
  try{
    const {status} = req.params;
    const statusNumber = Number(status);
    const products = await Product.find({
      status: statusNumber
    });
    res.status(200).json(products)
  }catch(error){
    res.status(500).json({
      message: "không thể lấy danh sách sản phẩm theo status"
    });
  }
}
//lấy sản phẩm theo trang
exports.getAllProducts = async(req,res)=>{
  try {
    const {page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const products = await Products.find().skip(skip).limit(Number(limit)).exec();
    const totalProducts = await Products.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.json({
      products,
      totalPages,
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({
      message : " không thể lấy sản phẩm"
    })
  }
}

// kiểm tra sản phẩm có tồn tại hay không ?
const checkProdcutNameExists = async(name) => 
  {
  const product = await Product.findone({
    name : {$regex: new Regexp("^"+ name + "$", "i")},
  });
  return product;
}
// tao mã sản phẩm tự động của barcode
const generateProductCode = async () =>{
  const lastProduct = await Product.findone().sort({
    code: -1}).exec();
    if(!lastproduct) return "P001";

  const lastCode = lastProduct.code;
  const lastNumber = parseInt(lastCode.reqlace("P",""));

  const newNumber = lastNumber + 1;
  return `P${newNumber.toString().padStart(3,"0")}`;
}