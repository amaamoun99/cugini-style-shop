const { PrismaClient } = require('../generated/prisma');
const prisma = new PrismaClient();

exports.createCollection = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const collection = await prisma.collection.create({
      data: { name, description, image }
    });
    res.status(201).json({ status: 'success', data: collection });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getAllCollections = async (req, res) => {
  try {
    const collections = await prisma.collection.findMany({
      include: { products: true }
    });
    res.json({ status: 'success', data: collections });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.getCollectionById = async (req, res) => {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id },
      include: { products: true }
    });
    if (!collection) return res.status(404).json({ status: 'fail', message: 'Collection not found' });
    res.json({ status: 'success', data: collection });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const updated = await prisma.collection.update({
      where: { id: req.params.id },
      data: { name, description, image }
    });
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    await prisma.collection.delete({ where: { id: req.params.id } });
    res.json({ status: 'success', message: 'Collection deleted' });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
