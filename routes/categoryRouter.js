const router=require('express').Router();
const categoryController=require('../controllers/categoryController');
const {verify} =require('../utils/verify');

router.post('/add',verify,categoryController.addCategory);
router.get('/all',verify,categoryController.getAllCategory);
router.get('/Allcategories',verify,categoryController.getCategoryList)

module.exports=router;