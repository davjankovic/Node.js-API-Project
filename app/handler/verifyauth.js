/**
 *  Created by Accelerar on 3/6/2018.
 */
'use strict';
const nodemailer = require('nodemailer');

const VerifyAuthModel = require(APP_MODEL_PATH + 'VerifyAuth').VerifyAuthModel;
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
const ValidationError = require(APP_ERROR_PATH + 'validation');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');
const BaseAutoBindedClass = require(APP_BASE_PACKAGE_PATH + 'base-autobind');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58



class VerifyAuthHandler extends BaseAutoBindedClass {
    constructor() {
        super();
        this._validator = require('validator');
    }

    static get VERIFY_AUTH_VALIDATION_SCHEME() {
        return {
            'cooperativeId': {
                notEmpty: true,

                errorMessage: 'Invalid Cooperative Id'
            },

            'staffId': {
                notEmpty: true,
                errorMessage: "Invalid staff Id"
            },
            'email': {
                notEmpty: true,
                errorMessage: "Invalid email "
            }


        };
    }

    createVerifyAuth(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(VerifyAuthHandler.VERIFY_AUTH_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }

                var date = new Date();
                date.setDate(date.getDate() + 3);

                const verifyToken = uidgen.generateSync();
                console.log("Reaching Auth Creation" + verifyToken);
                return new VerifyAuthModel({
                    staffId: validator.trim(data.staffId),
                    cooperativeId: validator.trim(data.cooperativeId),
                    veryauthtoken: verifyToken,
                    email: validator.trim(data.email),
                    phoneNumber: data.phoneNumber,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    status: "Active",
                    authType: data.authType,
                    expires: date

                });
            })
            .then((verifyauth) => {
                verifyauth.save();

                sendEmail("http://54.183.87.149:3000/v1/users/verifyuser/" + verifyauth.veryauthtoken, verifyauth.email, verifyauth.firstName);


                return verifyauth;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    sendOTP(req, callback) {
        let data = req.body;
        let validator = this._validator;
        var passToken;
        req.checkParams('id', 'Invalid User Id provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                let userId = req.params.id;


                return new Promise(function(resolve, reject) {

                    UserModel.findOne({ _id: userId }, function(err, user) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!user) {
                                reject(new NotFoundError("User not found"));
                            } else {


                                console.log("Staff Id " + user.staffId);
                                const verifyToken = uidgen.generateSync();
                                console.log("Reaching Auth Creation" + verifyToken);

                                passToken = Math.floor(Math.random() * 900000) + 100000;
                                resolve(new VerifyAuthModel({
                                    staffId: user.staffId,
                                    userId: user._id,
                                    cooperativeId: user.cooperativeId,
                                    veryauthtoken: verifyToken,
                                    otp: passToken,
                                    email: user.email,
                                    phoneNumber: user.phoneNo,
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    status: "Active",
                                    authType: "New",
                                    expires: Date.now() + 86400000
                                }));
                            }
                        }
                    });



                });



            })
            .then((verifyauth) => {
                verifyauth.save();

                //sendEmail("" + verifyauth.veryauthtoken, verifyauth.email, verifyauth.firstName);
                // sendTokenMail
                //send sms
                sendSMS("http://api.ebulksms.com:8080/sendsms?", "d49c5155313577e7c17ef59ce87cbace4f63a239", "richomoro@yahoo.com", "c-switch", passToken, "0", verifyauth.phoneNumber)
                return verifyauth;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }




    deleteVerifyAuth(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Token provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    VerifyAuthModel.findOne({ _id: req.params.id }, function(err, verifyauth) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!verifyauth) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(verifyauth);
                            }
                        }
                    })
                });
            })
            .then((verifyauth) => {
                verifyauth.remove();
                return verifyauth;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    updateVerifyAuth(req, callback) {
        let data = req.body;
        let validator = this._validator;
        req.checkBody(VerifyAuthHandler.VERIFY_AUTH_VALIDATION_SCHEME);
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    VerifyAuthModel.findOne({ _id: req.params.id }, function(err, verifyauth) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!verifyauth) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(verifyauth);
                            }
                        }
                    })
                });
            })
            .then((verifyauth) => {
                verifyauth.status = validator.trim(data.status);
                verifyauth.dateModified = new Date();
                verifyauth.save();
                return verifyauth;
            })
            .then((saved) => {
                callback.onSuccess(saved);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getSingleVerifyAuth(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Token provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    VerifyAuthModel.findOne({ _id: req.params.id }, function(err, verifyauth) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!verifyauth) {
                                reject(new NotFoundError("Token not found"));
                            } else {
                                resolve(verifyauth);
                            }
                        }
                    })
                });
            })
            .then((post) => {
                callback.onSuccess(post);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }

    getUserOTP(req, callback) {
        let data = req.body;
        req.checkParams('id', 'Invalid Token provided');
        req.checkParams('userId', 'Invalid UserId provided').isMongoId();
        req.getValidationResult()
            .then(function(result) {
                if (!result.isEmpty()) {
                    let errorMessages = result.array().map(function(elem) {
                        return elem.msg;
                    });
                    throw new ValidationError('There are validation errors: ' + errorMessages.join(' && '));
                }
                return new Promise(function(resolve, reject) {
                    VerifyAuthModel.findOne({
                        otp: req.params.id,
                        userId: req.params.userId,
                        status: "Active",
                        expires: {
                            $gt: Date.now()
                        }
                    }, function(err, verifyauth) {
                        if (err !== null) {
                            reject(err);
                        } else {
                            if (!verifyauth) {
                                reject(new NotFoundError("Token not found or it has expired"));
                            } else {


                                verifyauth.status = "InActive";
                                verifyauth.save();


                                UserModel.findOne({ _id: req.params.userId }, function(err, user) {
                                    if (err !== null) {
                                        reject(err);
                                    } else {
                                        if (!user) {
                                            reject(new NotFoundError("User not found"));
                                        } else {

                                            if (user.userTypeId === "Cooperator")
                                            {
                                                if (user.userMode === "TransPin") {
                                                    user.userMode = "Confirm";

                                                }
                                                if (user.userMode === "OTPVerify") {
                                                    user.userMode = "TransPin";

                                                }
                                            }else
                                            {
                                               
                                                if (user.userMode === "OTPVerify") {
                                                    user.userMode = "AccountDetails";

                                                }
                                            }
                                           

                                          

                                            user.save();

                                            resolve(user);
                                        }
                                    }
                                });





                                // resolve(verifyauth);
                            }
                        }
                    })
                });
            }).then((user) => {




                return user;

            })
            .then((user) => {

                // verifyauth.save();

                //Send Email and SMS



                return user;
            })
            .then((user) => {
                callback.onSuccess(user);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }


    getAllVerifyAuth(req, callback) {
        let data = req.body;
        new Promise(function(resolve, reject) {
                VerifyAuthModel.find({}, function(err, posts) {
                    if (err !== null) {
                        reject(err);
                    } else {
                        resolve(posts);
                    }
                });
            })
            .then((posts) => {
                callback.onSuccess(posts);
            })
            .catch((error) => {
                callback.onError(error);
            });
    }
}

module.exports = VerifyAuthHandler;


function sendEmail(emailLinks, emailaddress, name) {

    // nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: 'mail.cooperswitch.com',
        port: 465,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'info@cooperswitch.com', // generated ethereal user
            pass: 'password@1' // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Info " <info@cooperswitch.com>', // sender address
        to: `'${emailaddress}, nukstel@yahoo.com'`, // list of receivers
        subject: 'Account Creation', // Subject line
        text: 'Account Creation', // plain text body
        html: `'
             Hi ${name}, <br/>
             <p>Thanks for creating a Cooper Switch account. To continue, please confirm your email address by clicking the button below.</p>
            <b>Hello world? Click ${emailLinks}</b> <br/>
            <p>Thanks,</p><br/>
            <p>Team CooperSwitch</p>'` // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    });
    // });

}




function sendSMS(url, apiKey, username, sender, messagetext, flash, recipients) {



    // request('http://api.ebulksms.com:8080/sendsms?username=richomoro@yahoo.com&apikey=d49c5155313577e7c17ef59ce87cbace4f63a239&sender=c-switch&messagetext=' + messagetext + '&flash=0&recipients=' + mainphoneNumber, function (error, response, body) {


    var mainphoneNumber = "234" + recipients.replace(/^0+/, '');

    console.log("Token Recipient " + mainphoneNumber);
    var request = require('request');
    request('http://knp4x.api.infobip.com/sms/1/text/query?username=cooperswitch&password=Accelerar1&to=' + mainphoneNumber + messagetext, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    }).on('error', () => console.log('errored'));



    // var propertiesObject = { apiKey: apiKey, username: username, sender: sender, messagetext: messagetext, flash: flash, recipients: recipients };

    // request({ url: url, qs: propertiesObject }, function(err, response, body) {
    //     if (err) { console.log(err); return; }
    //     console.log("Get response: " + response.statusCode);
    // });

}


function sendSMS2(url, apiKey, username, sender, messagetext, flash, recipients) {




    var mainphoneNumber = "234" + recipients.replace(/^0+/, '');

    console.log("Token Recipient " + mainphoneNumber);
    var request = require('request');
    request('http://api.ebulksms.com:8080/sendsms?username=richomoro@yahoo.com&apikey=d49c5155313577e7c17ef59ce87cbace4f63a239&sender=c-switch&messagetext=' + messagetext + '&flash=0&recipients=' + mainphoneNumber, function(error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    }).on('error', () => console.log('errored'));



    // var propertiesObject = { apiKey: apiKey, username: username, sender: sender, messagetext: messagetext, flash: flash, recipients: recipients };

    // request({ url: url, qs: propertiesObject }, function(err, response, body) {
    //     if (err) { console.log(err); return; }
    //     console.log("Get response: " + response.statusCode);
    // });

}