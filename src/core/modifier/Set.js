(function (GO) {
    /**
     * Set Clause
     * @param {GO.Core.Record} record
     * @extends {GO.Core.Modifier.PostProcess}
     * @constructor
     */
    GO.Core.Modifier.Set = function (record) {
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
        this.init = function (attrAndVals) {
            targets = attrAndVals;
            return that._processor;
        };

        /**
         * Modify the result of a query,
         * setting it the registered values
         * @param {Object[]} objects
         */
        this.modify = function (objects) {
            for (var i = 0; i < objects.length; i++) {
                for (var key in targets) {
                    if(targets.hasOwnProperty(key)){
                        GO.Utils.ObjectUtils.deepSet(key, objects[i], targets[key]);
                    }
                }
            }
        };
    };

    GO.Core.Modifier.Set.prototype = new GO.Core.Modifier.PostProcess("Set");

}(GO));
