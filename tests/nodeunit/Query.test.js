var packJson = require("../../package.json");
require("../../build/go-query." + packJson.version + ".js");
require("../models/User.js");

/** @type {User[]} */
var data = require("../sampledata/data.json");
var testCase = require('nodeunit').testCase;

/**
 * Gets a collection of users
 * @returns {User[]}
 */
function getUsersCollection() {
    /** @type {User[]} */
    var users = [];
    for (var i = 0; i < data.length; i++) {
        users.push(new User(data[i]));
    }

    return users;
}

module.exports = testCase({
    CreateQuery: function (test) {
        var query = new GO.Query(data);
        test.ok(query instanceof GO.Query, "Instance creation");
        test.done();
    },

    Methods: function (test) {
        var query = new GO.Query(data);
        test.ok(query.hasOwnProperty('select'));
        test.ok(query.hasOwnProperty('update'));
        test.ok(query.hasOwnProperty('remove'));
        test.done();
    },

    GetFrom: function (test) {
        var query = new GO.Query(data);
        test.ok(query.select() instanceof GO.Clause.From);
        test.ok(query.update() instanceof GO.Clause.From);
        test.ok(query.remove() instanceof GO.Clause.From);
        test.done();
    },

    ValidateRecord: function (test) {
        var query = new GO.Query(data);

        query.select();
        test.ok(query._getRecord().type == GO.query.type.SELECT);

        query.update();
        test.ok(query._getRecord().type == GO.query.type.UPDATE);

        query.remove();
        test.ok(query._getRecord().type == GO.query.type.DELETE);

        test.done();
    },

    TestQuerySelect: function (test) {
        var users = getUsersCollection();

        /** @type {GO.Query} */
        var query = new GO.Query(users);

        //SELECT
        var result = query.select("id", "name", "email")
            .from(User)
            .where(new GO.Filter("id", GO.op.EQ, 10))
            .run();

        test.equals(result.length, 1);
        test.strictEqual(result[0].name, "Stokes Knapp");
        test.strictEqual(result[0].email, "stokesknapp@xanide.com");
        test.ok(!result[0].hasOwnProperty("age"));

        test.done();
    },

    TestQueryUpdate: function (test) {
        var users = getUsersCollection();
        /** @type {GO.Query} */
        var query = new GO.Query(users);
        var record = query.update()
            .from(User)
            .where(
                new GO.Filter("name", GO.op.EQ, "Janell Kane")
            ).set({name: "test"}).run();

        test.equals(record[0].name, 'test');
        test.done();
    },

    TestQueryAnd: function (test) {
        var users = getUsersCollection();

        /** @type {GO.Query} */
        var query = new GO.Query(users);

        var record = query.select("id", "name", "email")
            .from(User)
            .where(
                new GO.Filter("name", GO.op.EQ, "Janell Kane")
                    .and("gender", GO.op.EQ, "female")
            );

        var result = record.run();

        test.equals(result.length, 1);
        test.equals(result[0].email, "janellkane@uxmox.com");
        test.done();
    }

});