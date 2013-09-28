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
 * @param {String} attribute
 * @param {Number} operator (Use the {@link{GO.Query.op}} enum
 * @param {*} value
 * @constructor
 */
GO.Query.Filter = function(attribute, operator, value){
    this.attribute = attribute;
    this.operator = operator;
    this.value = value;

    /** @type {GO.Query.Filter}*/
    var parent = null;

    /** @type {Object<GO.Query.Filter>}*/
    var _chainFilters = {
        and: null,
        or: null,
        xor: null
    };

    /**
     * Creates a chain filter, based on the giving operation, returning it
     * @param {String} logicOp
     * @param {String} attribute
     * @param {Number} operator
     * @param {*} value
     * @returns {GO.Query.Filter}
     * @private
     */
    var _createChainFilter = function(logicOp, attribute, operator, value){
        for(var key in _chainFilters){
            if(key == logicOp){
                _chainFilters[i] = new GO.Query.Filter(attribute, operator, value);
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
     * @param {GO.Query.Filter} filter
     * @private
     */
    this._setParent = function(filter){
        parent = filter;
    };

    /**
     * Gets this filter parent
     * @returns {?GO.Query.Filter}
     */
    this.parent = function(){
        return parent;
    };

    /**
     * Gets this filter child
     * @returns {?GO.Query.Filter}
     */
    this.child = function(){
        return _chainFilters.and || _chainFilters.or || _chainFilters.xor;
    };

    /**
     * Gets to the root filter
     * @returns {?GO.Query.Filter}
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
        return typeof this.attribute == null &&
               typeof this.operator == null &&
               typeof this.value == null;
    };

    /**
     * Chains a or filter
     * @param {String} attribute
     * @param {Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {*} value
     * @returns {GO.Query.Filter}
     */
    this.and = function(attribute, operator, value){
        return _createChainFilter("and", attribute, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String} attribute
     * @param {Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {*} value
     * @returns {GO.Query.Filter}
     */
    this.or = function(attribute, operator, value){
        return _createChainFilter("or", attribute, operator, value);
    };

    /**
     * Chains a or filter
     * @param {String} attribute
     * @param {Number} operator (Use the {@link{GO.Query.op}} enum
     * @param {*} value
     * @returns {GO.Query.Filter}
     */
    this.xor = function(attribute, operator, value){
        return _createChainFilter("xor", attribute, operator, value);
    };
};

/**
 * Creates a query object
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
 *
 * @param {GO.Query} query
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
     * @param {GO.Query.Filter} filter
     * @returns {Boolean}
     * @throws {Error}
     * @private
     */
    var _applyFilter = function(obj, filter){
        var approved = false;
        var value = _deepAttribute(obj, filter.attribute);

        switch (filter.operator){
            case GO.op.EQ:
                if(value == filter.value){
                    approved = true;
                }
                break;
            case GO.op.NEQ:
                if(value != filter.value){
                    approved = true;
                }
                break;

            case GO.op.GTE:
                if(value >= filter.value){
                    approved = true;
                }
                break;

            case GO.op.MTE:
                if(value <= filter.value){
                    approved = true;
                }
                break;

            case GO.op.GT:
                if(value > filter.value){
                    approved = true;
                }
                break;

            case GO.op.MT:
                if(value < filter.value){
                    approved = true;
                }
                break;

            case GO.op.LIKE:
                if(filter.value instanceof RegExp){
                    if(filter.value.test(value)){
                        approved = true;
                    }
                }
                break;

            case GO.op.HAS:
                if(value instanceof Array){
                    for(var i in value){
                        if(filter.value == value[i]){
                            approved = true;
                            break;
                        }
                    }
                }
                break;

            case GO.op.TAUTOLOGICAL:
                approved = true;
                break;

            case GO.op.CONTRADICTORY:
                approved = false;
                break;

            default:
                throw Error("Operator " + filter.operator + " doesn't exists");
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
 * Controls the where closure into the query
 * Builds itself based on the parent operation (SELECT, UPDATE, DELETE)
 * @param {GO.Query} query
 * @constructor
 */
GO.Core.Where = function(query){
    var _query = query;
    query._setRecord("where", this);

    /** @type {GO.Query.Filter} */
    this.filter = null;
    /**
     * Where function, apply a filter to the query
     * @param {GO.Query.Filter} filter
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
