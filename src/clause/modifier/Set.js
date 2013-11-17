/**
 * Set Clause
 * @constructor
 * @augments GO.Core.Modifier.PostProcess
 * @param {GO.Core.Record} record
 */
GO.Core.Modifier.Set = function(record){
    record.modifiers.push(this);

    /** @type {Object} */
    var targets = null;

    /**
     * Sets the internal data
     * @param {Object} attrAndVals
     * @return {GO.Clause.Where}
     */
    this.init = function(attrAndVals){
        targets = attrAndVals;
        return this._whereRef;
    };

    /**
     * Modify the result of a query,
     * sorting it into the given order
     */
    this.modify = function(){
        //TODO implement set
    };
};

GO.Core.Modifier.Set.prototype = new GO.Core.Modifier.PostProcess("Set");
GO.Core.Modifier.Set.constructor = GO.Core.Modifier.Set;

