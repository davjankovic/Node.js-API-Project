/**
 *  Created by Accelerar on 3/6/2018.
 */

'use strict';
const BaseError = require(APP_ERROR_PATH + 'base');

class NotFoundError extends BaseError {
    constructor(message) {
        super(message, 404);
    }
}

module.exports = NotFoundError;