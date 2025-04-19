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
    const images = req.files?.map((file) => ({
      url: `/uploads/${file.filename}`,
      altText: file.originalname,
    }));

    const {
      name,
      description,
      price,
      category,
      collection,
      variants: variantsString,
      isBestSeller = false,
      isNewArrival = false,
    } = req.body;

    console.log('🧾 Body:', req.body);
    console.log('🖼️ Files:', req.files);

    const variants = JSON.parse(variantsString || '[]');

    const product = await productService.createProduct({
      name,
      description,
      price,
      category,
      collection,
      variants,
      images,
      isBestSeller,
      isNewArrival,
    });

    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('❌ Error in createProduct controller:', error);
    return res.status(500).json({ success: false, message: 'Failed to create product.', error: error.message });
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
