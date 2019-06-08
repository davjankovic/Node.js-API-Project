/**
 *  Created by Accelerar on 3/6/2018.
 */
const router = require('express').Router();
const UserController = require(APP_CONTROLLER_PATH + 'user');
let userController = new UserController();

console.log("Reaching User");
router.get('/:id', userController.get);
router.post("/newusers", userController.getAllNewUsers);
router.post("/address/:id", userController.getUserAddressInfo);
router.get('/', userController.getAllUsers);
router.get('/verifyuser/:id', userController.verifyUserandCreateAccount2);
router.post('/', userController.create);
router.post('/forgot', userController.forgotPasswordMain);
router.post("/forgots", userController.forgot);
router.post("/reset/:token", userController.reset);
router.post("/send", userController.sendMesssage);
router.post('/resetpassword/:id', userController.resetPassword);

router.get('/token/:id', userController.getPasswordResetToken);
router.post('/cooperativestaff', userController.getVerifyCooperativeStaff);
router.post('/editphonenumber/:id', userController.editPhoneNumber);

router.post('/changepin/:id', userController.changeTransPin);
router.post("/changeTransTwo/:id", userController.changePin);//auth token
router.post('/setaccountdetails/:id', userController.setAccountDetails);//auth token

router.post('/checkpin', userController.checkTransPin);
router.post("/searchusersdata", userController.searchUserData);
//USSD API TO SEARCH FOR USERS
router.post("/ussd/searchusersbyphone", userController.searchUserDataPhone);
router.post("/ussd/ussddeduct", userController.ussdDeductCooperator);
router.post("/ussd/searchvendor", userController.validateVendorInfo);
router.post("/ussd/checkpin", userController.ussdCheckTransPin);

router.put('/editprofile/:id', userController.editProfile);//auth token
router.post("/addaddress/:id", userController.addUserAddress);//auth token
router.post("/getcooperative/:id", userController.getAllUsersByCooperative);
router.post("/getallvendor", userController.getAllVendorInfo);
router.post("/getallsubadmin", userController.getAllsubAdminInfo);
router.post("/registeredcooperative", userController.getAllCooperativeByAdmin);
router.post("/singlecooperative/:id", userController.getSingleCooperative);
router.post("/getallsingleadmin/:id", userController.getSingleAdminInfo);
router.post("/getallcooperator/:id", userController.getAllCooperatorInfo);
router.post("/getallcooperator", userController.getAllCooperatorInfoByAdmin);
router.post("/getallsubcooperative/:id", userController.getAllSubCooperativeInfo);
router.post("/getsinglevendor/:id", userController.getSingleVendorInfo);
router.post("/getsinglesubcooperative/:id", userController.getSingleSubCooperative);
router.post("/getsinglecooperator/:id", userController.getSingleCooperatorInfo);
router.post("/cooperatorlocgraph", userController.getAllCooperatorByLocation);
router.post("/vendorlocgraph", userController.getAllVendorByLocation);
router.post("/cooperatorweekgraph/:id", userController.getAllCooperatorByWeek);
router.post("/cooperatormonthgraph/:id", userController.getAllCooperatorByMonth);
router.post("/cooperatoryeargraph/:id", userController.getAllCooperatorByYear);







module.exports = router;