/**
 * Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const MailConfigHandler = require(APP_HANDLER_PATH + 'mailConfig');

const util = require("util");

class MailConfigController extends BaseController {
    constructor() {
        super();
        this._authHandler = new MailConfigHandler();
        this._passport = require('passport');
    }


    getMail(req, res, next) {
        this._authHandler.getMail(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }



    // create(req, res) {
    //     let responseManager = this._responseManager;
    //     console.log("Reaching Mail Create Username " + req.body.username);
    //     this._authHandler.createMail(req, responseManager.getDefaultResponseHandler(res));
    //     // this.authenticate(req, res, () => {
    //     //     this._authHandler.createNewUser(req, responseManager.getDefaultResponseHandler(res));
    //     // });
    // }

    createMail(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching User Create ");
        this._authHandler.createMail(req, responseManager.getDefaultResponseHandler(res));
        // this.authenticate(req, res, () => {
        //     this._authHandler.createNewUser(req, responseManager.getDefaultResponseHandler(res));
        // });
    }

    authenticate(req, res, callback) {
        let responseManager = this._responseManager;
        this._passport.authenticate('secret-key-auth', {
            onVerified: callback,
            onFailure: function(error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res);
    }

}

module.exports = MailConfigController;