const router = require('express').Router();
const ProductViewController = require(APP_CONTROLLER_PATH + 'productview');
let productViewController = new ProductViewController();


router.get('/:id', productViewController.get);
router.get('/', productViewController.getAll);
router.post('/', productViewController.create);
router.post("/popularproduct", productViewController.getAllPopularProduct);
router.post("/recommend", productViewController.getRecommendedProduct);
router.put('/', productViewController.update);


module.exports = router;