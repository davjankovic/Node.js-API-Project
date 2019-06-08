/**
 *  Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const complaintHandler = require(APP_HANDLER_PATH + 'complaints');
class ComplaintController extends BaseController {
    constructor() {
        super();
        this._ComplaintHandler = new complaintHandler();
        this._passport = require('passport');
    }

    getAll(req, res, next) {
        this._ComplaintHandler.getAllcomplaint(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    complaintsByStatus(req, res, next) {
        console.log("Reaching Complaint by Status");
        this._ComplaintHandler.complaintsByStatus(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getSingleComplaintByCooperId(req, res, next) {
        console.log("Reaching Complaint by Status");
        this._ComplaintHandler.getSingleComplaintByCooperId(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    createCooperatorComplaint(req, res, next) {
        console.log("Reaching Complaint by Status");
        this._ComplaintHandler.createCooperatorComplaint(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getSingleComplaintByVendorId(req, res, next) {
        console.log("Reaching Complaint by Status");
        this._ComplaintHandler.getSingleComplaintByVendorId(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }


    get(req, res, next) {
        let responseManager = this._responseManager;

        this._ComplaintHandler.getSinglecomplaint(req, responseManager.getDefaultResponseHandlerError(res, ((data, message, code) => {
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

        this._ComplaintHandler.createComplaint(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    update(req, res, next) {


        this._ComplaintHandler.updatecomplaint(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    remove(req, res, next) {


        this._ComplaintHandler.deletecomplaint(req, this._responseManager.getDefaultResponseHandler(res));

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

module.exports = ComplaintController;