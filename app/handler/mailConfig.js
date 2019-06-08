/**
 *  Created by Accelerar on 3/6/2018.
 */
const MailConfigModel = require(APP_MODEL_PATH + 'mailConfig').MailConfigModel;
const AlreadyExistsError = require(APP_ERROR_PATH + 'already-exists');
const ValidationError = require(APP_ERROR_PATH + 'validation');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');

class MailConfigHandler {
    constructor() {
        this._validator = require('validator');
    }

    static get MAILCONFIG_VALIDATION_SCHEME() {
        return {
            'smtpURL': {
                notEmpty: true,

                errorMessage: 'Invalid SMTP URL'
            },
            'username': {
                notEmpty: true,

                errorMessage: 'Invalid username'
            },
            'password': {
                notEmpty: true,

                errorMessage: "Invalid password"
            },
            'type': {
                notEmpty: true,

                errorMessage: "Invalid type"
            }




        };
    }

    getMail(req, callback) {
        req.checkParams('id', 'Invalid user id provided');
        req.getValidationResult()
            .then((result) => {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There have been validation errors: ' + errorMessages.join(' && '));
                }

                let type = req.params.id;

                return new Promise(function(resolve, reject) {
                    MailConfigModel.findOne({ type: type }, function(err, user) {
                        if (user === null) {

                        } else {
                            resolve(user);
                        }
                    });
                });


            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    createMail(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(MailConfigHandler.MAILCONFIG_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new MailConfigModel({
                    smtpURL: validator.trim(data.smtpURL),
                    username: validator.trim(data.username),
                    password: validator.trim(data.password),
                    type: validator.trim(data.type),
                    port: validator.trim(data.port)


                });
            })

        .then((mail) => {
                mail.save();
                return mail;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}

module.exports = MailConfigHandler;