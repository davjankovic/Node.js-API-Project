/**
 *  Created by Accelerar on 3/6/2018.
 */

'use strict';
const BaseError = require(APP_ERROR_PATH + 'base');

class InvalidPayloadError extends BaseError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = InvalidPayloadError;