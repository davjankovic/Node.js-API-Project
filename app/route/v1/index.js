/**
 *  Created by Accelerar on 3/6/2018.
 */
const express = require('express'),
    router = express.Router();
const ROUTE_V1_PATH = APP_ROUTE_PATH + "v1/";
router.use('/auth', require(ROUTE_V1_PATH + 'auth'));
router.use('/users', require(ROUTE_V1_PATH + 'user'));
router.use('/posts', require(ROUTE_V1_PATH + 'post'));
router.use('/verifyauths', require(ROUTE_V1_PATH + 'verifyauth'));
router.use('/cooperativestaffs', require(ROUTE_V1_PATH + 'cooperativeStaff'));
router.use('/coopercooperativestaffs', require(ROUTE_V1_PATH + 'coopercooperativestaff'));
router.use('/cooperatives', require(ROUTE_V1_PATH + 'cooperative'));
router.use('/limitincrease', require(ROUTE_V1_PATH + 'limitincrease'));
router.use('/mailconfigs', require(ROUTE_V1_PATH + 'mailConfig'));
router.use('/transaction', require(ROUTE_V1_PATH + 'transaction'));
router.use('/cooperativeStaffAccounts', require(ROUTE_V1_PATH + 'cooperativeStaffAccounts'));
router.use('/products', require(ROUTE_V1_PATH + 'product'));
router.use('/sizes', require(ROUTE_V1_PATH + 'sizes'));
router.use('/smsConfig', require(ROUTE_V1_PATH + 'smsConfig'));
router.use('/colors', require(ROUTE_V1_PATH + 'colors'));
router.use('/cooperativeAPI', require(ROUTE_V1_PATH + 'cooperativeAPI'));
router.use('/notifications', require(ROUTE_V1_PATH + 'notification'));
router.use('/complaints', require(ROUTE_V1_PATH + 'complaints'));
router.use('/rating', require(ROUTE_V1_PATH + 'rating'));
router.use('/systemConfigurations', require(ROUTE_V1_PATH + 'systemConfiguration'));
router.use('/auditTrail', require(ROUTE_V1_PATH + 'auditTrail'));
router.use('/userRole', require(ROUTE_V1_PATH + 'userRole'));
router.use('/category', require(ROUTE_V1_PATH + 'category'));
router.use('/productcategory', require(ROUTE_V1_PATH + 'productcategory'));
router.use('/productview', require(ROUTE_V1_PATH + 'productview'));
router.use('/coopercooperative', require(ROUTE_V1_PATH + 'coopercooperativestaff'));
router.use('/adverts', require(ROUTE_V1_PATH + 'advert'));
router.use('/sponsorproducts', require(ROUTE_V1_PATH + 'sponsorproduct'));
router.use('/banks', require(ROUTE_V1_PATH + 'bank'));
// router.use('/productlikes', require(ROUTE_V1_PATH + 'productlikes'));
// router.use('/productrates', require(ROUTE_V1_PATH + 'productrating'));
// router.use('/useraddresses', require(ROUTE_V1_PATH + 'useraddresses'));

module.exports = router;