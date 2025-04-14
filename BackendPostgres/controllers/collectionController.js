const factory = require("./handlerFactory");

exports.getAllCollections = factory.getAll(
  { modelName: "Collection" },
  {
    images: true,
    variants: true,
    category: true,
    collection: true,
  }
);

exports.getCollectionById = factory.getOne(
  { modelName: "Collection" },
  {
    images: true,
    variants: true,
    category: true,
    collection: true,
  }
);

exports.createCollection = factory.createOne({ modelName: "Collection" });
exports.updateCollectionById = factory.updateOne({ modelName: "Collection" });
exports.deleteCollectionById = factory.deleteOne({ modelName: "Collection" });

exports.searchCollection = factory.getAll(
  { modelName: "Collection" },
  {
    images: true,
    variants: true,
    category: true,
    collection: true,
  }
);
