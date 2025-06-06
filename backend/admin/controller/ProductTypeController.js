const ProductType = require("../model/ProductTypeModel");
const Category = require("../model/Category");

const generateProductTypeCode = async () => {
  const lastProductType = await ProductType.findOne().sort({ code: -1 });
  if (!lastProductType) {
    return "T001";
  }

  const lastCode = lastProductType.code;
  const numericPart = lastCode.substring(1);
  const nextNumber = parseInt(numericPart) + 1;
  const nextCode = "T" + String(nextNumber).padStart(3, "0");

  return nextCode;
};


exports.createProductType = async (req, res) => {
  try {
    const { name, description, category, status } = req.body;


    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(400).json({ message: "Danh mục không tồn tại" });
    }

 
    const lastProductType = await ProductType.findOne().sort({ code: -1 });
    const nextCode = lastProductType
      ? `T${String(parseInt(lastProductType.code.substring(1)) + 1).padStart(
          3,
          "0"
        )}`
      : "T001";


    const newProductType = new ProductType({
      name,
      description,
      category,
      status: status || 1,
      code: nextCode,
    });

   
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 1;
    const searchQuery = req.query.searchQuery || "";

    const skip = (page - 1) * limit; 


    const productTypes = await ProductType.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { code: { $regex: searchQuery, $options: "i" } },
      ],
    })
      .populate("category") 
      .skip(skip) 
      .limit(limit); 


    const totalProductTypes = await ProductType.countDocuments({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { code: { $regex: searchQuery, $options: "i" } },
      ],
    });

    const totalPages = Math.ceil(totalProductTypes / limit); 

   
    console.log("Total Pages:", totalPages); 

   
    res.status(200).json({
      productTypes, 
      currentPage: page, 
      totalPages, 
      totalProductTypes, 
    });
  } catch (err) {
    
    console.error("Error fetching product types:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách Product Types", error: err });
  }
};


exports.updateProductType = async (req, res) => {
  try {
   
    const { name, categoryId, description, status } = req.body;
    const { id } = req.params;

    if (!name || !categoryId || status === undefined) {
      return res
        .status(400)
        .json({
          message:
            "Vui lòng cung cấp đầy đủ thông tin (name, categoryId, status).",
        });
    }

   
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Thể loại không tồn tại" });
    }

 
    const productType = await ProductType.findById(id);
    if (!productType) {
      return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
    }

  
    productType.name = name;
    productType.category = categoryId;
    productType.description = description || productType.description; 
    productType.status = status;

 
    await productType.save();


    res.status(200).json(productType);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Lỗi khi sửa loại sản phẩm", error: err.message });
  }
};


exports.deleteProductType = async (req, res) => {
  try {
    const { id } = req.params;

    const productType = await ProductType.findById(id);
    console.log(productType);
    if (!productType) {
      return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
    }


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

exports.getProductTypeById = async (req, res) => {
  try {
    const { id } = req.params;

  
    const productType = await ProductType.findById(id).populate("category"); 

    if (!productType) {
      return res.status(404).json({ message: "Loại sản phẩm không tồn tại" });
    }


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
    const categoryId = req.params.id; 
    
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
