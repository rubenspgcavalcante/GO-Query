/**
 * Controls the where closure into the query
 * Builds itself based on the parent operation (SELECT, UPDATE, DELETE)
 * @author Rubens Pinheior Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @constructor
 */
GO.Core.Where = function(query){
    var _query = query;
    query._setRecord("where", this);

    /** @type {GO.Filter} */
    this.filter = null;

    /**
     * Where function, apply a filter to the query
     * @param {GO.Filter} filter
     * @return {GO.Core.Processor}
     */
    this.where = function(filter){
        this.filter = filter;

        switch(_query._getRecord().type){
            case GO.query.type.SELECT:
                /**
                 * Orders the result array
                 * @param {String} attr
                 * @param {Number} order (Use {@link{GO.query.order}})
                 */
                this.orderBy = function(attr, order){
                    _query._setRecord("orderby", {attribute: attr, order: order});
                };
                break;

            case GO.query.type.UPDATE:
                //noinspection JSCommentMatchesSignature
                /**
                 * Registers the set method
                 * @param {...*}
                 */
                this.set = function(){
                    _query._setRecord('updateTo', arguments);
                };
                break;
        }

        return new GO.Core.Processor(_query);
    };
};
