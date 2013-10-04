var packJson = require("../../package.json");
require("../../build/go-query." + packJson.version +".js");

var data = require("../sampledata/data.json");
var testCase = require('nodeunit').testCase;

module.exports = testCase({
    CreateQuery: function(test){
        var query = new GO.Query(data);
        test.ok(query instanceof GO.Query, "Instance creation");
        test.done();
    },

    Methods: function(test){
        var query = new GO.Query(data);
        test.expect(3);
        test.ok(query.hasOwnProperty('select'));
        test.ok(query.hasOwnProperty('update'));
        test.ok(query.hasOwnProperty('remove'));
        test.done();
    }
});