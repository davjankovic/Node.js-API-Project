const router = require('express').Router();
const ProductRateController = require(APP_CONTROLLER_PATH + 'productrating');
let productRateController = new ProductRateController();


router.get('/:id/:userId', productRateController.get);
router.post('/', productRateController.create);
router.put('/:id', productRateController.update);
router.delete('/:id', productRateController.remove);
router.get('/', productRateController.getAll);




module.exports = router;