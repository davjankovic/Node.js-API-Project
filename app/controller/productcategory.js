/**
 *  Created by Accelerar on 3/18/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const productCategoryHandler = require(APP_HANDLER_PATH + 'productcategory');
class ProductCategoryController extends BaseController {
    constructor() {
        super();
        this._ProductCategoryHandler = new productCategoryHandler();
        this._passport = require('passport');
    }

    getAll(req, res, next) {
        this._ProductCategoryHandler.getAllProductCategory(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getProductByCategory(req, res, next) {
        this._ProductCategoryHandler.getProductByCategory(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getTopCategory(req, res, next) {
        this._ProductCategoryHandler.getTopCategory(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    shopByCategory(req, res, next) {
        this._ProductCategoryHandler.shopByCategory(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllProductAccess(req, res, next) {
        this._ProductCategoryHandler.getAllProductAccess(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getProductCategoryOnSale(req, res, next) {
        this._ProductCategoryHandler.getProductCategoryOnSale(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }



    get(req, res, next) {
        let responseManager = this._responseManager;

        this._ProductCategoryHandler.getSingleProductCategory(req, responseManager.getDefaultResponseHandlerError(res, ((data, message, code) => {
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

        this._ProductCategoryHandler.createProductCategory(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    update(req, res, next) {


        this._ProductCategoryHandler.updateProductCategory(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    remove(req, res, next) {


        this._ProductCategoryHandler.deleteProductCategory(req, this._responseManager.getDefaultResponseHandler(res));

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

module.exports = ProductCategoryController;