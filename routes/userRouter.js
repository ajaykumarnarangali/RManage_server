const router=require('express').Router();
const userController=require('../controllers/userController');
const {verify} =require('../utils/verify');

router.post('/whishList/:id',verify,userController.toggleWhishList);

module.exports=router;