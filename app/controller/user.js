/**
 * Created by Accelerar on 3/6/2018.
 */
const BaseController = require(APP_CONTROLLER_PATH + 'base');
const UserHandler = require(APP_HANDLER_PATH + 'user');

const util = require("util");

class UserController extends BaseController {
    constructor() {
        super();
        this._authHandler = new UserHandler();
        this._passport = require('passport');
    }

    get(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function(token, user) {
                that._authHandler.getUserInfo(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function(error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }

    getUserAddressInfo(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function(token, user) {
                that._authHandler.getUserAddressInfo(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function(error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }

    changePin(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._authHandler.changePin(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }




    getAllUsers(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllUsers(req, this._responseManager.getDefaultResponseHandler(res));
    }
    
    validateVendorInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.validateVendorInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }
    
    searchUserData(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.searchUserData(req, this._responseManager.getDefaultResponseHandler(res));
    }

    searchUserDataPhone(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.searchUserDataPhone(req, this._responseManager.getDefaultResponseHandler(res));
    }

    ussdDeductCooperator(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.ussdDeductCooperator(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllNewUsers(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllNewUsers(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllCooperatorByLocation(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperatorByLocation(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllCooperatorInfoByAdmin(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperatorInfoByAdmin(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllsubAdminInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllsubAdminInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllCooperativeByAdmin(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperativeByAdmin(req, this._responseManager.getDefaultResponseHandler(res));
    }
    getSingleCooperative(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getSingleCooperative(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getSingleAdminInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getSingleAdminInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllVendorByLocation(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllVendorByLocation(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllCooperatorByWeek(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperatorByWeek(req, this._responseManager.getDefaultResponseHandler(res));
    }
 
    getAllCooperatorByMonth(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperatorByMonth(req, this._responseManager.getDefaultResponseHandler(res));
    }


    getAllCooperatorByYear(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperatorByYear(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllCooperatorByYear(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperatorByYear(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getSingleVendorInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getSingleVendorInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllVendorInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllVendorInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllCooperatorInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllCooperatorInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getSingleCooperatorInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getSingleCooperatorInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getAllSubCooperativeInfo(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getAllSubCooperativeInfo(req, this._responseManager.getDefaultResponseHandler(res));
    }

    ussdCheckTransPin(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.ussdCheckTransPin(req, this._responseManager.getDefaultResponseHandler(res));
    }

    getSingleSubCooperative(req, res, next) {
        // this.authenticate(req, res, next, (token, user) => {
        //     this._productHandler.getAllPosts(req, this._responseManager.getDefaultResponseHandler(res));
        // });

        this._authHandler.getSingleSubCooperative(req, this._responseManager.getDefaultResponseHandler(res));
    }

    create(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching User Create ");
        this._authHandler.createNewUser(req, responseManager.getDefaultResponseHandler(res));
        // this.authenticate(req, res, () => {
        //     this._authHandler.createNewUser(req, responseManager.getDefaultResponseHandler(res));
        // });
    }

    verifyUserandCreateAccount(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.verifyUserandCreateAccount(req, responseManager.getDefaultResponseHandler(res));
    }

    verifyUserandCreateAccount2(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.verifyUserandCreateAccount2(req, responseManager.getDefaultResponseHandler(res));
    }



    forgotPasswordMain(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.forgotPassword(req, responseManager.getDefaultResponseHandler(res));
    }

    forgot(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.forgot(req, responseManager.getDefaultResponseHandler(res));
    }

    reset(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.reset(req, responseManager.getDefaultResponseHandler(res));
    }

    getAllUsersByCooperative(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.getAllUsersByCooperative(req, responseManager.getDefaultResponseHandler(res));
    }


    getPasswordResetToken(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.getPasswordResetToken(req, responseManager.getDefaultResponseHandler(res));
    }

    changeTransPin(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching change PIN ");
        this._authHandler.changeTransPin(req, responseManager.getDefaultResponseHandler(res));
    }

    // changePin(req, res) {
    //     let responseManager = this._responseManager;
    //     console.log("Reaching change PIN ");
    //     this._authHandler.changePin(req, responseManager.getDefaultResponseHandler(res));
    // }

    // setAccountDetails(req, res) {
    //     let responseManager = this._responseManager;
    //     console.log("Reaching Set Account ");
    //     this._authHandler.setAccountDetails(req, responseManager.getDefaultResponseHandler(res));
    // }


    setAccountDetails(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._authHandler.setAccountDetails(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }




    checkTransPin(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching change PIN ");
        this._authHandler.checkTransPin(req, responseManager.getDefaultResponseHandler(res));
    }




    getVerifyCooperativeStaff(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching User Cooperative ");
        this._authHandler.getVerifyCooperativeStaff(req, responseManager.getDefaultResponseHandler(res));
    }

    editPhoneNumber(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.editPhoneNumber(req, responseManager.getDefaultResponseHandler(res));
    }

    sendMesssage(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.sendMesssage(req, responseManager.getDefaultResponseHandler(res));
    }



    // editProfile(req, res) {
    //     let responseManager = this._responseManager;
    //     console.log("Reaching Create New User ");
    //     this._authHandler.editProfile(req, responseManager.getDefaultResponseHandler(res));
    // }


    editProfile(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._authHandler.editProfile(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }


    // addUserAddress(req, res) {
    //     let responseManager = this._responseManager;
    //     console.log("Reaching Create New User ");
    //     this._authHandler.addUserAddress(req, responseManager.getDefaultResponseHandler(res));
    // }

    addUserAddress(req, res, next) {
        let responseManager = this._responseManager;
        let that = this;
        this._passport.authenticate('jwt-rs-auth', {
            onVerified: function (token, user) {
                that._authHandler.addUserAddress(req, user, responseManager.getDefaultResponseHandler(res));
            },
            onFailure: function (error) {
                responseManager.respondWithError(res, error.status || 401, error.message);
            }
        })(req, res, next);
    }




    resetPassword(req, res) {
        let responseManager = this._responseManager;
        console.log("Reaching Create New User ");
        this._authHandler.resetPassword(req, responseManager.getDefaultResponseHandler(res));
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

module.exports = UserController;