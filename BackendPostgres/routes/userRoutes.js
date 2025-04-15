const express = require('express');
const router = express.Router();
const {authenticate} = require('../middlewares/authenticate');
const {isAdmin} = require('../middlewares/isAdmin');
const userController = require('../controllers/userController');


router.get("/orders", authenticate,userController.getUserOrders);

router.use(authenticate, isAdmin);


router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
