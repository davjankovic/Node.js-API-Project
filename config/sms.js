var request = require('request');


module.exports = {
    sendSMS: function(url, apiKey, username, sender, messagetext, flash, recipients) {

        var propertiesObject = { apiKey: apiKey, username: username, sender: sender, messagetext: messagetext, flash: flash, recipients: recipients };

        request({ url: url, qs: propertiesObject }, function(err, response, body) {
            if (err) { console.log(err); return; }
            console.log("Get response: " + response.statusCode);
        });

    }
};