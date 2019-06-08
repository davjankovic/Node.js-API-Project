const router = require('express').Router();
const ProductCategoryController = require(APP_CONTROLLER_PATH + 'productcategory');
let productCategoryController = new ProductCategoryController();


router.get('/:id', productCategoryController.get);
router.get('/category/:id', productCategoryController.getProductByCategory);
router.get('/', productCategoryController.getAll);
router.post('/', productCategoryController.create);
router.put('/', productCategoryController.update);
router.post("/onSale/:id", productCategoryController.getProductCategoryOnSale);
router.post("/top", productCategoryController.getTopCategory);
router.post("/access", productCategoryController.getAllProductAccess);
router.post("/shopbycategory", productCategoryController.shopByCategory);





module.exports = router;