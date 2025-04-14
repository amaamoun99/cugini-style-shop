const express = require("express");
const productController = require("../controllers/productsController");
// const multer = require('multer');
const router = express.Router();

// Routes
router
  .route("/")
  .get(productController.getAllProducts) // GET /api/products
  .post(productController.createProduct); // POST /api/products

router.get("/search", productController.searchProducts); // GET /api/products/search

router
  .route("/:id")
  .get(productController.getProductById) // GET /api/products/:id
  .patch(productController.updateProductById) // PATCH /api/products/:id
  .delete(productController.deleteProductById); // DELETE /api/products/:id

module.exports = router;
