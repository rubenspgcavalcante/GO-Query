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
        test.ok(query.hasOwnProperty('select'));
        test.ok(query.hasOwnProperty('update'));
        test.ok(query.hasOwnProperty('remove'));
        test.done();
    },

    GetFrom: function(test){
        var query = new GO.Query(data);
        test.ok(query.select() instanceof GO.Core.From);
        test.ok(query.update() instanceof GO.Core.From);
        test.ok(query.remove() instanceof GO.Core.From);
        test.done();
    },

    ValidateRecord: function(test){
        var query = new GO.Query(data);

        query.select();
        test.ok(query._getRecord().type == GO.query.type.SELECT);

        query.update();
        test.ok(query._getRecord().type == GO.query.type.UPDATE);

        query.remove();
        test.ok(query._getRecord().type == GO.query.type.DELETE);

        test.done();
    }

});