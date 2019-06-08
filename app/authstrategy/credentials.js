/**
 *  Created by Accelerar on 3/6/2018.
 */

const LocalAuthStrategy = require('passport-local').Strategy;
const UserModel = require(APP_MODEL_PATH + 'user').UserModel;
const UnauthorizedError = require(APP_ERROR_PATH + 'unauthorized');
const NotFoundError = require(APP_ERROR_PATH + 'not-found');

class CredentialsAuthStrategy extends LocalAuthStrategy {
    constructor() {
        console.log("Login in API");
        super(CredentialsAuthStrategy.provideOptions(), CredentialsAuthStrategy.handleUserAuth);
    }

    get name() {
        return 'credentials-auth';
    }

    static handleUserAuth(cooperId, password, done) {

        UserModel.findOne({ cooperId: cooperId }, function(err, user) {
            if (err) {
                console.log("Error cooperId " + cooperId);
                return done(err);
            }
            if (!user) {
                return done(new NotFoundError("User not found"), false);
            }
            if (!user.checkPassword(password)) {
                console.log("Invalid cooperId " + cooperId);
                return done(new UnauthorizedError("Invalid credentials"), false);
            }
            console.log("Success cooperId " + cooperId);
            return done(null, user);
        });
    }

    static provideOptions() {
        return {
            usernameField: 'cooperId',
            passReqToCallback: false,
            passwordField: 'password',
            session: false
        };
    }

    getSecretKey() {
        throw new Error("No key is required for this type of auth");
    }
}
exports = module.exports = CredentialsAuthStrategy;