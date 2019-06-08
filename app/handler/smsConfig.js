/**
 *  Created by Accelerar on 3/6/2018.
 */
const SmsConfigModel = require(APP_MODEL_PATH + 'smsConfig').SmsConfigModel;
const AlreadyExistsError = require(APP_ERROR_PATH + 'already-exists');
const ValidationError = require(APP_ERROR_PATH + 'validation');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');

class SmsConfigHandler {
    constructor() {
        this._validator = require('validator');
    }

    static get SMSCONFIG_VALIDATION_SCHEME() {
        return {
            'url': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 5, max: 10000 }],
                    errorMessage: 'url  must be greater than 5 chars long'
                },
                errorMessage: 'Invalid url'
            },
            'apiKey': {
                notEmpty: true,
                isLength: {
                    options: [{ min: 5, max: 1000 }],
                    errorMessage: 'api key  must be greater than 5 chars long'
                },
                errorMessage: 'Invalid api key'
            },
            'username': {
                notEmpty: true,

                errorMessage: "input username"
            }


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
                        SmsConfigModel.findById(userId, function(err, user) {
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
        req.checkBody(SmsConfigHandler.SMSCONFIG_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new SmsConfigModel({

                    url: validator.trim(data.url),
                    username: validator.trim(data.username),
                    apiKey: validator.trim(data.apiKey),
                    
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

module.exports = SmsConfigHandler;