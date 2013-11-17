/**
 * Controls the where closure into the query
 * Builds itself based on the parent operation (SELECT, UPDATE, DELETE)
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @constructor
 */
GO.Clause.Where = function(query){
    var that = this;
    var _query = query;
    query._setRecord("where", this);

    /** @type {GO.Filter} */
    this.filter = null;

    /**
     * Register to the prototype of the this object
     * all the modifiers. Note that 'init' method of
     * all modifiers return the back reference to this object instance.
     * @private
     */
    var _setAvailableModifiers = function(){
        var record = _query._getRecord();
        switch(record.type){
            case GO.query.type.SELECT:
                var orderBy = new GO.Core.Modifier.OrderBy(record);
                that.orderBy = orderBy.init;
                break;

            case GO.query.type.UPDATE:
                var set = new GO.Core.Modifier.Set(record);
                that.set = set.init;
                break;
        }
    };

    /**
     * Where function, apply a filter to the query
     * @param {GO.Filter} filter
     * @return {GO.Core.Processor}
     */
    this.where = function(filter){
        this.filter = filter.root();
        _setAvailableModifiers();

        return new GO.Core.Processor(_query);
    };
};
