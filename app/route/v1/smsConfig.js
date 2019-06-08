/**
 *  Created by Accelerar on 3/6/2018.
 */
const router = require('express').Router();
const SmsConfigController = require(APP_CONTROLLER_PATH + 'smsConfig');
let smsConfigController = new SmsConfigController();

console.log("REaching cooperative staff account");
router.get('/:id', smsConfigController.get);
router.post('/', smsConfigController.create);

module.exports = router;