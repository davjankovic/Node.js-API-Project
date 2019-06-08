const router = require('express').Router();
const BankController = require(APP_CONTROLLER_PATH + 'bank');
let bankController = new BankController();


router.get('/:id', bankController.getSingle);
router.get('/', bankController.getAll);
router.post('/', bankController.create);
router.put('/', bankController.update);


module.exports = router;