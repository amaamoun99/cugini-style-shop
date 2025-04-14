// api/routes/orders.routes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authenticate } = require("../middlewares/authenticate");
const { isAdmin } = require("../middlewares/isAdmin");

router.get("/", authenticate, orderController.getUserOrders);
router.get("/:id", authenticate, orderController.getOrderDetails);
router.get("/:id/status", authenticate, orderController.getOrderStatus);

//////////////////////////////////////////////////////////////////
//////////////////admin routes////////////////////
router.use(authenticate, isAdmin);

router.get('/admin', orderController.getAllOrders);
router.get('/admin/:id', orderController.getOrderById);
router.put('/admin/:id', orderController.updateOrderStatus);
router.delete('/admin/:id', orderController.deleteOrder);

module.exports = router;
