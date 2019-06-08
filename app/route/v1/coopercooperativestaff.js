const router = require('express').Router();
const CooperCooperativeStaffController = require(APP_CONTROLLER_PATH + 'coopercooperativestaff');
let cooperCooperativeStaffController = new CooperCooperativeStaffController();


router.post('/:id', cooperCooperativeStaffController.getAll);//auth token
router.post("/ussd/checkbalance", cooperCooperativeStaffController.ussdCheckBalance);
router.get("/:id", cooperCooperativeStaffController.getAllAccountBalances);//auth token
router.post('/allcooperatives/:id', cooperCooperativeStaffController.getAllCooperCooperativesCooperId);
router.get('/:id/:cooperativeId', cooperCooperativeStaffController.getCooperativeIdAndCooperId);

router.get('/:id/:cooperativeId/:accountType', cooperCooperativeStaffController.getByAccountType);
router.post('/', cooperCooperativeStaffController.create);//token
router.put('/', cooperCooperativeStaffController.update);




module.exports = router;