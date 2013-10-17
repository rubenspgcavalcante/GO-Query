/**
 * Object to register the order action
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-10-17
 * @param {String} attribute
 * @param {GO.order} order
 * @constructor
 */
GO.Clause.OrderBy = function(attribute, order){
    var _attribute = attribute;
    var _order = order

    /**
     * Gets the orderby value
     * @returns {{attribute: String, order: GO.order}}
     */
    this.val = function(){
        return {attribute: _attribute, order: _order};
    };
};