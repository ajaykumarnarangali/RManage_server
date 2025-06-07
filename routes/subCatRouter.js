const router=require('express').Router();
const subCatController=require('../controllers/subCatController');
const {verify} =require('../utils/verify');

router.post('/add',verify,subCatController.addSubCategory);
router.get('/all',verify,subCatController.getAllSubCategory);

module.exports=router;