/**
 *  Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const VerifyAuthHandler = require(APP_HANDLER_PATH + 'verifyauth');
class VerifyAuthController extends BaseController {
    constructor() {
        super();
        this._verifyauthHandler = new VerifyAuthHandler();
        this._passport = require('passport');
    }

    getAll(req, res, next) {
        this.authenticate(req, res, next, (token, user) => {
            this._verifyauthHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        });
    }



    sendOTP(req, res, next) {

        this._verifyauthHandler.sendOTP(req, this._responseManager.getDefaultResponseHandler(res));

    }


    getUserOTP(req, res, next) {

        this._verifyauthHandler.getUserOTP(req, this._responseManager.getDefaultResponseHandler(res));

    }


    get(req, res, next) {
        let responseManager = this._responseManager;

        this._verifyauthHandler.getSingleVerifyAuth(req, responseManager.getDefaultResponseHandlerError(res, ((data, message, code) => {
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

        this._verifyauthHandler.createVerifyAuth(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    update(req, res, next) {


        this._verifyauthHandler.updateVerifyAuth(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    remove(req, res, next) {


        this._verifyauthHandler.deleteVerifyAuth(req, this._responseManager.getDefaultResponseHandler(res));

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

module.exports = VerifyAuthController;