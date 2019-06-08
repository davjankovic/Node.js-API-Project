const router = require('express').Router();
const ProductController = require(APP_CONTROLLER_PATH + 'product');
let productController = new ProductController();

console.log('Reaching product');
router.get('/:id/:userId', productController.get);
router.post('/', productController.create);//auth token
router.put('/:id', productController.update);//auth token
router.delete('/:id', productController.remove);
router.get('/', productController.getAll);
router.post('/deduct', productController.deductProduct);
router.post('/like/:id', productController.updateProductLike);
router.post("/getAllLikes/:id", productController.getAllProductLikes);
router.post("/getAllRates/:id", productController.getAllProductRates);
router.post("/getRatesCount/:id", productController.getAllProductRatesCount);
router.post("/getRatesProduct/:id", productController.getRatesByProductId);
router.post('/rate/:id', productController.updateProductRate);
router.get("/:id", productController.getProductByStatus);
router.post("/New", productController.getNewProduct);
router.post("/onSale/:id", productController.getProductOnSale);
router.post("/brand/:id", productController.getAllProductByBrand);
router.post("/brandname", productController.getAllProductByBrandName);
router.post("/vendor/:id", productController.getProductByVendorId);
router.post("/suggested", productController.getSuggestedProduct);
router.post("/interested", productController.getSuggestedProduct);
router.post('/search', productController.searchProduct);



module.exports = router;