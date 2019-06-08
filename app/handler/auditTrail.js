/**
 *  Created by Accelerar on 3/6/2018.
 */
const AuditTrailModel = require(APP_MODEL_PATH + 'auditTrail').AuditTrailModel;
const AlreadyExistsError = require(APP_ERROR_PATH + 'already-exists');
const ValidationError = require(APP_ERROR_PATH + 'validation');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');

var where = require('node-where');

class AuditTrailHandler {
    constructor() {
        this._validator = require('validator');
    }

    static get AUDITTRAIL_VALIDATION_SCHEME() {
        return {

            'cooperId': {
                notEmpty: true,

                errorMessage: 'Invalid cooperid'
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
                        AuditTrailModel.findById(userId, function(err, user) {
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

    createAuditTrail(req, callback) {


        let data = req.body;
        let validator = this._validator;
        req.checkBody(AuditTrailHandler.AUDITTRAIL_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                // where.is('', function(err, result) {
                //     if (result) {
                //         console.log('City: ' + result.get('city'));
                //         console.log('State / Region: ' + result.get('region'));
                //         console.log('State / Region Code: ' + result.get('regionCode'));
                //         console.log('Zip: ' + result.get('postalCode'));
                //         console.log('Country: ' + result.get('country'));
                //         console.log('Country Code: ' + result.get('countryCode'));
                //         console.log('Lat: ' + result.get('lat'));
                //         console.log('Lng: ' + result.get('lng'));
                //     }
                // });


                return new AuditTrailModel({

                    cooperId: validator.trim(data.cooperId),
                    ipAddress: req.connection.remoteAddress.replace(/^.*:/, ''),
                    loginTime: validator.trim(data.loginTime),
                    sessionTime: validator.trim(data.sessionTime),
                    model: validator.trim(data.model),
                    deviceType: validator.trim(data.deviceType),
                    os: validator.trim(data.os),
                    osVersion: validator.trim(data.osVersion),
                    sdkVersion: validator.trim(data.sdkVersion),
                    language: validator.trim(data.language),
                    manufacturer: validator.trim(data.manufacturer),
                    uuid: validator.trim(data.uuid),
                    heightDIPs: data.heightDIPs,
                    heightPixels: data.heightPixels,
                    scale: data.scale,
                    widthDIPs: data.widthDIPs,
                    widthPixels: data.widthPixels,
                    location: data.location,





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

module.exports = AuditTrailHandler;