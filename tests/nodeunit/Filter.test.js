var packJson = require("../../package.json");
var GO = require("goquery").GO;

var testCase = require('nodeunit').testCase;

module.exports = testCase({
    CreateFilter: function(test){
        var filter = new GO.Filter();
        test.ok(filter instanceof GO.Filter, "Instance creation");
        test.done();
    },

    Operators: function(test){
        var filter = new GO.Filter("id", GO.op.EQ, 0);

        test.ok(filter.and instanceof Function);
        test.ok(filter.or instanceof Function);
        test.ok(filter.xor instanceof Function);
        test.done();
    },

    FilterChain: function(test){
        var filter = new GO.Filter("id", GO.op.EQ, 0);
        test.ok(filter.and("name", GO.op.GT, "John") instanceof GO.Filter);
        test.ok(filter.or("name", GO.op.GT, "John") instanceof GO.Filter);
        test.ok(filter.xor("name", GO.op.GT, "John") instanceof GO.Filter);
        test.done();
    },

    BackToTheRoot: function(test){
        var filter = new GO.Filter("id", GO.op.EQ, 0);
        var deepFilter = filter.and("name", GO.op.EQ, "John");

        test.strictEqual(filter, deepFilter.root());
        test.done();
    },

    NextFilter: function(test){
        var filter = new GO.Filter("id", GO.op.EQ, 0);
        var deepFilter = filter.and("name", GO.op.EQ, "John");

        test.strictEqual(filter.next(), deepFilter);
        test.done();
    },

    Empty: function(test){
        var filter1 = new GO.Filter("id", GO.op.EQ, 0);
        var filter2 = new GO.Filter(new GO.Filter("id", GO.op.EQ, 0));
        var filter3 = new GO.Filter();

        test.ok(!filter1.isEmpty());
        test.ok(!filter2.isEmpty());
        test.ok(filter3.isEmpty());
        test.done();
    }
});