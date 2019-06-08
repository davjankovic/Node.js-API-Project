const router = require('express').Router();
const AdvertController = require(APP_CONTROLLER_PATH + 'advert');
let advertController = new AdvertController();


router.get('/:id', advertController.get);
router.get('/', advertController.getAll);
router.post('/', advertController.create);
router.put('/:id', advertController.update);
router.delete('/:id', advertController.remove);





module.exports = router;