const express = require("express");
const cors = require("cors");
const path = require("path");
const {PrismaClient} = require("./generated/prisma");
const cookieParser = require('cookie-parser');
const { ensureSessionId } = require ('./middlewares/sessionInit.js');
const productRouter = require("./routes/productRoutes") // Import Prisma client
const collectionRouter = require("./routes/collectionRouter") // Import Prisma client
const orderRouter = require("./routes/orderRoutes") // Import Prisma client
const cartRouter = require("./routes/cartRoutes")
const checkoutRouter = require("./routes/checkoutRoutes")
const authRouter = require("./routes/authRoutes") // Import Prisma client
const userRouter = require("./routes/userRoutes") // Import Prisma client
// Initialize express app
const app = express();
const prisma = new PrismaClient(); // Initialize Prisma client
//app.options("*", cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:8080", // your React frontend
    credentials: true, // allow cookies
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());         // ✅ Parse cookies first
app.use(ensureSessionId);

// // Serve static files (e.g., images) from a folder
// app.use("/img", express.static(path.join(__dirname, "public", "img")));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});




// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products",productRouter); // Pass Prisma client to the router
app.use("/api/v1/collections",collectionRouter); // Pass Prisma client to the router
app.use("/api/v1/cart", cartRouter); // Pass Prisma client to the router   
app.use("/api/v1/checkout",checkoutRouter); // Pass Prisma client to the router     
app.use("/api/v1/orders",orderRouter); // Pass Prisma client to the router
app.use("/api/v1/users", userRouter);
//   app.use("/api/v1/requestService", requestRouter);

module.exports = app;
