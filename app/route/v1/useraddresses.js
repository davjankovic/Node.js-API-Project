const router = require('express').Router();
const UserAddressesController = require(APP_CONTROLLER_PATH + 'useraddresses');
let userAddressesController = new UserAddressesController();


router.get('/:id/:userId', userAddressesController.get);
router.post('/', userAddressesController.create);
router.put('/:id', userAddressesController.update);
router.delete('/:id', userAddressesController.remove);
router.get('/', userAddressesController.getAll);




module.exports = router;