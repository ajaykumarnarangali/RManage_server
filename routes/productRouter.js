const router = require('express').Router();
const productController = require('../controllers/productController');
const { verify } = require('../utils/verify');
const { upload } = require('../utils/multerConfig');

router.post('/add', verify, upload.array("images"), productController.addProduct);
router.put('/edit/:id', verify, upload.array('images'), productController.editProduct);
router.get('/get', verify, productController.getProducts);
router.get('/:id', verify, productController.getSingleProduct);
router.get('/get/wish',verify,productController.getWishListProducts);
router.delete('/remove/:id',verify,productController.removeWishList);

module.exports = router;