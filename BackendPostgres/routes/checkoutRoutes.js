const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { identifyCart } = require('../middlewares/cartIdentity');
const { authenticate, optionalAuthenticate } = require('../middlewares/authenticate');

// Apply optional authentication to all checkout routes
// This allows the routes to work for both logged-in and guest users
router.use(optionalAuthenticate);
router.use(identifyCart);

router.post('/session', checkoutController.initCheckoutSession);
router.post('/validate', checkoutController.validateCheckout);
router.post('/calculate', checkoutController.calculateTotal);
router.post('/place-order', checkoutController.placeOrder);

module.exports = router;
