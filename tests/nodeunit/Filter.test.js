var packJson = require("../../package.json");
require("../../build/go-query." + packJson.version +".js");

var testCase = require('nodeunit').testCase;

module.exports = testCase({
    CreateFilter: function(test){
        var filter = new GO.Filter();
        test.ok(filter instanceof GO.Filter, "Instance creation");
        test.done();
    }
});