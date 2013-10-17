/**
 * Do a 'from' into the query collection
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @constructor
 */
GO.Clause.From = function(query){
    var _query = query;

    /**
     * Method from to use in query record
     * @param {?Function} instanceType
     * @return {GO.Clause.Where}
     */
    this.from = function(instanceType){
        if(typeof instanceType == "undefined"){
            // Generic type of object
            instanceType = Object;
        }
        _query._setRecord("from", instanceType);
        return new GO.Clause.Where(_query);
    };
};