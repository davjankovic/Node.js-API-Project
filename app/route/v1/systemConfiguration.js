const router = require('express').Router();
const SystemConfigurationController = require(APP_CONTROLLER_PATH + 'systemConfiguration');
let systemConfigurationController = new SystemConfigurationController();

console.log("Reaching System Configuration");
router.get('/firstsystemconfig', systemConfigurationController.getSystemConfigFirstRecord);
router.get('/:id', systemConfigurationController.get);

router.get('/', systemConfigurationController.getAll);
router.post('/', systemConfigurationController.create);
router.put('/', systemConfigurationController.update);


module.exports = router;