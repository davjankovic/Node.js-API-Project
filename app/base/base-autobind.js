/**
 *  Created by Accelerar on 3/6/2018.
 */
const autoBind = require('auto-bind');

class BaseAutoBindedClass {
    constructor() {
        autoBind(this);
    }
}
module.exports = BaseAutoBindedClass;