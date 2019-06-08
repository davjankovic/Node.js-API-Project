/**
 *  Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const transactionHandler = require(APP_HANDLER_PATH + 'transaction');
class TransactionController extends BaseController {
    constructor() {
        super();
        this._TransactionHandler = new transactionHandler();
        this._passport = require('passport');
    }

    getAll(req, res, next) {
        this._TransactionHandler.getAlltransaction(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }


    // getTransactionsByCooperId(req, res, next) {
    //     console.log("Reaching Transactions ");
    //     this._TransactionHandler.getTransactionsByCooperId(req, this._responseManager.getDefaultResponseHandler(res));
    //     //this.authenticate(req, res, next, (token, user) => {

    //     //  });
    // }


    getTransactionsByCooperId(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._TransactionHandler.getTransactionsByCooperId(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }


    getTotalOrdersCountWeek(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getTotalOrdersCountWeek(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getTotalOrdersCountByVendor(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getTotalOrdersCountByVendor(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getTotalOrdersCount(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getTotalOrdersCount(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getTotalCustomers(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getTotalCustomers(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getCustomerSpendingPattern(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getCustomerSpendingPattern(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllTransactionAmount(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllTransactionAmount(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getVendorPaymentHistoryWeek(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getVendorPaymentHistoryWeek(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getVendorPaymentHistoryMonth(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getVendorPaymentHistoryMonth(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getVendorPaymentHistoryYear(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getVendorPaymentHistoryYear(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    showAllWeeklyTransactions(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.showAllWeeklyTransactions(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    showMontlyTransactions(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.showMontlyTransactions(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    showYearlyTransactions(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.showYearlyTransactions(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    sumYearlyPurchases(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.sumYearlyPurchases(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    sumMonthlyPurchases(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.sumMonthlyPurchases(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    sumWeeklyPurchases(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.sumWeeklyPurchases(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getAdminVendorPerformance(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAdminVendorPerformance(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getRecentCooperatorTransAdmin(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getRecentCooperatorTransAdmin(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getRecentVendorTransAdmin(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getRecentVendorTransAdmin(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getQuantitySoldByProduct(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getQuantitySoldByProduct(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    // getAllTransactionByVendorId(req, res, next) {
    //     console.log("Reaching Transactions ");
    //     this._TransactionHandler.getAllTransactionByVendorId(req, this._responseManager.getDefaultResponseHandler(res));
    //     //this.authenticate(req, res, next, (token, user) => {

    //     //  });
    // }

    getAllTransactionByVendorId(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._TransactionHandler.getAllTransactionByVendorId(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }

    getQuantitySoldByCooperativeId(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getQuantitySoldByCooperativeId(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getOutstandingTrans(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getOutstandingTrans(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllVendorByWeek(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllVendorByWeek(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getAllVendorByMonth(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllVendorByMonth(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getAllVendorByYear(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllVendorByYear(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getSpendingPattern(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getSpendingPattern(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getAllWeeklyPurchase(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllWeeklyPurchase(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getAllMonthlyPurchase(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllMonthlyPurchase(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getAllYearlyPurchase(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllYearlyPurchase(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getVendorPerformance(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getVendorPerformance(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getSingleVendorPerformance(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getSingleVendorPerformance(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllTransByCooperativeId(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllTransByCooperativeId(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

        getTransactionByProductId(req, res, next) {
        console.log("Reaching Transactions ");
            this._TransactionHandler.getTransactionByProductId(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllTransactionStatusByRecent(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllTransactionStatusByRecent(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getTransactionPaymentStatus(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getTransactionPaymentStatus(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    updateTransactionMakeSale(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.updateTransactionMakeSale(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    
    // createTransactionMakeSale(req, res, next) {
    //     console.log("Reaching Transactions ");
    //     this._TransactionHandler.createTransactionMakeSale(req, this._responseManager.getDefaultResponseHandler(res));
    //     //this.authenticate(req, res, next, (token, user) => {

    //     //  });
    // }

    createTransactionMakeSale(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._TransactionHandler.createTransactionMakeSale(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }

    createTransactionMakeSaleRequest(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.createTransactionMakeSaleRequest(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllCooperativeTransaction(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getAllCooperativeTransaction(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getRecentCooperatorTrans(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getRecentCooperatorTrans(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getCooperatorSpendingPattern(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getCooperatorSpendingPattern(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getSingleVendorInfo(req, res, next) {
        console.log("Reaching Transactions ");
        this._TransactionHandler.getSingleVendorInfo(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }





    get(req, res, next) {
        let responseManager = this._responseManager;

        this._TransactionHandler.getSingletransaction(req, responseManager.getDefaultResponseHandlerError(res, ((data, message, code) => {
            let hateosLinks = [responseManager.generateHATEOASLink(req.baseUrl, "GET", "collection")];
            responseManager.respondWithSuccess(res, code || responseManager.HTTP_STATUS.OK, data, message, hateosLinks);
        })));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.getSinglePost(req, responseManager.getDefaultResponseHandlerError(res, ((data, message, code) => {
        //         let hateosLinks = [responseManager.generateHATEOASLink(req.baseUrl, "GET", "collection")];
        //         responseManager.respondWithSuccess(res, code || responseManager.HTTP_STATUS.OK, data, message, hateosLinks);
        //     })));
        // });
    }

    create(req, res, next) {

        this._TransactionHandler.createTransaction(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    update(req, res, next) {


        this._TransactionHandler.updatetransaction(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    remove(req, res, next) {


        this._TransactionHandler.deletetransaction(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.deletePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    authenticate(req, res, next, callback) {
        let responseManager = this._responseManager;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: callback,
            onFailure: function(error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }
}

module.exports = TransactionController;