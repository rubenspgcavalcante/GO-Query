/**
 * Do a 'from' into the query collection
 * @author Rubens Pinheior Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @constructor
 */
GO.Core.From = function(query){
    var _query = query;

    /**
     * Method from to use in query record
     * @param {?*} instanceType
     * @return {GO.Core.Where}
     */
    this.from = function(instanceType){
        if(typeof instanceType == "undefined"){
            // Generic type of object
            instanceType = Object;
        }
        _query._setRecord("from", instanceType);
        return new GO.Core.Where(_query);
    };
};