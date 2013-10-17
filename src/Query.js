/**
 * Creates a query object
 * @author Rubens Pinheior Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {Object[]} collection
 * @constructor
 */
GO.Query = function(collection){
    this.collection  = collection;

    /**
     * Internal data to control the query
     * @namespace
     * @property {GO.Query.type} type The query type
     * @property {String[]} selection
     * @property {GO.Core.From} from
     * @property {GO.Core.Where} where
     * @property {String[]} updateTo
     * @property {GO.Core.OrderBy} orderBy
     */
    var record = {
        type: null,
        selection: null,
        from: null,
        where: null,
        updateTo: [],
        orderby: null
    };

    /**
     * Returns the internal record data
     * @returns {{type: null, selection: null, from: null, where: null, updateTo: Array, orderby: null}}
     */
    this._getRecord = function(){
        return record;
    };

    /**
     * Sets a value into the selected record key
     * @param {String} key
     * @param {*} value
     */
    this._setRecord = function(key, value){
        record[key] = value;
    };

    //noinspection JSCommentMatchesSignature
    /**
     * Do a select operation into the collection
     * @param {...String}
     * @return {GO.Clause.From} from object
     */
    this.select = function(){
        record.type = GO.query.type.SELECT;
        record.selection = arguments;
        return new GO.Clause.From(this);
    };

    /**
     * Do a update operation into the collection
     * @return {GO.Clause.From} from object
     */
    this.update = function(){
        record.type = GO.query.type.UPDATE;
        return new GO.Clause.From(this);
    };

    /**
     * Do a delete operation into the collection
     * @returns {GO.Clause.From}
     */
    this.remove = function(){
        record.type = GO.query.type.DELETE;
        record.selection = arguments;
        return new GO.Clause.From(this);
    };
};