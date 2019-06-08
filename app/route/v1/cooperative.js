const router = require('express').Router();
const CooperativeController = require(APP_CONTROLLER_PATH + 'cooperative');
let cooperativeController = new CooperativeController();

console.log("Reaching Cooperative");
router.get('/:id', cooperativeController.get);
router.get('/', cooperativeController.getAll);
router.post('/', cooperativeController.create);
router.put('/', cooperativeController.update);


module.exports = router;