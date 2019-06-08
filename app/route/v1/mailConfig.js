const router = require('express').Router();
const MailConfigController = require(APP_CONTROLLER_PATH + 'mailConfig');
let mailConfigController = new MailConfigController();

console.log("REaching mail Setting");
router.get('/:id', mailConfigController.getMail);
router.post('/', mailConfigController.createMail);

module.exports = router;