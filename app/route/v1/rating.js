const router = require('express').Router();
const RatingController = require(APP_CONTROLLER_PATH + 'rating');
let ratingController = new RatingController();

console.log("Reaching Rating");
router.get('/:id', ratingController.get);
router.get('/', ratingController.getAll);
router.post('/', ratingController.create);
router.put('/', ratingController.update);


module.exports = router;