const { PrismaClient } = require("../generated/prisma"); // Adjust the path to your generated Prisma client
const prisma = new PrismaClient();

const deleteOne = (model) => async (req, res) => {
  try {
    const doc = await prisma[model.modelName].delete({
      where: { id: req.params.id },
    });

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateOne = (model) => async (req, res) => {
  try {
    const doc = await prisma[model.modelName].update({
      where: { id: req.params.id },
      data: req.body,
    });

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const createOne = (model) => async (req, res) => {
  try {
    const doc = await prisma[model.modelName].create({
      data: req.body,
    });

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getOne = (model, include) => async (req, res) => {
  try {
    const doc = await prisma[model.modelName].findUnique({
      where: { id: req.params.id },
      include,
    });

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "No document found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getAll = (model, include) => async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    const [doc, total] = await prisma.$transaction([
      prisma[model.modelName].findMany({
        skip,
        take: limit,
        include,
        where: req.query.filter ? JSON.parse(req.query.filter) : {},
        orderBy: req.query.sort ? JSON.parse(req.query.sort) : undefined,
      }),
      prisma[model.modelName].count(),
    ]);

    res.status(200).json({
      status: "success",
      results: doc.length,
      pagination: {
        page,
        limit,
        total,
      },
      data: {
        data: doc,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
};
