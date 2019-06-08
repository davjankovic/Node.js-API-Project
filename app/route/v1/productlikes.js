const router = require('express').Router();
const ProductLikeController = require(APP_CONTROLLER_PATH + 'productlikes');
let productLikeController = new ProductLikeController();


router.get('/:id/:userId', productLikeController.get);
router.post('/', productLikeController.create);
router.put('/:id', productLikeController.update);
router.delete('/:id', productLikeController.remove);
router.get('/', productLikeController.getAll);




module.exports = router;