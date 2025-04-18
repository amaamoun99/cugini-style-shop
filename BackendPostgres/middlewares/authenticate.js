const jwt = require("jsonwebtoken");
const { PrismaClient } = require("../generated/prisma");
require("dotenv").config();

const prisma = new PrismaClient();

/**
 * Verifies the JWT token and attaches the user to the request object
 * @param {string} token - JWT token
 * @returns {object|null} User object or null if token is invalid
 */
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.User.findUnique({
      where: { id: decoded.userId },
    });
    return user || null;
  } catch (err) {
    console.error('Token verification error:', err.message);
    return null;
  }
}

/**
 * Required authentication middleware
 * Rejects requests without valid authentication
 */
exports.authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  console.log("JWT:", token);

  try {
    const user = await verifyToken(token);
    
    if (!user) {
      return res.status(404).json({ status: "fail", message: "User not found or invalid token" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    return res.status(401).json({ status: "fail", message: "Invalid token" });
  }
};

/**
 * Optional authentication middleware
 * Continues even if no token is provided or token is invalid
 * If valid token is provided, attaches user to request
 */
exports.optionalAuthenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // No auth header, continue as guest
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('No authentication provided - proceeding as guest');
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  
  // Try to get user from token, but continue even if token is invalid
  const user = await verifyToken(token);
  req.user = user;
  
  console.log('Optional authentication:', user ? 'User authenticated' : 'Invalid token, proceeding as guest');
  next();
};
