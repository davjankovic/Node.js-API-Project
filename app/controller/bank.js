/**
 *  Created by Accelerar on 04/11/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const bankHandler = require(APP_HANDLER_PATH + 'bank');
class BankController extends BaseController {
    constructor() {
        super();
        this._BankHandler = new bankHandler();
        this._passport = require('passport');
    }

    getAll(req, res, next) {
        this._BankHandler.getAllBanks(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getSingle(req, res, next) {
        this._BankHandler.getSingleBank(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }





    create(req, res, next) {

        this._BankHandler.createBank(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    update(req, res, next) {


        this._BankHandler.updateBank(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    remove(req, res, next) {


        this._BankHandler.deleteBank(req, this._responseManager.getDefaultResponseHandler(res));

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

module.exports = BankController;