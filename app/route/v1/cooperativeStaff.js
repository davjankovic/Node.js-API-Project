const router = require('express').Router();
const CooperativeStaffController = require(APP_CONTROLLER_PATH + 'cooperativeStaff');
let cooperativeStaffController = new CooperativeStaffController();

console.log("Reaching Cooperative Staff");
router.get('/:id', cooperativeStaffController.get);
router.get('/:id/:cooperativeId', cooperativeStaffController.getVerifyCooperativeStaff);
router.post('/', cooperativeStaffController.create);
router.put('/', cooperativeStaffController.update);


module.exports = router;