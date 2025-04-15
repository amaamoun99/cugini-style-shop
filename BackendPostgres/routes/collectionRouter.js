const express = require('express');
const router = express.Router();
const { authenticate} = require('../middlewares/authenticate');
const { isAdmin } = require('../middlewares/isAdmin');
const controller = require('../controllers/collectionController');

router.use(authenticate, isAdmin);

router.post('/', controller.createCollection);
router.get('/', controller.getAllCollections);
router.get('/:id', controller.getCollectionById);
router.patch('/:id', controller.updateCollection);
router.delete('/:id', controller.deleteCollection);

module.exports = router;
