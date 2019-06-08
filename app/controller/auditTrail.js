/**
 * Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const AuditTrailHandler = require(APP_HANDLER_PATH + 'auditTrail');

const util = require("util");

class AuditTrailController extends BaseController {
    constructor() {
        super();
        this._authHandler = new AuditTrailHandler();
        this._passport = require('passport');
    }

    get(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._authHandler.getUserInfo(req, user, responseManager.getDefaultResponseHandler(res));
        // this._passport.authenticate('jwt-rs-auth', {
        //     onVerified: function(token, user) {

        //     },
        //     onFailure: function(error) {
        //         responseManager.respondWithError(res, error.status || 401, error.message);
        //     }
        // })(req, res, next);
    }

    create(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching audit trail ");
        this._authHandler.createAuditTrail(req, responseManager.getDefaultResponseHandler(res));
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

module.exports = AuditTrailController;