const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

router.use(authenticate);

// ADMIN ROUTES — must come first
router.get('/admin', isAdmin, orderController.getAllOrders);
router.get('/admin/:id', isAdmin, orderController.getOrderById);
router.put('/admin/:id', isAdmin, orderController.updateOrderStatus);
router.delete('/admin/:id', isAdmin, orderController.deleteOrder);

// USER ROUTES
router.get('/:id/status', orderController.getOrderStatus);
router.get('/:id', orderController.getOrderDetails);

module.exports = router;
