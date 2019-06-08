/**
 *  Created by Accelerar on 3/6/2018.
 */
const router = require('express').Router();
const AuthController = require(APP_CONTROLLER_PATH + 'auth');
let authController = new AuthController();

router.post('/', authController.create);
router.delete('/:token', authController.remove);

module.exports = router;