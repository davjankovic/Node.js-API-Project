/**
 *  Created by Accelerar on 3/6/2018.
 */
const NotificationModel = require(APP_MODEL_PATH + 'notification').NotificationModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class NotificationHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_NOTIFICATION_SCHEMA() {
        return {
            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooper Id'
            },

        };
    }

    createNotification(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(NotificationHandler.VERIFY_NOTIFICATION_SCHEMA);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }




                return new NotificationModel({

                    cooperId: validator.trim(data.cooperId),
                    message: validator.trim(data.message),
                    status: "Unread"



                });
            })
            .then((cooper) => {
                cooper.save();
                return cooper;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    deletenotification(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Notification Id').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    NotificationModel.findOne({ _id: req.params.id }, function (err, notification) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!notification) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(notification);
                            }
                        }
                    })
                });
            })
            .then((notification) => {
                notification.remove();
                return notification;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updatenotification(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(NotificationHandler.VERIFY_NOTIFICATION_SCHEMA);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                    NotificationModel.findOne({ _id: req.params.id, status: "Unread" }, function (err, notification) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!notification) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(notification);
                            }
                        }
                    })
                });
            })
            .then((notification) => {
                notification.status = validator.trim(data.status);
                notification.dateModified = new Date();
                notification.save();
                return notification;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getNotficationByCooperId(req, callback) {
        let data = req.body;
        // req.checkParams('id', 'Invalid Notification provided').isMongoId();
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {
                   NotificationModel.find({ cooperId: data.cooperId, status: "Unread" }, function (err, notification) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!notification) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(notification);
                            }
                        }
                    })
                });
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getAllnotfication(req, callback) {
        let data = req.body;
        new Promise(function (resolve, reject) {
         NotificationModel.find({status: "Unread"}, function (err, notification) {
                if (err !== null) {
                    reject(err);
                } else {
                    resolve(notification);
                }
            });
        })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}

module.exports = NotificationHandler;