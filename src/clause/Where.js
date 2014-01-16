/**
 * Controls the where closure into the query
 * Builds itself based on the parent operation (SELECT, UPDATE, DELETE)
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @constructor
 */
GO.Clause.Where = function(query){
    var _query = query;
    query._setRecord("where", this);

    /**
     * @type {Object.<String, GO.Core.Modifier.PostProcess>}
     * @private
     */
    var _modifierMethods = {};

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
                _modifierMethods.orderBy = new GO.Core.Modifier.OrderBy(record);
                break;

            case GO.query.type.UPDATE:
                _modifierMethods.set = new GO.Core.Modifier.Set(record);
                break;
        }
    };

    /**
     * Where function, apply a filter to the query
     * @param {GO.Filter} [filter] If not given, use tautological filter
     * @return {GO.Core.Processor}
     */
    this.where = function(filter){
        filter = filter || new GO.Filter('', GO.op.TAUTOLOGICAL, '');

        this.filter = filter.root();
        _setAvailableModifiers();

        return new GO.Core.Processor(_query, _modifierMethods);
    };
};
