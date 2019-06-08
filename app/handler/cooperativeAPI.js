/**
 *  Created by Accelerar on 3/6/2018.
 */
const CooperativeAPIModel = require(APP_MODEL_PATH + 'cooperativeAPI').CooperativeAPIModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
//const UIDGenerator = require('uid-generator');
//const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58

class CooperativeAPIHandler extends BaseAutoBindedClass {
  constructor() {
    super();
    this._validator = require("validator");
  }

  static get VERIFY_COOPERATIVE_SCHEMA() {
    return {
      cooperativeId: {
        notEmpty: true,

        errorMessage: "Invalid Cooperative Id"
      }
    };
  }

  createCooperativeAPI(req, callback) {
    let data = req.body;
    let validator = this._validator;
    req.checkBody(CooperativeAPIHandler.VERIFY_COOPERATIVE_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }

        const api =  new CooperativeAPIModel({
          cooperativeId: validator.trim(data.cooperativeId),
          first_name: validator.trim(data.first_name),
          last_name: validator.trim(data.last_name),
          status: "Active",
            'apiAuthorization.url': data.url,
            'apiAuthorization.password': validator.trim(data.password),
            'apiAuthorization.username': validator.trim(data.username),
            'validateMember.url': data.endUrl,
            'apiTransaction.url': data.transUrl,
            'apiTransaction.description': validator.trim(data.description),
            'apiTransaction.emai': validator.trim(data.transEmail),
            'apiTransaction.value': validator.trim(data.value),
            'apiCheckStatus.OrderId': validator.trim(data.OrderId),
            'apiCheckStatus.url': data.statusUrl
        });

          

        
        
          return api;
      })
      .then(cooperative => {
        cooperative.save();
        return cooperative;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  deletecooperativeAPI(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Staff Id").isMongoId();
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          CooperativeAPIModel.findOne({ _id: req.params.id }, function(
            err,
            cooperative
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!cooperative) {
                reject(new NotFoundError("Token not found"));
              } else {
                resolve(cooperative);
              }
            }
          });
        });
      })
      .then(cooperative => {
        cooperative.remove();
        return cooperative;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  updatecooperativeAPI(req, callback) {
    let data = req.body;
    let validator = this._validator;
    req.checkBody(CooperativeAPIHandler.VERIFY_COOPERATIVE_SCHEMA);
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          CooperativeAPIModel.findOne({ _id: req.params.id }, function(
            err,
            cooperative
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!cooperative) {
                reject(new NotFoundError("Token not found"));
              } else {
                resolve(cooperative);
              }
            }
          });
        });
      })
      .then(cooperative => {
        cooperative.status = validator.trim(data.status);
        cooperative.first_name = validator.trim(data.first_name);
        cooperative.last_name = validator.trim(data.last_name);
        cooperative.dateModified = new Date();
        cooperative.save();
        return cooperative;
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getSinglecooperativeAPI(req, callback) {
    let data = req.body;
    req.checkParams("id", "Invalid Cooperative provided").isMongoId();
    req
      .getValidationResult()
      .then(function(result) {
        if (!result.isEmpty()) {
          let errorMessages = result.array().map(function(elem) {
            return elem.msg;
          });
          throw new ValidationError(
            "There are validation errors: " + errorMessages.join(" && ")
          );
        }
        return new Promise(function(resolve, reject) {
          CooperativeAPIModel.findOne({ _id: req.params.id }, function(
            err,
            cooperative
          ) {
            if (err !== null) {
              reject(err);
            } else {
              if (!cooperative) {
                reject(new NotFoundError("Token not found"));
              } else {
                resolve(cooperative);
              }
            }
          });
        });
      })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }

  getAllcooperativeAPI(req, callback) {
    let data = req.body;
    new Promise(function(resolve, reject) {
      CooperativeAPIModel.find({}, function(err, cooperative) {
        if (err !== null) {
          reject(err);
        } else {
          resolve(cooperative);
        }
      });
    })
      .then(saved => {
        callback.onSuccess(saved);
      })
      .catch(error => {
        callback.onError(error);
      });
  }
}

module.exports = CooperativeAPIHandler;