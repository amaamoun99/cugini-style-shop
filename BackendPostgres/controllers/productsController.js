const factory = require("./handlerFactory");
const productService = require("../services/productServices");

////////////////////////////////////////////////////
exports.getAllProducts = factory.getAll(
  { modelName: "Product" },
  {
    images: true,
    variants: true,
    category: true,
    collection: true,
  }
);

exports.getProductById = factory.getOne(
  { modelName: "Product" },
  {
    images: true,
    variants: true,
    // category: true,
    // collection: true,
  }
);

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    // Handle error
  }
};
exports.updateProductById = factory.updateOne({ modelName: "Product" });


exports.searchProducts = factory.getAll(
  { modelName: "Product" },
  {
    images: true,
    variants: true,
    category: true,
    collection: true,
  }
);

exports.deleteProductById = async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
