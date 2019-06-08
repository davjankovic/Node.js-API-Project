const router = require('express').Router();
const SponsorProductController = require(APP_CONTROLLER_PATH + 'sponsorproduct');
let sponsorProductController = new SponsorProductController();


router.get('/:id', sponsorProductController.get);
router.get('/', sponsorProductController.getAll);
router.post('/', sponsorProductController.create);
router.put('/:id', sponsorProductController.update);
router.delete("/:id", sponsorProductController.remove);





module.exports = router;