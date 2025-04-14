const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
require("dotenv").config();

const prisma = new PrismaClient();

exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log("JWT:", token);
  console.log("JWT_SECRET from env:", process.env.JWT_SECRET);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded:', decoded);

    const user = await prisma.User.findUnique({
      where: { id: decoded.userId },
    });
    
    console.log('user:', user); // This should now log correctly

    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    return res.status(401).json({ status: "fail", message: "Invalid token" });
  }
};
