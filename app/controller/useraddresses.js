/**
 *  Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const UserAddressHandler = require(APP_HANDLER_PATH + 'useraddresses');
class UserAddressController extends BaseController {
    constructor() {
        super();
        this._userAddressHandler = new UserAddressHandler();
        this._passport = require('passport');
    }

    getAll(req, res, next) {
        this.authenticate(req, res, next, (token, user) => {
            this._userAddressHandler.getAllProductRates(req, this._responseManager.getDefaultResponseHandler(res));
        });
    }




    get(req, res, next) {
        this._userAddressHandler.getSingleProductRate(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }



    create(req, res, next) {

        this._userAddressHandler.createProductRate(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    update(req, res, next) {


        this._userAddressHandler.updateProductRate(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }






    remove(req, res, next) {


        this._userAddressHandler.deleteProductRate(req, this._responseManager.getDefaultResponseHandler(res));

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

module.exports = UserAddressController;