(function (GO) {
    /**
     * Validates the value based on the given filter
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-09-30
     * @param {GO.Filter} filter
     * @param {*} value
     * @constructor
     */
    GO.Core.Validator = function (filter, value) {
        var that = this;
        this.filter = filter;
        this.value = value;

        /**
         * Digests the HAS operator
         * @returns {Boolean}
         * @private
         */
        var _hasDigest = function () {
            if (that.value instanceof Array) {
                for (var i in that.value) {
                    if (that.filter.value == that.value[i]) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Test the filter/value and verify the validity
         * @throws {GO.Error.OperatorError}
         * @returns {Boolean}
         */
        this.test = function () {
            switch (this.filter.operator) {
                case GO.op.EQ:
                    return this.value == this.filter.value;

                case GO.op.NEQ:
                    return this.value != this.filter.value;

                case GO.op.GTE:
                    return this.value >= this.filter.value;

                case GO.op.MTE:
                    return this.value <= this.filter.value;

                case GO.op.GT:
                    return this.value > this.filter.value;

                case GO.op.MT:
                    return this.value < this.filter.value;

                case GO.op.LIKE:
                    return this.filter.value instanceof RegExp && this.filter.value.test(this.value);

                case GO.op.HAS:
                    return _hasDigest();

                case GO.op.TAUTOLOGICAL:
                    return true;

                case GO.op.CONTRADICTORY:
                    return false;

                default:
                    throw new GO.Error.OperatorError("Operator doesn't exist", this.filter);
            }
        };
    };
}(GO));
