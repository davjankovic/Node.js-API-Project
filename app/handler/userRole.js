/**
 *  Created by Accelerar on 3/6/2018.
 */
const UserRoleModel = require(APP_MODEL_PATH + 'userRole').UserRoleModel;
const AlreadyExistsError = require(APP_ERROR_PATH + 'already-exists');
const ValidationError = require(APP_ERROR_PATH + 'validation');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');

class UserRoleHandler {
    constructor() {
        this._validator = require('validator');
    }

    static get USERROLE_VALIDATION_SCHEME() {
        return {
           
            'cooperator': {
                notEmpty: true,
                errorMessage: "input cooperator"
            },
            'vendor': {
                notEmpty: true,
                errorMessage: "input vendor"
            },
            'subVendor': {
                notEmpty: true,
                errorMessage: "input subvendor"
            },
            'cooperative': {
                notEmpty: true,
                errorMessage: "input cooperative"
            },
            'subCooperative': {
                notEmpty: true,
                errorMessage: "input subcooperative"
            },
            'cooperAdmin': {
                notEmpty: true,
                errorMessage: "input cooperadmin"
            },
            'subCooperAdmin': {
                notEmpty: true,
                errorMessage: "input subcooperadmin"
            },

            
            


        };
    }

    getUserInfo(req, userToken, callback) {
        req.checkParams('id', 'Invalid user id provided').isMongoId();
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                let userId = req.params.id;
                if (userToken.id !== req.params.id) {
                    throw new UnauthorizedError("Provided id doesn't match with  the requested user id")
                } else {
                    return new Promise(function(resolve, reject) {
                        UserRoleModel.findById(userId, function(err, user) {
                            if (user === null) {

                            } else {
                                resolve(user);
                            }
                        });
                    });
                }

            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    createNewUser(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(UserRoleHandler.USERROLE_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new UserRoleModel({

                    cooperator: validator.trim(data.cooperator),
                    vendor: validator.trim(data.vendor),
                    subVendor: validator.trim(data.subVendor),
                    cooperative: validator.trim(data.cooperative),
                    subCooperative: validator.trim(data.subCooperative),
                    cooperAdmin: validator.trim(data.cooperAdmin),
                    subCooperAdmin: validator.trim(data.subCooperAdmin),
                    
                });
            })
          
            .then((user) => {
                user.save();
                return user;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}

module.exports = UserRoleHandler;