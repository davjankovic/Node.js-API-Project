const router = require('express').Router();
const CategoryController = require(APP_CONTROLLER_PATH + 'category');
let categoryController = new CategoryController();


router.get('/:id', categoryController.get);
router.get('/', categoryController.getAll);
router.post('/', categoryController.create);
router.put('/', categoryController.update);


module.exports = router;