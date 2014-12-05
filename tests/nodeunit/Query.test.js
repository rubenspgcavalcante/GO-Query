'use strict';

var packJson = require("../../package.json");

var GO = require("../../index");

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

        query.select("id", "name", "email")
            .from(User)
            .where(new GO.Filter("id", GO.op.EQ, 10)).run();

        test.equals(query.length, 1);
        test.strictEqual(query[0].name, "Stokes Knapp");
        test.strictEqual(query[0].email, "stokesknapp@xanide.com");
        test.ok(!query[0].hasOwnProperty("age"));

        test.done();
    },

    TestQueryCustomOperator: function(test){
        var users = getUsersCollection();

        /** @type {GO.Query} */
        var query = new GO.Query(users);

        query.select("id", "name", "email")
            .from(User)
            .where(new GO.Filter('name', function(fValue, value){
                return fValue === value;
            }, 'Lucas Morin')).run();

        test.strictEqual(query[0].name, 'Lucas Morin');
        test.done();
    },

    TestQueryInnerSelect: function (test) {
        var users = getUsersCollection();
        /** @type {GO.Query} */
        var query = new GO.Query(users);

        query.select("name", "company.name")
            .from(User)
            .where(new GO.Filter("company.name", GO.op.EQ, "Suremax")).run();

        test.equals(query[0].name, "Lucas Morin");
        test.ok(query[0].hasOwnProperty("company"));
        test.ok(query[0].company.hasOwnProperty("name"));

        test.done();
    },

    TestQueryUpdate: function (test) {
        var users = getUsersCollection();
        /** @type {GO.Query} */
        var query = new GO.Query(users);
        query.update()
            .from(User)
            .where(
            new GO.Filter("name", GO.op.EQ, "Janell Kane")
        ).set({name: "test"}).run();

        test.equals(query[0].name, 'test');
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
        ).run();

        test.equals(query.length, 1);
        test.equals(query[0].email, "janellkane@uxmox.com");
        test.done();
    },

    TestQueryOr: function (test) {
        var users = getUsersCollection();

        /** @type {GO.Query} */
        var query = new GO.Query(users);

        query.select("id", "name", "email")
            .from(User)
            .where(
            new GO.Filter("name", GO.op.EQ, "Lucas Morin")
                .or("name", GO.op.EQ, "Susie Acevedo")
        ).run();

        test.equals(query.length, 2);
        test.done();
    },

    TestQueryOrderBy: function (test) {
        var users = getUsersCollection();

        /** @type {GO.Query} */
        var query = new GO.Query(users);

        var record = query.select('*')
            .from(Object)
            .where();

        test.doesNotThrow(function () {
            record.orderBy("age", GO.order.ASC).run();
            test.equals(query.length, users.length);
            test.equals(query[0].age, 14);

            record.orderBy("age", GO.order.DESC).run();
            test.equals(query.length, users.length);
            test.equals(query[0].age, 80);

        }, GO.Error.OperatorError, "OperatorError");

        test.done();
    },

    TestQueryStates: function (test) {
        var users = getUsersCollection();
        var randomData = [];
        var randomLen = Math.floor((Math.random() * 1000) + 1);

        for (var i = 0; i < randomLen; i++) {
            randomData.push(Math.random());
        }

        var query = new GO.Query(users);
        query.saveState();

        query.setData(randomData);
        query.saveState();

        query.setData([]);
        test.equals(query.length, 0);

        query.undo();
        test.equals(query.length, randomLen);

        query.undo();
        test.equals(query.length, users.length);

        test.done();
    }
});