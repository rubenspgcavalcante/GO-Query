(function(GO) {
    /**
     * Creates a query object
     * @author Rubens Pinheior Gonçalves Cavalcante
     * @since 2013-09-28
     * @param {Object[]} collection A array of objects of any type
     * @constructor
     */
    GO.Query = function (collection) {
        this.collection = collection;

        /** @type {GO.Core.Record} */
        var record = new GO.Core.Record();

        /**
         * Returns the internal record data
         * @returns {GO.Core.Record}
         */
        this._getRecord = function () {
            return record;
        };

        /**
         * Sets a value into the selected record key
         * @param {String} key
         * @param {*} value
         */
        this._setRecord = function (key, value) {
            if (record[key] instanceof Array) {
                record[key].push(value);
            }
            else {
                record[key] = value;
            }
        };

        //noinspection JSCommentMatchesSignature
        /**
         * Do a select operation into the collection
         * @param {...String}
         * @return {GO.Clause.From} from object
         */
        this.select = function () {
            record.type = GO.query.type.SELECT;
            record.selection = arguments;
            return new GO.Clause.From(this);
        };

        /**
         * Do a update operation into the collection
         * @return {GO.Clause.From} from object
         */
        this.update = function () {
            record.type = GO.query.type.UPDATE;
            record.selection = GO.query.WILDCARD;
            return new GO.Clause.From(this);
        };

        /**
         * Do a delete operation into the collection
         * @returns {GO.Clause.From}
         */
        this.remove = function () {
            record.type = GO.query.type.DELETE;
            record.selection = arguments;
            return new GO.Clause.From(this);
        };
    };
}(GO));