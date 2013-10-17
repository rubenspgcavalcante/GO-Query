/**
 * Creates a filter to apply into the query
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {String|GO.Filter} attrOrFilter
 * @param {?Number} operator (Use the {@link{GO.Query.op}} enum
 * @param {?*} value
 * @constructor
 */
GO.Filter = function(attrOrFilter, operator, value){
    var that = this;
    if(attrOrFilter instanceof GO.Filter){
        /** @type GO.Filter */
        this.associate = attrOrFilter || null;
    }
    else{
        this.attribute = attrOrFilter || null;
        this.operator = operator || null;
        this.value = value || null;
    }

    /** @type {GO.Filter}*/
    var parentFilter = null;

    /** @type {Object<GO.Filter>}*/
    var _chainFilters = {
        and: null,
        or: null,
        xor: null
    };

    /**
     * Creates a chain filter, based on the giving operation, returning it
     * @param {String} logicOp
     * @param {String|GO.Filter} attrOrFilter
     * @param {?Number} operator
     * @param {?*} value
     * @returns {GO.Filter}
     * @private
     */
    var _createChainFilter = function(logicOp, attrOrFilter, operator, value){
        //Add the filter to the right operator and cleans the others
        for(var key in _chainFilters){
            if(_chainFilters.hasOwnProperty(key)){
                if(key == logicOp){
                    _chainFilters[key] = new GO.Filter(attrOrFilter, operator, value);
                    _chainFilters[key]._setParent(that);
                }
                else{
                    _chainFilters[key] = null;
                }
            }
        }
        return _chainFilters[logicOp];
    };

    /**
     * Sets a parent filter to this filter
     * @param {GO.Filter} filter
     * @private
     */
    this._setParent = function(filter){
        parentFilter = filter;
    };

    /**
     * Gets this filter parent
     * @returns {?GO.Filter}
     */
    this.parent = function(){
        return parentFilter;
    };

    /**
     * Gets this filter child
     * @returns {?GO.Filter}
     */
    this.child = function(){
        return _chainFilters.and || _chainFilters.or || _chainFilters.xor;
    };

    /**
     * Gets to the root filter
     * @returns {?GO.Filter}
     */
    this.root = function(){
        var root = this;
        while(root.parent() != null){
            root = root.parent();
        }
        return root;
    };

    /**
     * Verify if the filter is empty
     * @return {Boolean}
     */
    this.isEmpty = function(){
        if(this.hasOwnProperty("associate")){
            return this.associate == null;
        }
        else{
            return typeof this.attribute == null &&
                   typeof this.operator == null &&
                   typeof this.value == null;
        }
    };

    /**
     * Chains a or filter
     * @param {String|GO.Filter} attrOrFilter
     * @param {?Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {?*} value
     * @returns {GO.Filter}
     */
    this.and = function(attrOrFilter, operator, value){
        return _createChainFilter("and", attrOrFilter, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String|GO.Filter} attrOrFilter
     * @param {?Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {?*} value
     * @returns {GO.Filter}
     */
    this.or = function(attrOrFilter, operator, value){
        return _createChainFilter("or", attrOrFilter, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String|GO.Filter} attrOrFilter
     * @param {?Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {?*} value
     * @returns {GO.Filter}
     */
    this.xor = function(attrOrFilter, operator, value){
        return _createChainFilter("xor", attrOrFilter, operator, value);
    };
};
