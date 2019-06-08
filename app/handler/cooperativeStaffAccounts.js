/**
 *  Created by Accelerar on 3/6/2018.
 */
const nodemailer = require("nodemailer");
const CooperativeStaffAccountsModel = require(APP_MODEL_PATH + 'cooperativeStaffAccounts').CooperativeStaffAccountsModel;
const AlreadyExistsError = require(APP_ERROR_PATH + 'already-exists');
const NotFoundError = require(APP_ERROR_PATH + "not-found");
const ValidationError = require(APP_ERROR_PATH + 'validation');
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');
const UserModel = require(APP_MODEL_PATH + "user").UserModel;
const CooperativeAPIModel = require(APP_MODEL_PATH + 'cooperativeAPI').CooperativeAPIModel;
var Client = require("node-rest-client").Client;
var client = new Client();
const path = require('path');
const Email = require('email-templates');
const dotenv = require('dotenv');

dotenv.load({ path: '.env' });
// var template = fs.readFileSync('../../views/email.hbs');


class CooperativeStaffAccountsHandler {
    constructor() {
        this._validator = require('validator');
    }

    static get CooperativeStaffAccounts_VALIDATION_SCHEME() {
        return {
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative id'
            },
            'staffId': {
                notEmpty: true,

                errorMessage: 'Invalid Staff id'
            },
            'accountType': {
                notEmpty: true,

                errorMessage: "input account type"
            }


        };
    }

    static get DeductStaffAccounts_VALIDATION_SCHEME() {
        return {
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative id'
            },
            'staffId': {
                notEmpty: true,

                errorMessage: 'Invalid Staff id'
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
              
                    return new Promise(function(resolve, reject) {
                        CooperativeStaffAccountsModel.findById(userId, function(err, user) {
                            if (user === null) {
                                reject(err);
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

    createNewUser(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(CooperativeStaffAccountsHandler.CooperativeStaffAccounts_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new CooperativeStaffAccountsModel({


                    cooperativeId: validator.trim(data.cooperativeId),
                    staffId: validator.trim(data.staffId),
                    accountType: validator.trim(data.accountType),
                    accountBalance: validator.trim(data.accountBalance),
                    bookBalance: validator.trim(data.bookBalance)
                });
            })
            .then((user) => {
                return new Promise(function(resolve, reject) {

                    CooperativeStaffAccountsModel.find({ cooperativeId: user.cooperativeId, staffId: user.staffId, accountType: user.accountType }, function(err, docs) {
                        if (docs.length) {
                            reject(new AlreadyExistsError("User already exists"));
                        } else {
                            resolve(user);
                        }
                    });
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




    DeductStaffAccounts(req, callback) {
        let data = req.body;
        let dataApi = req.body;
        let validator = this._validator;
        req.checkBody(CooperativeStaffAccountsHandler.DeductStaffAccounts_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function (result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function (elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function (resolve, reject) {

                 
                    console.log('yeah transaction onboard')

                    UserModel.findOne({ staffId: data.staffId }, function (err, user) {

                        if (err !== null) {
                            reject(error);


                        } else {
                            if (!user) {
                                reject(new NotFoundError("Account not found"));
                            } else {



                                // console.log('yeah transaction');
                        try {

                            CooperativeAPIModel.findOne({ cooperativeId: data.cooperativeId }, function (err, cooperative) {
                                // console.log('yeah transaction 1' + cooperative);
                                if (err !== null) {
                                    reject(err);
                                } else {
                                    if (cooperative === null) {
                                        reject(new NotFoundError("Cooperative not found"));
                                        // console.log('cooperative is null');
                                    } else {
                                        var args = {
                                            data: { grant_type: 'password', username: cooperative.apiAuthorization.username, password: cooperative.apiAuthorization.password },
                                            headers: { "Content-Type": "application/x-www-form-urlencoded" }
                                        };
                                        let urlapi = cooperative.apiAuthorization.url;

                                        client.post("" + urlapi + "", args, function (data, response) {
                                            // parsed response body as js object
                                            console.log("Data from Cooplag " + JSON.stringify(data));
                                            // raw response
                                            console.log('Response from Cooplag' + response);


                                            if (data !== null) {


                                                // let descriptionMessage = ` Transaction from CooperSwitch: Vendor ${vendor.firstName} ${vendor.lastName},  `;
                                                // console.log(descriptionMessage)
                                                var args = {
                                                    data: { description: '', email: user.staffId, value: dataApi.amount },
                                                    headers: { "Content-Type": "application/x-www-form-urlencoded", "Authorization": "Bearer " + data.access_token }
                                                };
                                                let urlapi = cooperative.apiTransaction.url;

                                                client.post("" + urlapi + "", args, function (data, response) {
                                                    // parsed response body as js object
                                                    console.log("Data from Cooplag " + JSON.stringify(data));
                                                    // raw response
                                                    console.log('Response from Cooplag' + response);

                                                    dataApi.vendors.forEach(element => {


                                                        UserModel.findOne({ cooperId: element.vendorId }, function (err, vendor) {

                                                            if (err !== null) {
                                                                reject(error);


                                                            } else {
                                                                if (!vendor) {
                                                                    reject(new NotFoundError("vendor not found"));
                                                                } else {
                                                                    console.log('this is email' + vendor.email)

                                                                    try {
                                                                        sendEmail("www.cooperswitch.com", vendor.email, element.products, dataApi.description, 'Vendor', vendor.firstName)
                                                                    } catch (e) {
                                                                        console.error(e.message);
                                                                    }

                                                                }

                                                            }

                                                        })


                                                    });
                                                    console.log(dataApi.description)
                                                    console.log(dataApi.staffId)

                                                    try {
                                                        sendEmail("www.cooperswitch.com", dataApi.staffId, dataApi.product, dataApi.description, "Cooperator", user.firstName);
                                                    } catch (e) {
                                                        console.log(e.message);
                                                    }

                                                    //    console.log(dataApi.vendors)


                                                    if (data.Status === 'Submitted') {

                                                        resolve(dataApi);

                                                    } else {
                                                        reject(new NotFoundError("Staff not found"));
                                                    }
                                                    // raw response
                                                    // console.log('Response from Cooplag' + response);
                                                }).on('error', function (err) {
                                                    console.log('something went wrong on the request');
                                                });

                                                // handling client error events
                                                client.on('error', function (err) {
                                                    console.error('Something went wrong on the client', err);
                                                });

                                            }

                                        }).on('error', function (err) {
                                            console.log('something went wrong on the request');
                                        });

                                        // handling client error events
                                        client.on('error', function (err) {
                                            console.error('Something went wrong on the client', err);
                                        });

                                        // resolve(cooperative);
                                    }
                                }

                            })   
                        } catch (e) {
                            console.error(e.message);
                        }

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
    
}



function sendEmail(emailLinks, emailaddress,  product, description, userMode, firstName) {

    var templateDir = path.join(__dirname, '../../', 'templates', 'mailTemplates')

    const email = new Email({
        views: { root: templateDir },

        send: true,
        transport: {
            name: process.env.MAIL_NAME,
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME, // generated ethereal user
                pass: process.env.MAIL_PASSWORD // generated ethereal password
            },
            tls: {
                rejectUnauthorized: false
            }
        },


    });
  
                      
  if (userMode === "Vendor" && typeof product !== undefined) {
    
          //create the path of email template folder 
          

       email.send({
              template: path.join(__dirname, '../../', 'templates', 'mailTemplates'),
              message: {
                  to: emailaddress,
                  from: '"Cooper Switch" <info@cooperswitch.com>',
              },
         
              locals: {
                  emailaddress: emailaddress,
                  product: product,
                  firstName: firstName
              }
          })
          .then(console.log)
          .catch(console.error);

      
  } else if (userMode === "Cooperator" && typeof description !== undefined) {






      email.send({
          template: path.join(__dirname, '../../', 'templates', 'copMailTemplates'),
          message: {
              to: emailaddress,
              from: '"Cooper Switch" <info@cooperswitch.com>',
          },

          locals: {
              emailaddress: emailaddress,
              description: description,
              firstName: firstName
          }
      })
          .then((console.log))
          .catch(console.error);
    // setup email data with unicode symbols
  
    
  }
}

module.exports = CooperativeStaffAccountsHandler;