const express = require("express");
const collectionController = require("../controllers/collectionController");
// const multer = require('multer');
const router = express.Router();

// Routes
router
  .route("/")
  .get(collectionController.getAllCollections) // GET /api/Collections
  .post(collectionController.createCollection); // POST /api/Collections

router.get("/search", collectionController.searchCollection); // GET /api/Collections/search

router
  .route("/:id")
  .get(collectionController.getCollectionById) // GET /api/Collections/:id
  .patch(collectionController.updateCollectionById) // PATCH /api/Collections/:id
  .delete(collectionController.deleteCollectionById); // DELETE /api/Collections/:id

module.exports = router;
