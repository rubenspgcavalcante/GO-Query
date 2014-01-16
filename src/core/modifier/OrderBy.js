/**
 * OrderBy Clause
 * @constructor
 * @augments GO.Core.Modifier.PostProcess
 * @param {GO.Core.Record} record
 */
GO.Core.Modifier.OrderBy = function(record){
    record.modifiers.push(this);

    /** @type {String} */
    var targetAttr = null;

    /** @type {GO.order} */
    var orderType = null;
    var that = this;

    /**
     * Sets the internal data
     * @param {String} attr
     * @param {GO.order} order
     * @return {GO.Core.Processor}
     */
    this.init = function(attr, order){
        targetAttr = attr;
        orderType = order;
        return that._processor
    };

    /**
     * Modify the result of a query,
     * sorting it into the given order
     */
    this.modify = function(objects){
        //TODO implement sort
    };
};

GO.Core.Modifier.OrderBy.prototype = new GO.Core.Modifier.PostProcess("OrderBy");
GO.Core.Modifier.OrderBy.constructor = GO.Core.Modifier.OrderBy;
