const router=require('express').Router();
const authController=require('../controllers/authController');

router.post('/register',authController.signUp);
router.post('/login',authController.signIn);
router.get('/signout',authController.signOut);

module.exports=router;