/**
 * Set Clause
 * @constructor
 * @augments {GO.Core.Modifier.PostProcess}
 * @param {GO.Core.Record} record
 */
GO.Core.Modifier.Set = function(record){
    record.modifiers.push(this);

    /** @type {Object} */
    var targets = null;
    var that = this;

    /**
     * Sets the internal data
     * @param {Object} attrAndVals The set of attributes and
     * values to update
     *
     * @return {GO.Core.Processor}
     */
    this.init = function(attrAndVals){
        targets = attrAndVals;
        return that._processor;
    };

    /**
     * Modify the result of a query,
     * sorting it into the given order
     * @param {Object[]} objects
     */
    this.modify = function(objects){
        for(var i=0; i < objects.length; i++){
            for(var j in targets){
                if(objects[i].hasOwnProperty(j)){
                    objects[i][j] = targets[j];
                }
            }
        }
    };
};

GO.Core.Modifier.Set.prototype = new GO.Core.Modifier.PostProcess("Set");

