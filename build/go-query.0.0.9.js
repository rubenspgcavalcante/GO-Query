/**
 * GO Query global namespace
 * @global
 * @namespace
 */
GO = {};

/**
 * Core objects namespace
 * @namespace
 */
GO.Core = {};

/**
 * Custom error objects namespace
 * @namespace
 */
GO.Error = {};

/**
 * Query env namespace
 * @namespace
 */
GO.query = {};

/**
 * Describes the query types
 * @readonly
 * @enum {Number}
 */
GO.query.type = {
    SELECT: 0,
    DELETE: 1,
    UPDATE: 2
};

/**
 * @constant {String}
 * @default
 */
GO.query.WILDCARD = "*";

/**
 * Describes the query operators
 * @readonly
 * @enum {Number}
 */
GO.op = {
    TAUTOLOGICAL: 0,
    CONTRADICTORY: 1,
    EQ: 2,
    NEQ: 3,
    GT: 4,
    GTE: 5,
    MT: 6,
    MTE: 7,
    LIKE: 8,
    HAS: 9
};

/**
 * Describes the order types
 * @readonly
 * @enum {Number}
 */
GO.order = {
    ASC: 0,
    DESC: 1
};
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
    var parent = null;

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
            if(key == logicOp){
                _chainFilters[i] = new GO.Filter(attrOrFilter, operator, value);
                _chainFilters[i]._setParent(this);
            }
            else{
                _chainFilters[i] = null;
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
        parent = filter;
    };

    /**
     * Gets this filter parent
     * @returns {?GO.Filter}
     */
    this.parent = function(){
        return parent;
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
        var root = null;
        while(this.parent() != null){
            root = this.parent();
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
        return _createChainFilter("and", attribute, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String|GO.Filter} attrOrFilter
     * @param {?Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {?*} value
     * @returns {GO.Filter}
     */
    this.or = function(attrOrFilter, operator, value){
        return _createChainFilter("or", attribute, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String|GO.Filter} attrOrFilter
     * @param {?Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {?*} value
     * @returns {GO.Filter}
     */
    this.xor = function(attrOrFilter, operator, value){
        return _createChainFilter("xor", attribute, operator, value);
    };
};

/**
 * Creates a query object
 * @author Rubens Pinheior Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {Object[]} collection
 * @constructor
 */
GO.Query = function(collection){
    this.collection  = collection;

    /**
     * Internal data to control the query
     * @namespace
     * @property {Number} type The query type (User {@link{GO.Query.type}} enum)
     * @property {String[]} selection
     * @property {GO.Core.From} from Object to register 'from' call into the query
     * @property {GO.Core.Where} where
     */
    var record = {
        type: null,
        selection: null,
        from: null,
        where: null,
        updateTo: [],
        orderby: null
    };

    /**
     * Returns the internal record data
     * @returns {{type: null, selection: null, from: null, where: null, updateTo: Array, orderby: null}}
     */
    this._getRecord = function(){
        return record;
    };

    /**
     * Sets a value into the selected record key
     * @param {String} key
     * @param {*} value
     */
    this._setRecord = function(key, value){
        record[key] = value;
    };

    //noinspection JSCommentMatchesSignature
    /**
     * Do a select operation into the collection
     * @param {...String}
     * @return {GO.Core.From} from object
     */
    this.select = function(){
        record.type = GO.query.type.SELECT;
        record.selection = arguments;
        return new GO.Query._From(this);
    };

    /**
     * Do a update operation into the collection
     * @return {GO.Core.From} from object
     */
    this.update = function(){
        record.type = GO.query.type.UPDATE;
        return new GO.Query._From(this);
    };

    /**
     * Do a delete operation into the collection
     * @returns {GO.Core.From}
     */
    this.remove = function(){
        record.type = GO.query.type.DELETE;
        record.selection = arguments;
        return new GO.Query._From(this);
    };
};
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
/**
 * Do the dirty work. Process the query based
 * on his record of operations and filters.
 * @author Rubens Pinheior Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @constructor
 */
GO.Core.Processor = function(query){
    var _query = query;

    //==================================================//
    //                    Private methods               //
    //==================================================//

    /**
     * Search the attribute value in inner objects
     * and return/set the value
     * @param {Object} obj
     * @param {String} attribute
     * @param {*} [operation={GO.query.type.SELECT}]
     * @param {*} [updateVal] Used if the operation is update
     * @return {?*}
     * @private
     */
    var _deepAttribute = function(obj, attribute, operation, updateVal){
        var index = attribute.indexOf('.');
        var value = null;
        operation = operation || GO.query.type.SELECT;

        if(index != -1){
            var upperKey = attribute.slice(0, index);
            attribute = attribute.slice(index + 1);
            value = obj[upperKey] || null;
        }
        else{
            value = obj[attribute] || null;
        }

        //Exists other points? e.g. customer.creditcard.brand
        if(attribute.indexOf('.') != -1 && value != null){
            return _deepSearchAttribute(value, attribute);
        }

        else{
            switch(operation){
                case GO.query.type.SELECT:
                    return value;

                case GO.query.type.UPDATE:
                    obj[attribute] = updateVal;
                    break;

                case GO.query.type.DELETE:
                    delete obj[attribute];
                    break;
            }
        }
        return null;
    };

    /**
     * Applies the given filter, and verify if the value
     * has passed on the filter
     * @param {Object} obj
     * @param {GO.Filter} filter
     * @returns {Boolean}
     * @throws {Error}
     * @private
     */
    var _applyFilter = function(obj, filter){
        var approved = false;
        var value = _deepAttribute(obj, filter.attribute);

        if(filter.hasOwnProperty("associate")){
            approved = _applyFilter(obj, filter.associate);
        }
        else{
            approved = new GO.Core.Validator(filter, value).test();
        }

        if(approved){
            if(filter.child() != null){
                return _applyFilter(obj, filter.child());
            }
            return true;
        }
        return false;
    };

    /**
     * Apply the user selection to the collection
     * Can get inner attributes too, e.g.: user.vehicle.brand
     * @param {Object} obj
     * @param {String} attr
     * @return {Object}
     * @private
     */
    var _selectInObject = function(obj, attr){
        var copy = {};
        var index = attr.indexOf(".");

        if(attr == GO.query.WILDCARD){
            copy = JSON.parse(JSON.stringify(obj));
        }

        else if(index == -1){
            if(typeof obj[attr] == "object"){
                copy[attr] = JSON.parse(JSON.stringify(obj[attr]));
            }
            else{
                copy[attr] = obj[attr];
            }
        }

        else{
            var upperKey = attr.slice(0, index);
            attr = attr.slice(index + 1);
            copy[upperKey] = obj[upperKey] || null;

            if(attr.indexOf(".") != -1){
                copy[upperKey] = _selectInObject(copy[upperKey], attr);
            }
            else if(typeof copy[upperKey] == "object"){
                copy = JSON.parse(JSON.stringify(copy));
            }
        }
        return copy;
    };

    /**
     * Merges two objects
     * @param {Object} obj1
     * @param {Object} obj2
     * @private
     */
    var _merge = function(obj1, obj2){
        for(var i in obj2){
            if(obj2.hasOwnProperty(i)){
                obj1[i] = obj2[i];
            }
        }
    };

    /**
     * Applies the selection to the result filtered collection
     * @param values
     * @returns {Object[]}
     * @private
     */
    var _applySelection = function(values){
        var results = [];
        var attributes = _query._getRecord().selection;
        if(attributes.length == 0){
            attributes = [GO.query.WILDCARD];
        }

        for(var i in values){
            var copy = {};
            for(var j in attributes){
                _merge(copy, _selectInObject(values[i], attributes[j]));
            }
            results.push(copy);
        }

        return results;
    };

    /**
     * Verify if the collection values pass in the filter
     * and if does, execute a callback passing the value
     * @param {Function} callback
     * @private
     */
    var _processFilter = function(callback){
        for(var i in _query.collection){
            var currentObj = _query.collection[i];
            if(currentObj instanceof _query._getRecord().from){
                if(_applyFilter(currentObj, _query._getRecord().where.filter)){
                    callback(currentObj);
                }
            }
        }
    };

    /**
     * Executes a Select operation into the collection
     * @returns {Object[]}
     * @private
     */
    var _execSelect = function(){
        var results = [];
        _processFilter(function(currentObj){
            results.push(currentObj);
        });

        return _applySelection(results);
    };

    /**
     * Executes a Update operation into the collection
     * @private
     */
    var _execUpdate = function(){
        _processFilter(function(currentObj){
            var selections = _query._getRecord().selection;
            var updateVals = _query._getRecord().updateTo;

            for(var i in selections){
                _deepAttribute(currentObj, selections[i], GO.query.type.UPDATE, updateVals[i]);
            }
        });
    };

    /**
     * Executes a Delete operation into the collection
     * @private
     */
    var _execDelete = function(){
        _processFilter(function(currentObj){
            var selections = _query._getRecord().selection;
            for(var i in selections){
                _deepAttribute(currentObj, selections[i], GO.query.type.DELETE);
            }
        });
    };

    //==================================================//
    //                    Public methods                //
    //==================================================//
    /**
     * Executes the query
     * returning the processed array
     * @return {*}
     */
    this.run = function(){
        switch(_query._getRecord().type){
            case GO.query.type.SELECT:
                return _execSelect();

            case GO.query.type.UPDATE:
                return _execUpdate();

            case  GO.query.type.DELETE:
                return _execDelete();

            default:
                return null;
        }
    };
};

/**
 * Validates the value based on the given filter
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-09-30
 * @param {GO.Filter} filter
 * @param {*} value
 * @constructor
 */
GO.Core.Validator = function(filter, value){
    var that = this;
    this.filter = filter;
    this.value = value;

    /**
     * Digests the HAS operator
     * @returns {boolean}
     * @private
     */
    var _hasDigest = function(){
        if(that.value instanceof Array){
            for(var i in that.value){
                if(that.filter.value == that.value[i]){
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
    this.test = function(){
        switch (this.filter.operator){
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

/**
 * Controls the where closure into the query
 * Builds itself based on the parent operation (SELECT, UPDATE, DELETE)
 * @author Rubens Pinheior Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @constructor
 */
GO.Core.Where = function(query){
    var _query = query;
    query._setRecord("where", this);

    /** @type {GO.Filter} */
    this.filter = null;

    /**
     * Where function, apply a filter to the query
     * @param {GO.Filter} filter
     * @return {GO.Core.Processor}
     */
    this.where = function(filter){
        this.filter = filter;

        switch(_query._getRecord().type){
            case GO.query.type.SELECT:
                /**
                 * Orders the result array
                 * @param {String} attr
                 * @param {Number} order (Use {@link{GO.query.order}})
                 */
                this.orderBy = function(attr, order){
                    _query._setRecord("orderby", {attribute: attr, order: order});
                };
                break;

            case GO.query.type.UPDATE:
                //noinspection JSCommentMatchesSignature
                /**
                 * Registers the set method
                 * @param {...*}
                 */
                this.set = function(){
                    _query._setRecord('updateTo', arguments);
                };
                break;
        }

        return new GO.Core.Processor(_query);
    };
};

/**
 * Operator error
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-09-30
 * @param {String} msg
 * @param {*} data
 * @constructor
 */
GO.Error.OperatorError = function(msg, data){
    this.name =  "OperatorError";
    this.message = msg;
    this.data = data || null;
};

GO.Error.OperatorError.prototype = new Error();
GO.Error.OperatorError.constructor = GO.Error.OperatorError;