/**
 * Company Entity
 * @param {Object} object
 * @constructor
 */
Company = function(object){
    /** @type {Number} */
    this.id = object.id;

    /** @type {String} */
    this.name = object.name;

    /** @type {String} */
    this.address = object.address;
};