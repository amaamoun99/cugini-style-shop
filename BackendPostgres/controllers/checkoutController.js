const checkoutService = require('../services/checkoutServices');

exports.initCheckoutSession = async function (req, res) {
  try {
    const data = await checkoutService.loadCheckoutData(req.cartIdentity);
    res.json({ status: 'success', data });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};

exports.validateCheckout = async function (req, res) {
  try {
    const { shippingAddress } = req.body;
    await checkoutService.validateCartAndAddress(req.cartIdentity, shippingAddress);
    res.json({ status: 'success', message: 'Checkout validated' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.calculateTotal = async function (req, res) {
  try {
    const total = await checkoutService.calculateCartTotal(req.cartIdentity);
    res.json({ status: 'success', total });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

exports.placeOrder = async function (req, res) {
  try {
    const { shippingAddress, paymentMethod, email, phoneNumber, guestName } = req.body;

    const order = await checkoutService.createOrder(
      req.cartIdentity,
      shippingAddress,
      paymentMethod,
      email,
      phoneNumber,
      guestName
    );

    res.json({ status: "success", order });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err.message });
  }
};

