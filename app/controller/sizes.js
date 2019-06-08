/**
 *  Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + "base");
const sizeHandler = require(APP_HANDLER_PATH + "sizes");
class SizeController extends BaseController {
  constructor() {
    super();
    this._sizeHandler = new sizeHandler();
    this._passport = require("passport");
  }

  getAll(req, res, next) {
    this._sizeHandler.getAllSizes(
      req,
      this._responseManager.getDefaultResponseHandler(res)
    );
    //this.authenticate(req, res, next, (token, user) => {

    //  });
  }

  getSize(req, res, next) {
    let responseManager = this._responseManager;

    this._sizeHandler.getSize(
      req,
      responseManager.getDefaultResponseHandlerError(
        res,
        (data, message, code) => {
          let hateosLinks = [
            responseManager.generateHATEOASLink(
              req.baseUrl,
              "GET",
              "collection"
            )
          ];
          responseManager.respondWithSuccess(
            res,
            code || responseManager.HTTP_STATUS.OK,
            data,
            message,
            hateosLinks
          );
        }
      )
    );

    // this.authenticate(req, res, next, (token, user) => {
    //     this._verifyauthHandler.getSinglePost(req, responseManager.getDefaultResponseHandlerError(res, ((data, message, code) => {
    //         let hateosLinks = [responseManager.generateHATEOASLink(req.baseUrl, "GET", "collection")];
    //         responseManager.respondWithSuccess(res, code || responseManager.HTTP_STATUS.OK, data, message, hateosLinks);
    //     })));
    // });
  }

  create(req, res, next) {
    this._sizeHandler.createSize(
      req,
      this._responseManager.getDefaultResponseHandler(res)
    );

    // this.authenticate(req, res, next, (token, user) => {
    //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
    // });
  }

  update(req, res, next) {
    this._sizeHandler.updateSize(
      req,
      this._responseManager.getDefaultResponseHandler(res)
    );

    // this.authenticate(req, res, next, (token, user) => {
    //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
    // });
  }

  remove(req, res, next) {
    this._sizeHandler.deleteSize(
      req,
      this._responseManager.getDefaultResponseHandler(res)
    );

    // this.authenticate(req, res, next, (token, user) => {
    //     this._verifyauthHandler.deletePost(req, this._responseManager.getDefaultResponseHandler(res));
    // });
  }

  authenticate(req, res, next, callback) {
    let responseManager = this._responseManager;
    this._passport.authenticate("jwt-rs-auth", {
      onVerified: callback,
      onFailure: function(error) {
        responseManager.respondWithError(
          res,
          error.status || 401,
          error.message
        );
      }
    })(req, res, next);
  }
}

module.exports = SizeController;
