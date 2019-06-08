const router = require('express').Router();
const NotificationController = require(APP_CONTROLLER_PATH + 'notification');
let notificationController = new NotificationController();

console.log("Reaching Notification");
router.get('/:id', notificationController.getSingle);
router.get('/', notificationController.getAll);
router.post('/', notificationController.create);
router.post("/bycooperid", notificationController.getNotficationByCooperId);
router.put('/:id', notificationController.update);


module.exports = router;