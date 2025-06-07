const router = require('express').Router();
const productController = require('../controllers/productController');
const { verify } = require('../utils/verify');
const {upload}=require('../utils/multerConfig');

router.post('/add', verify,upload.array("images"), productController.addProduct);
router.get('/get', verify, productController.getProducts);

module.exports = router;