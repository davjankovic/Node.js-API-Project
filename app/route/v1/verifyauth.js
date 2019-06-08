const router = require('express').Router();
const VerifyAuthController = require(APP_CONTROLLER_PATH + 'verifyauth');
let verifyauthController = new VerifyAuthController();


router.get('/:id', verifyauthController.get);
router.get('/sendotp/:id', verifyauthController.sendOTP);
router.post('/', verifyauthController.create);
router.put('/', verifyauthController.update);
router.get('/:id/:userId', verifyauthController.getUserOTP);





module.exports = router;