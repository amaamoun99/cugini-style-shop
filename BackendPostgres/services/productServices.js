const { PrismaClient } = require("../generated/prisma"); // Adjust the path to your generated Prisma client
const prisma = new PrismaClient();

class ProductService {
  // Create a product with all related data
  async createProduct(productData) {
    const { name, description, price, collection, category, variants, images, isBestSeller = false, isNewArrival = false } =
      productData;

    return await prisma.$transaction(async (tx) => {
      // 1. Handle collection
      let collectionId = null;
      if (collection) {
        collectionId = await this._findOrCreateCollection(tx, collection);
      }

      // 2. Handle category
      let categoryId = null;
      if (category) {
        categoryId = await this._findOrCreateCategory(tx, category);
      }

      // 3. Create the main product
      const newProduct = await tx.product.create({
        data: {
          name,
          description,
          price: parseFloat(price),
          collectionId,
          categoryId,
          isBestSeller,
          isNewArrival,
        },
      });
      console.log("New product created:", newProduct.id);

      // 4. Create product variants
      if (variants && variants.length > 0) {
        await this._createProductVariants(tx, newProduct.id, variants);
      }

      // 5. Create product images
      if (images && images.length > 0) {
        await this._createProductImages(tx, newProduct.id, images);
      }

      // 6. Return the complete product with all relations
      return await tx.product.findUnique({
        where: { id: newProduct.id },
        include: {
          variants: true,
          images: true,
          collection: true,
          category: true,
        },
      });
    });
  }

// Helper to slugify a string
_slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

// Helper method to find or create a collection
async _findOrCreateCollection(tx, collectionName) {
  const slug = this._slugify(collectionName);

  const existingCollection = await tx.collection.findUnique({
    where: { slug },
  });

  if (existingCollection) {
    console.log("Collection already exists:", existingCollection.id);
    return existingCollection.id;
  }

  const newCollection = await tx.collection.create({
    data: {
      name: collectionName,
      slug,
    },
  });

  console.log("Created new collection:", newCollection.id);
  return newCollection.id;
}

// Helper method to find or create a category
async _findOrCreateCategory(tx, categoryName) {
  const slug = this._slugify(categoryName);

  const existingCategory = await tx.category.findUnique({
    where: { slug },
  });

  if (existingCategory) {
    console.log("Category already exists:", existingCategory.id);
    return existingCategory.id;
  }

  const newCategory = await tx.category.create({
    data: {
      name: categoryName,
      slug,
    },
  });

  console.log("Created new category:", newCategory.id);
  return newCategory.id;
}


  // Helper method to create product variants
  async _createProductVariants(tx, productId, variants) {
    console.log("Creating product variants:", variants);
    for (const variant of variants) {
      await tx.productVariant.create({
        data: {
          productId,
          size: variant.size,
          color: variant.color,
          stock: parseInt(variant.stock),
          sku: variant.sku,
        },
      });
    }
  }

  // Helper method to create product images
  async _createProductImages(tx, productId, images) {
    try {
      console.log("Creating product images:", images);

      if (!Array.isArray(images)) {
        throw new Error("Images must be an array");
      }

      const createdImages = await Promise.all(
        images.map((image) =>
          tx.productImage.create({
            data: {
              productId,
              url: image.url,
              altText: image.altText || image.url,
            },
          })
        )
      );

      return createdImages;
    } catch (error) {
      console.error("Error creating product images:", error);
      throw new Error(`Failed to create product images: ${error.message}`);
    }
  }

  async deleteProduct(productId) {
    try {
      return await prisma.$transaction(async (tx) => {
        // 1. Check if product exists
        const product = await tx.product.findUnique({
          where: { id: productId },
          include: { variants: true },
        });

        if (!product) {
          throw new Error("Product not found");
        }

        // 2. Delete all related cart items
        if (product.variants.length > 0) {
          await tx.cartItem.deleteMany({
            where: { variantId: { in: product.variants.map((v) => v.id) } },
          });
        }

        // 3. Delete all related wishlist items
        if (product.variants.length > 0) {
          await tx.wishlistItem.deleteMany({
            where: { variantId: { in: product.variants.map((v) => v.id) } },
          });
        }

        // 4. Delete all order items
        if (product.variants.length > 0) {
          await tx.orderItem.deleteMany({
            where: { variantId: { in: product.variants.map((v) => v.id) } },
          });
        }

        // 5. Delete product images
        await tx.productImage.deleteMany({
          where: { productId },
        });

        // 6. Delete product variants
        await tx.productVariant.deleteMany({
          where: { productId },
        });

        // 7. Finally, delete the product
        await tx.product.delete({
          where: { id: productId },
        });

        return { success: true, message: "Product deleted successfully" };
      });
    } catch (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async getProductById(id) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          variants: true,
          images: true,
          category: true,
          collection: true,
        },
      });

      if (!product) {
        throw new Error("Product not found");
      }

      return product;
    } catch (error) {
      throw new Error(`Failed to get product: ${error.message}`);
    }
  }

  async createProduct(data) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Create main product data
        const newProduct = await tx.product.create({
          data: {
            name: data.name,
            description: data.description,
            price: data.price ? parseFloat(data.price) : undefined,
            categoryId: data.categoryId,
            collectionId: data.collectionId,
            isBestSeller: typeof data.isBestSeller === 'boolean' ? data.isBestSeller : undefined,
            isNewArrival: typeof data.isNewArrival === 'boolean' ? data.isNewArrival : undefined,
          },
        });

        // Create variants if provided
        if (data.variants) {
          await this._createProductVariants(tx, newProduct.id, data.variants);
        }

        // Create images if provided
        if (data.images) {
          await this._createProductImages(tx, newProduct.id, data.images);
        }

        // 6. Return the complete product with all relations
        return await tx.product.findUnique({
          where: { id: newProduct.id },
          include: {
            variants: true,
            images: true,
            collection: true,
            category: true,
          },
        });
      });
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  async updateProduct(id, data) {
    try {
      return await prisma.$transaction(async (tx) => {
        // Update main product data
        const updatedProduct = await tx.product.update({
          where: { id },
          data: {
            name: data.name,
            description: data.description,
            price: data.price ? parseFloat(data.price) : undefined,
            categoryId: data.categoryId,
            collectionId: data.collectionId,
            isBestSeller: typeof data.isBestSeller === 'boolean' ? data.isBestSeller : undefined,
            isNewArrival: typeof data.isNewArrival === 'boolean' ? data.isNewArrival : undefined,
          },
        });

        // Update variants if provided
        if (data.variants) {
          // Delete existing variants
          await tx.productVariant.deleteMany({
            where: { productId: id },
          });

          // Create new variants
          await this._createProductVariants(tx, id, data.variants);
        }

        // Update images if provided
        if (data.images) {
          // Delete existing images
          await tx.productImage.deleteMany({
            where: { productId: id },
          });

          // Create new images
          await this._createProductImages(tx, id, data.images);
        }

        return await tx.product.findUnique({
          where: { id },
          include: {
            variants: true,
            images: true,
            category: true,
            collection: true,
          },
        });
      });
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
}

module.exports = new ProductService();
