/**
 *  Created by Accelerar on 3/6/2018.
 */
const router = require('express').Router();
const CooperativeStaffAccountsController = require(APP_CONTROLLER_PATH + 'cooperativeStaffAccounts');
let cooperativeStaffAccountsController = new CooperativeStaffAccountsController();

console.log("REaching cooperative staff account");
router.get('/:id', cooperativeStaffAccountsController.get);
router.post('/', cooperativeStaffAccountsController.create);
router.post('/deduct', cooperativeStaffAccountsController.DeductStaffAccounts);

module.exports = router;