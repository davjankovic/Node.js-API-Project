const router = require('express').Router();
const TransactionController = require(APP_CONTROLLER_PATH + 'transaction');
let transactionController = new TransactionController();

console.log("Reaching Transaction");
router.get('/:id', transactionController.get);
router.get('/', transactionController.getAll);
router.post("/vendor/:id", transactionController.getAllTransactionByVendorId);//auth token
router.get('/byCooper/:id', transactionController.getTransactionsByCooperId);
router.get("/totalOrderCount/:id", transactionController.getTotalOrdersCount);
router.post("/vendortotalordercount/:id", transactionController.getTotalOrdersCountByVendor);
router.post("/vendorweekcount/:id", transactionController.getTotalOrdersCountWeek);
router.post('/orders', transactionController.getAllTransactionStatusByRecent);
router.post("/totalcustomers/:cooperId/:id", transactionController.getTotalCustomers);
router.post("/paymentstatus", transactionController.getTransactionPaymentStatus);
router.post("/makesale", transactionController.createTransactionMakeSale);
router.post("/makesalerequest", transactionController.createTransactionMakeSaleRequest);
router.post('/', transactionController.create);
router.post("/product/:id", transactionController.getTransactionByProductId);
router.post("/productquantity/:id", transactionController.getQuantitySoldByProduct);
router.put('/', transactionController.update);
router.put("/vendorsale/:id", transactionController.updateTransactionMakeSale);
router.post("/cooperative/:id", transactionController.getAllTransByCooperativeId);
router.post("/quantitysold/:id", transactionController.getQuantitySoldByCooperativeId);
router.post("/outstanding/:id", transactionController.getOutstandingTrans);
router.post("/performance/:id", transactionController.getVendorPerformance);
router.post("/spendingpattern/:id", transactionController.getSpendingPattern);
router.post("/cooperspendingpattern/:id", transactionController.getCooperatorSpendingPattern);
router.post("/customerpendingpattern", transactionController.getCustomerSpendingPattern);
router.post("/getvendor/:vendorId/:id", transactionController.getSingleVendorPerformance);
router.post("/getvendorinfo/:vendorId/:id", transactionController.getSingleVendorInfo);
router.post("/cooperatortrans/:cooperId/:id", transactionController.getRecentCooperatorTrans);
router.post("/cooperativetrans/:id", transactionController.getAllCooperativeTransaction);
router.post("/vendorweekgraph/:id", transactionController.getAllVendorByWeek);
router.post("/vendormonthgraph/:id", transactionController.getAllVendorByMonth);
router.post("/vendoryeargraph/:id", transactionController.getAllVendorByYear);
router.post("/yearpurchasegraph/:id", transactionController.getAllYearlyPurchase);
router.post("/monthpurchasegraph/:id", transactionController.getAllMonthlyPurchase);
router.post("/weekpurchasegraph/:id", transactionController.getAllWeeklyPurchase);
router.post("/transactionamount", transactionController.getAllTransactionAmount);
router.post("/vendorweekpayment/:id", transactionController.getVendorPaymentHistoryWeek);
router.post("/vendormonthpayment/:id", transactionController.getVendorPaymentHistoryMonth);
router.post("/vendoryearpayment/:id", transactionController.getVendorPaymentHistoryYear);
//cooper admin section
router.post("/cooper/weeklytransaction", transactionController.showAllWeeklyTransactions);
router.post("/cooper/monthlytransaction", transactionController.showMontlyTransactions);
router.post("/cooper/yearlytransaction", transactionController.showYearlyTransactions);
router.post("/cooper/sumyearlypurchase", transactionController.sumYearlyPurchases);
router.post("/cooper/summonthlypurchase", transactionController.sumMonthlyPurchases);
router.post("/cooper/sumweeklypurchase", transactionController.sumWeeklyPurchases);
router.post("/cooper/getvendor/:id", transactionController.getAdminVendorPerformance);
router.post("/cooper/cooperatorrecent/:id", transactionController.getRecentCooperatorTransAdmin);
router.post("/cooper/vendorrecent/:id", transactionController.getRecentVendorTransAdmin);



module.exports = router;