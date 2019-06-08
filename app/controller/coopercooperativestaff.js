/**
 *  Created by Accelerar on 3/26/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const cooperCooperativeStaffHandler = require(APP_HANDLER_PATH + 'coopercooperativestaff');
class CooperCooperativeStaffController extends BaseController {
    constructor() {
        super();
        this._CooperCooperativeStaffHandler = new cooperCooperativeStaffHandler();
        this._passport = require('passport');
    }

    ussdCheckBalance(req, res, next) {
        this._CooperCooperativeStaffHandler.ussdCheckBalance(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAll(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._CooperCooperativeStaffHandler.getAllCooperCooperativeStaffByCooperId2(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }


    getAllCooperCooperativesCooperId(req, res, next) {

        console.log("Reaching Cooper Cooperative Staff ");
        this._CooperCooperativeStaffHandler.getAllCooperCooperativesCooperId(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }


    // getAllAccountBalances(req, res, next) {

    //     console.log("Reaching Cooper Cooperative Staff ");
    //     this._CooperCooperativeStaffHandler.getAllAccountBalances(req, this._responseManager.getDefaultResponseHandler(res));
    //     //this.authenticate(req, res, next, (token, user) => {

    //     //  });
    // }

    getAllAccountBalances(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._CooperCooperativeStaffHandler.getAllAccountBalances(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }


    getCooperativeIdAndCooperId(req, res, next) {
        let responseManager = this._responseManager;

        this._CooperCooperativeStaffHandler.getOneCooperCoopByCooperIdAndCooperativeId(req, responseManager.getDefaultResponseHandlerError(res, ((data, message, code) => {
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

    getByAccountType(req, res, next) {
        this._CooperCooperativeStaffHandler.getOneCooperCoopByCooperIdAndCooperativeIdAccountType(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    // create(req, res, next) {

    //     this._CooperCooperativeStaffHandler.createCooperCooperativeStaff(req, this._responseManager.getDefaultResponseHandler(res));

    //     // this.authenticate(req, res, next, (token, user) => {
    //     //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
    //     // });
    // }


    create(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._CooperCooperativeStaffHandler.createCooperCooperativeStaff(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }


    update(req, res, next) {


        this._CooperCooperativeStaffHandler.updateCooperCooperativeStaff(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    remove(req, res, next) {


        this._CooperCooperativeStaffHandler.deleteCooperCooperativeStaff(req, this._responseManager.getDefaultResponseHandler(res));

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

module.exports = CooperCooperativeStaffController;