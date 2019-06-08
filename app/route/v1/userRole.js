/**
 *  Created by Accelerar on 3/6/2018.
 */
const router = require('express').Router();
const UserRoleController = require(APP_CONTROLLER_PATH + 'userRole');
let userRoleController = new UserRoleController();

console.log("REaching user role");
router.get('/:id', userRoleController.get);
router.post('/', userRoleController.create);

module.exports = router;