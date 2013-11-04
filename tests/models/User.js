require("../models/Company.js");

/**
 * User entity
 * @param {Object} object
 * @constructor
 */
User = function(object){
    /** @type {Number} */
    this.id = object.id;

    /** @type {Boolean} */
    this.isActive = object.isActive;

    /** @type {Number} */
    this.age = object.age;

    /** @type {String} */
    this.name = object.name;

    /** @type {Company} */
    this.company = new Company(object.company);

    /** @type {String} */
    this.email = object.email;

    /** @type {String} */
    this.registered = object.registered;

    /** @type {Number} */
    this.latitude = object.latitude;

    /** @type {Number} */
    this.longitude = object.longitude;

    /** @type {Object[]} */
    this.friends = object.friends;
};