/**
 *  Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const ProductHandler = require(APP_HANDLER_PATH + 'product');
class ProductController extends BaseController {
    constructor() {
        super();
        this._productHandler = new ProductHandler();
        this._passport = require('passport');
    }

    getAll(req, res, next) {
        this.authenticate(req, res, next, (token, user) => {
            this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        });
    }
    searchProduct(req, res, next) {

        this._productHandler.searchProduct(req, this._responseManager.getDefaultResponseHandler(res));
        // this.authenticate(req, res, next, (token, user) => {

        // });
    }

    getProductByVendorId(req, res, next) {

        this._productHandler.getProductByVendorId(req, this._responseManager.getDefaultResponseHandler(res));
        // this.authenticate(req, res, next, (token, user) => {

        // });
    }

    getAllProductRatesCount(req, res, next) {

        this._productHandler.getAllProductRatesCount(req, this._responseManager.getDefaultResponseHandler(res));
        // this.authenticate(req, res, next, (token, user) => {

        // });
    }

    getRatesByProductId(req, res, next) {

        this._productHandler.getRatesByProductId(req, this._responseManager.getDefaultResponseHandler(res));
        // this.authenticate(req, res, next, (token, user) => {

        // });
    }
    getSuggestedProduct(req, res, next) {

        this._productHandler.getSuggestedProduct(req, this._responseManager.getDefaultResponseHandler(res));
        // this.authenticate(req, res, next, (token, user) => {

        // });
    }



    get(req, res, next) {
        this._productHandler.getSingleProduct(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getProductByStatus(req, res, next) {
        this._productHandler.getProductByStatus(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getProductByStatus(req, res, next) {
        this._productHandler.getProductByStatus(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getNewProduct(req, res, next) {
        this._productHandler.getNewProduct(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllProductByBrand(req, res, next) {
        this._productHandler.getAllProductByBrand(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }
    getAllProductByBrandName(req, res, next) {
        this._productHandler.getAllProductByBrandName(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }


    getProductOnSale(req, res, next) {
        this._productHandler.getProductOnSale(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllProductLikes(req, res, next) {
        this._productHandler.getAllProductLikes(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }

    getAllProductRates(req, res, next) {
        this._productHandler.getAllProductRates(req, this._responseManager.getDefaultResponseHandler(res));
        //this.authenticate(req, res, next, (token, user) => {

        //  });
    }


    // create(req, res, next) {

    //     this._productHandler.createProduct(req, this._responseManager.getDefaultResponseHandler(res));

    //     // this.authenticate(req, res, next, (token, user) => {
    //     //     this._verifyauthHandler.createNewPost(req, this._responseManager.getDefaultResponseHandler(res));
    //     // });
    // }


    create(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._productHandler.createProduct(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }

    // update(req, res, next) {


    //     this._productHandler.updateProduct(req, this._responseManager.getDefaultResponseHandler(res));

    //     // this.authenticate(req, res, next, (token, user) => {
    //     //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
    //     // });
    // }


    update(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._productHandler.updateProduct(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }

    updateProductLike(req, res, next) {


        this._productHandler.updateProductLike(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }

    updateProductRate(req, res, next) {


        this._productHandler.updateProductRate(req, this._responseManager.getDefaultResponseHandler(res));

        // this.authenticate(req, res, next, (token, user) => {
        //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
        // });
    }




    // deductProduct(req, res, next) {

    //     console.log("reach product deduct");
    //     this._productHandler.deductProduct(req, this._responseManager.getDefaultResponseHandler(res));

    //     // this.authenticate(req, res, next, (token, user) => {
    //     //     this._verifyauthHandler.updatePost(req, this._responseManager.getDefaultResponseHandler(res));
    //     // });
    // }

    deductProduct(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._productHandler.deductProduct(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }



    remove(req, res, next) {


        this._productHandler.deleteProduct(req, this._responseManager.getDefaultResponseHandler(res));

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

module.exports = ProductController;