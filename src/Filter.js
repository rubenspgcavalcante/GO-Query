(function (GO) {
    /**
     * @name GO.Filter~FilterFunction
     * @function
     * @param {*} filterValue The value used in the filter
     * @param {*} currentValue The value used to compare with the filter
     * @returns boolean
     */
    // ===================================================================================== //

    /**
     * Creates a filter to apply into the query
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-09-28
     * @param {String|GO.Filter} [attrOrFilter] The object attribute name or a associative filter
     * @param {GO.op|GO.Filter~FilterFunction} [operator] The logic operator to use
     * @param {*} [value] The value to compare
     * @example
     * new GO.Filter("locale.lang", Go.op.EQ, "pt-br")
     * @constructor
     */
    GO.Filter = function (attrOrFilter, operator, value) {
        var that = this;
        if (attrOrFilter instanceof GO.Filter) {
            /** @type GO.Filter */
            this.associate = attrOrFilter || null;
        }
        else {
            this.attribute = attrOrFilter || null;
            this.operator = operator || GO.op.TAUTOLOGICAL;
            this.value = value || null;
        }

        /** @type {GO.Filter}*/
        var predecessor = null;

        /** @type {GO.Core.FilterChain}*/
        var filterChain = null;

        /**
         * Sets a predecessor filter to this filter
         * @param {GO.Filter} filter
         * @private
         */
        this._setPredecessor = function (filter) {
            predecessor = filter;
        };

        /**
         * Gets the filter chain of this filter
         * @return {GO.Core.FilterChain}
         */
        this._getFilterChain = function () {
            return filterChain;
        };

        /**
         * Gets this predecessor filter
         * @returns {?GO.Filter}
         */
        this.back = function () {
            return predecessor;
        };

        /**
         * Gets the next filter linked
         * @returns {?GO.Filter}
         */
        this.next = function () {
            return filterChain.link;
        };

        /**
         * Gets to the root filter in the linked list
         * @returns {?GO.Filter}
         */
        this.root = function () {
            var root = this;
            while (root.back() != null) {
                root = root.back();
            }
            return root;
        };

        /**
         * Verify if the filter is empty
         * @return {Boolean}
         */
        this.isEmpty = function () {
            if (this.hasOwnProperty("associate")) {
                return this.associate == null;
            }
            else {
                return this.attribute == null &&
                    this.value == null;
            }
        };

        /**
         * Post constructor init
         * @param {String|GO.Filter} attrOrFilter
         * @param {GO.op} operator
         * @param {*} value
         */
        this.init = function (attrOrFilter, operator, value) {
            if (attrOrFilter instanceof GO.Filter) {
                this.associate = attrOrFilter;
            }
            else {
                this.attribute = attrOrFilter;
                this.operator = operator;
                this.value = value;
            }
        };

        /**
         * Chains a "and" filter
         * @param {String|GO.Filter} attrOrFilter
         * @param {GO.op | GO.Filter~FilterFunction} operator
         * @param {*} value
         * @returns {GO.Filter}
         */
        this.and = function (attrOrFilter, operator, value) {
            var filter = new GO.Filter(attrOrFilter, operator, value);
            filter._setPredecessor(this);
            filterChain = new GO.Core.FilterChain(GO.query.logic_op.AND, filter);
            return filter
        };

        /**
         * Chains a or filter
         * @param {String|GO.Filter} attrOrFilter
         * @param {GO.op | GO.Filter~FilterFunction} operator
         * @param {?*} value
         * @returns {GO.Filter}
         */
        this.or = function (attrOrFilter, operator, value) {
            var filter = new GO.Filter(attrOrFilter, operator, value);
            filter._setPredecessor(this);
            filterChain = new GO.Core.FilterChain(GO.query.logic_op.OR, filter);
            return filter
        };

        /**
         * Chains a or filter
         * @param {String|GO.Filter} attrOrFilter
         * @param {GO.op | GO.Filter~FilterFunction} operator
         * @param {?*} value
         * @returns {GO.Filter}
         */
        this.xor = function (attrOrFilter, operator, value) {
            var filter = new GO.Filter(attrOrFilter, operator, value);
            filter._setPredecessor(this);
            filterChain = new GO.Core.FilterChain(GO.query.logic_op.XOR, filter);
            return filter
        };
    };
}(GO));
