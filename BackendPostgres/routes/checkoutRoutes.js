const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { identifyCart } = require('../middlewares/cartIdentity');

router.use(identifyCart);

router.post('/session', checkoutController.initCheckoutSession);
router.post('/validate', checkoutController.validateCheckout);
router.post('/calculate', checkoutController.calculateTotal);
router.post('/place-order', checkoutController.placeOrder);

module.exports = router;
