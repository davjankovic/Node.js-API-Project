/**
 *  Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + "base");
const LimitIncreaseHandler = require(APP_HANDLER_PATH + "limitincrease");
class LimitIncreaseController extends BaseController {
  constructor() {
    super();
    this._LimitIncreaseHandler = new LimitIncreaseHandler();
    this._passport = require("passport");
  }

  getAll(req, res, next) {
    this._LimitIncreaseHandler.getAllLimitIncrease(
      req,
      this._responseManager.getDefaultResponseHandler(res)
    );
    //this.authenticate(req, res, next, (token, user) => {

    //  });
  }

  getLimitIncrease(req, res, next) {
    this._LimitIncreaseHandler.getLimitIncrease(req, this._responseManager.getDefaultResponseHandler(res));
    //this.authenticate(req, res, next, (token, user) => {

    //  });
  }

  getLimitIncreaseAdmin(req, res, next) {
    this._LimitIncreaseHandler.getLimitIncreaseAdmin(req, this._responseManager.getDefaultResponseHandler(res));
    //this.authenticate(req, res, next, (token, user) => {

    //  });
  }

  get(req, res, next) {
    let responseManager = this._responseManager;

    this._LimitIncreaseHandler.getSingleLimitIncrease(
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
    this._LimitIncreaseHandler.createLimitIncrease(
      req,
      this._responseManager.getDefaultResponseHandler(res)
    );

    // this.authenticate(req, res, next, (token, user) => {
    //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
    // });
  }

  update(req, res, next) {
    this._LimitIncreaseHandler.updateLimitIncrease(
      req,
      this._responseManager.getDefaultResponseHandler(res)
    );

    // this.authenticate(req, res, next, (token, user) => {
    //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
    // });
  }

  remove(req, res, next) {
    this._LimitIncreaseHandler.deleteLimitIncrease(
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

module.exports = LimitIncreaseController;
