const express = require("express");
const cartController= require("../controllers/cartController.js") 
const { identifyCart } = require( '../middlewares/cartIdentity.js');

const router = express.Router();

router.use(identifyCart);

router.get('/', cartController.getCart);
router.post('/items', cartController.addCartItem);
router.put('/items/:id', cartController.updateCartItemQuantity);
router.delete('/items/:id', cartController.deleteCartItem);
router.delete('/', cartController.clearCart);

module.exports = router;
