const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate, optionalAuthenticate } = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

// ADMIN ROUTES — must come first
router.get('/admin',authenticate, isAdmin, orderController.getAllOrders);
router.get('/admin/:id',authenticate, isAdmin, orderController.getOrderById);
router.put('/status/:id',authenticate,isAdmin, orderController.updateOrderStatus);
router.delete('/admin/:id',authenticate, isAdmin, orderController.deleteOrder);

// USER ROUTES - with regular authentication
router.get('/:id/status', authenticate, orderController.getOrderStatus);

// Special route for order details - supports both authenticated users and guests
// This allows guests to view their order right after placing it
router.get('/:id', optionalAuthenticate, orderController.getOrderDetails);

module.exports = router;
