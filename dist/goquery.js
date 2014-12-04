// Uses CommonJS, AMD or browser globals to create a module. This example
// creates a global even when AMD is used. This is useful if you have some
// scripts that are loaded by an AMD loader, but they still want access to
// globals. If you do not need to export a global for the AMD case, see
// commonjsStrict.js.

// If you just want to support Node, or other CommonJS-like environments that
// support module.exports, and you are not creating a module that has a
// circular dependency, then see returnExportsGlobal.js instead. It will allow
// you to export a function as the module value.

// Defines a module "commonJsStrictGlobal" that depends another module called
// "b". Note that the name of the module is implied by the file name. It is
// best if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], function (exports) {
            factory((root.GO = exports));
        });
    } else if (typeof GO === 'object') {
        // CommonJS
        factory(module);
    } else {
        // Browser globals
        factory((root.GO = {}));
    }
}(this, function (GO) {
    'use strict';
    /**
     * GO Query global namespace
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @global
     * @namespace GO
     * @alias GO
     */

    /**
     * Clause objects namespace
     * @namespace
     */
    GO.Clause = {};

    /**
     * Core objects namespace
     * [Warning] Only used internally by the lib
     * @namespace
     */
    GO.Core = {};

    /**
     * Query result modifiers namespace
     * @namespace
     */
    GO.Core.Modifier = {};

    /**
     * Helper functions
     * @namespace
     */
    GO.Core.Helpers = {};

    /**
     * Custom error objects namespace
     * @namespace
     */
    GO.Error = {};

    /**
     * Utils libraries
     * @namespace
     */
    GO.Utils = {};

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
     * Describes the logic operator available
     * @readonly
     * @enum {Number}
     */
    GO.query.logic_op = {
        AND: 0,
        OR: 1,
        XOR: 2
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
     * Describes the three values of
     * a sort function which references the
     * first value compared with the second value
     * @enum {Number}
     */
    GO.comparison = {
        GREATER: 1,
        EQUALS: 0,
        LESSER: -1
    };

    /*=========================*/
    /*   Callback definitions  */
    /*=========================*/

    /**
     * Callbacks defines
     * @name GO.Callback
     * @namespace
     */

    /**
     * Sorter callback
     * @name GO.Callback.SorterCallback
     * @callback SorterCallback
     * @param {*} a
     * @param {*} b
     * @return {GO.comparison}
     */
(function(GO) {
    /**
     * Creates a query object
     * @author Rubens Pinheior Gonçalves Cavalcante
     * @since 2013-09-28
     * @param {Object[]} collection A array of objects of any type
     * @extends {Array}
     * @constructor
     */
    GO.Query = function Query(collection) {

        /** @type {GO.Core.Record} */
        var record = new GO.Core.Record();

        /**
         * Returns the internal record data
         * @returns {GO.Core.Record}
         */
        this._getRecord = function () {
            return record;
        };

        /**
         * Sets a value into the selected record key
         * @param {String} key
         * @param {*} value
         */
        this._setRecord = function (key, value) {
            if (record[key] instanceof Array) {
                record[key].push(value);
            }
            else {
                record[key] = value;
            }
        };

        //noinspection JSCommentMatchesSignature
        /**
         * Do a select operation into the collection
         * @param {...String}
         * @return {GO.Clause.From} from object
         */
        this.select = function () {
            record.type = GO.query.type.SELECT;
            record.selection = arguments;
            return new GO.Clause.From(this);
        };

        /**
         * Do a update operation into the collection
         * @return {GO.Clause.From} from object
         */
        this.update = function () {
            record.type = GO.query.type.UPDATE;
            record.selection = GO.query.WILDCARD;
            return new GO.Clause.From(this);
        };

        /**
         * Do a delete operation into the collection
         * @returns {GO.Clause.From}
         */
        this.remove = function () {
            record.type = GO.query.type.DELETE;
            record.selection = arguments;
            return new GO.Clause.From(this);
        };

        /**
         * Clear the internal data
         * @returns {GO.Query}
         */
        this.clear = function(){
            this.splice(0, this.length);
            return this;
        };

        /**
         * Sets a array of data to the query
         * @param {Array} data
         * @returns {GO.Query}
         */
        this.setData = function(data){
            data = data || [];
            this.clear();
            for(var i= 0, l=data.length; i < l; i++){
                this.push(data[i]);
            }
            return this;
        };

        /**
         * Clear the internal active record
         * @returns {GO.Query}
         */
        this.clearRecord = function(){
            record = new GO.Query.Record();
            return this;
        };


        /*
         * Constructs the object Query
         */
        (function init(itself, data){
            itself.setData(data);

        }(this, collection));
    };

    GO.Query.prototype = [];
}(GO));
(function (GO) {
    /**
     * Creates a filter to apply into the query
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-09-28
     * @param {String|GO.Filter} [attrOrFilter] The object attribute name or a associative filter
     * @param {GO.op} [operator] The logic operator to use
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
         * @param {GO.op} operator
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
         * @param {GO.op} operator (Use the {@link{GO.Query.op}} enum
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
         * @param {GO.op} operator (Use the {@link{GO.Query.op}} enum
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

(function (GO) {
    /**
     * Object clonning error
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-11-17
     * @param {Object} [object]
     * @augments Error
     */
    GO.Error.CloneError = function (object) {
        this.name = "CloneError";
        this.message = "Object couldn't be cloned. One or more inner attributes types are not supported";
        this.data = object || null;
    };

    GO.Error.CloneError.prototype = new Error();

}(GO));

(function (GO) {
    /**
     * Not implemented error
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-11-16
     * @param {String} methodName
     * @param {Function} [constructor]
     * @augments Error
     */
    GO.Error.NotImplementedError = function (methodName, constructor) {
        this.name = "NotImplementedError";
        this.message = "Constructor must implement " + methodName;
        this.data = constructor || null;
    };

    GO.Error.NotImplementedError.prototype = new Error();
}(GO));

(function (GO) {
    /**
     * Operator error
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-09-30
     * @param {String} msg
     * @param {*} [data]
     * @augments Error
     */
    GO.Error.OperatorError = function (msg, data) {
        this.name = "OperatorError";
        this.message = msg;
        this.data = data || null;
    };

    GO.Error.OperatorError.prototype = new Error();
}(GO));

(function (GO) {
    /**
     * Object property is not defined
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2014-01-20
     * @param property
     * @param object
     * @augments Error
     */
    GO.Error.PropertyNotDefinedError = function (property, object) {
        this.msg = "Property " + property + " is not defined";
        this.data = object;
    };

    GO.Error.PropertyNotDefinedError.prototype = new Error();
}(GO));

(function (GO) {
    /**
     * Query method error
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-10-17
     * @param {String} msg
     * @param {*} [data]
     * @augments Error
     */
    GO.Error.QueryMethodError = function (msg, data) {
        this.name = "QueryMethodError";
        this.message = msg;
        this.data = data || null;
    };

    GO.Error.QueryMethodError.prototype = new Error();
}(GO));

(function (GO) {
    /**
     * Object utils functions
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 20-01-2014
     * @module
     */
    GO.Utils.ObjectUtils = {
        /**
         * Gets the attribute of a object using
         * the given attribute as referenced (chained by dots)
         * @param {String} attribute Attribute to search
         * @param {Object} obj The object to search into
         * @param {Boolean} [remove=false] Select or remove the attribute
         * @param {*} [valToSet] If given, sets the value to the property
         * @return {*}
         * @throws {GO.Error.PropertyNotDefinedError}
         * @example
         * //Remove the 'name' key from the object brand
         * GO.Utils.ObjectUtils._deepSearch("creditcard.brand.name", customer, true);
         * @private
         */
        _deepSearch: function (attribute, obj, remove, valToSet) {
            if (attribute == null) {
                return null;
            }

            var index = attribute.indexOf('.');
            var value = null;

            if (index != -1) {
                var upperKey = attribute.slice(0, index);
                attribute = attribute.slice(index + 1);
                if (obj.hasOwnProperty(upperKey)) {
                    value = obj[upperKey] || null;
                }

                else {
                    throw new GO.Error.PropertyNotDefinedError(upperKey, obj);
                }
            }
            else {
                value = obj;
            }

            //Exists other points? e.g. customer.creditcard.brand
            if (attribute.indexOf('.') != -1 && value != null) {
                return this._deepSearch(value, attribute, remove);
            }

            else if (remove) {
                delete value[attribute];
                return null;
            }
            else if (typeof valToSet != "undefined") {
                value[attribute] = valToSet;
                return null;
            }
            else {
                return value[attribute];
            }
        },

        /**
         * Deep select a attribute from a object, if the property does not
         * exist, throw a error
         * @param {String} key Attribute name chained by dots
         * @param {Object} obj The object to search into
         * @return {*}
         * @throws {GO.Error.PropertyNotDefinedError}
         */
        unsafeDeepSelect: function (key, obj) {
            return this._deepSearch(key, obj);
        },

        /**
         * Deep select a attribute from a object
         * @param {String} key Attribute name chained by dots
         * @param {Object} obj The object to search into
         * @return {*}
         */
        deepSelect: function (key, obj) {
            try {
                return this._deepSearch(key, obj);
            }
            catch (e) {
                if (e instanceof GO.Error.PropertyNotDefinedError) {
                    return null;
                }
            }

        },

        /**
         * Deep sets a value to a attribute from a object
         * @param {String} key Attribute name chained by dots
         * @param {Object} obj The object to search into
         * @param {*} value The value to set
         * @return {Boolean}
         */
        deepSet: function (key, obj, value) {
            try {
                this._deepSearch(key, obj, false, value);
            }
            catch (e) {
                if (e instanceof GO.Error.PropertyNotDefinedError) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Deep delete a attribute from a object
         * @param {String} key Attribute name chained by dots
         * @param {Object} obj The object to delete the key
         * @return Boolean
         */
        deepDelete: function (key, obj) {
            try {
                this._deepSearch(key, obj, true);
            }
            catch (e) {
                if (e instanceof GO.Error.PropertyNotDefinedError) {
                    return false;
                }
            }
            return true;
        }
    };
}(GO));

(function (GO) {
    /**
     * Do a 'from' into the query collection
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-09-28
     * @param {GO.Query} query
     * @constructor
     */
    GO.Clause.From = function (query) {
        var _query = query;

        /**
         * Method from to use in query record
         * @param {?Function} instanceType
         * @return {GO.Clause.Where}
         */
        this.from = function (instanceType) {
            if (typeof instanceType == "undefined") {
                // Generic type of object
                instanceType = Object;
            }
            _query._setRecord("from", instanceType);
            return new GO.Clause.Where(_query);
        };
    };
}(GO));

(function (GO) {
    /**
     * Controls the where closure into the query
     * Builds itself based on the parent operation (SELECT, UPDATE, DELETE)
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-09-28
     * @param {GO.Query} query
     * @constructor
     */
    GO.Clause.Where = function (query) {
        var _query = query;
        query._setRecord("where", this);

        /**
         * @type {Object.<String, GO.Core.Modifier.PostProcess>}
         * @private
         */
        var _modifierMethods = {};

        /** @type {GO.Filter} */
        this.filter = null;

        /**
         * Register to the prototype of the this object
         * all the modifiers. Note that 'init' method of
         * all modifiers return the back reference to this object instance.
         * @private
         */
        var _setAvailableModifiers = function () {
            var record = _query._getRecord();
            switch (record.type) {
                case GO.query.type.SELECT:
                    _modifierMethods.orderBy = new GO.Core.Modifier.OrderBy(record);
                    break;

                case GO.query.type.UPDATE:
                    _modifierMethods.set = new GO.Core.Modifier.Set(record);
                    break;
            }
        };

        /**
         * Where function, apply a filter to the query
         * @param {GO.Filter} [filter] If not given, use tautological filter
         * @return {GO.Core.Processor}
         */
        this.where = function (filter) {
            filter = filter || new GO.Filter('', GO.op.TAUTOLOGICAL, '');

            this.filter = filter.root();
            _setAvailableModifiers();

            return new GO.Core.Processor(_query, _modifierMethods);
        };
    };
}(GO));

(function (GO) {
    /**
     * A base post process modifier
     * @since 2013-11-16
     * @param {String} modifierName
     * @constructor
     */
    GO.Core.Modifier.PostProcess = function (modifierName) {
        /**
         * @type {GO.Core.Processor}
         * @protected
         */
        this._processor = null;

        /** @type {String} */
        this.modifierName = modifierName;

        /**
         * Sets the back reference to the where object
         * @param {GO.Core.Processor} ref
         */
        this.setProcessorReference = function (ref) {
            this._processor = ref;
        };

        /**
         * Used to init the object in the GO.Clause.Where object
         * [Warning] Always return the where reference
         * @abstract
         * @throws {GO.Error.NotImplementedError}
         * @return {GO.Clause.Where}
         */
        this.init = function () {
            throw new GO.Error.NotImplementedError("init", this.constructor);
        };

        /**
         * The query result modifier method
         * After implement, create a alias to turn available to use
         * @abstract
         * @param {Object[]} objects The set of objects to modify
         * @throws {GO.Error.NotImplementedError}
         */
        this.modify = function (objects) {
            throw new GO.Error.NotImplementedError("modify", this.constructor);
        };
    };
}(GO));

(function (GO) {
    /**
     * OrderBy Clause
     * @constructor
     * @augments GO.Core.Modifier.PostProcess
     * @param {GO.Core.Record} record
     */
    GO.Core.Modifier.OrderBy = function (record) {
        record.modifiers.push(this);
        var that = this;

        /** @type {String} */
        var targetAttr = null;

        /** @type {GO.order} */
        var orderType = null;

        var customSorter = null;

        /**
         * Array with the sorters by type
         * @type {{number: function}}
         */
        var sorter = {
            "number": function (a, b, order) {
                return order == GO.order.ASC ? a - b : b - a;
            },

            "string": function (a, b, order) {
                var comp = null;
                if (a > b) {
                    comp = 1;
                }
                else if (a < b) {
                    comp = -1
                }
                else {
                    comp = 0;
                }

                return order == GO.order.ASC ? comp : !comp;
            }
        };

        /**
         * Sets the internal data
         * @param {String} attr The attribute to use as reference
         * @param {GO.order} order The chosen order
         * @param {GO.Callback.SorterCallback} [sorter] A custom sorter function returning (1, 0, -1) like
         * @return {GO.Core.Processor}
         */
        this.init = function (attr, order, sorter) {
            targetAttr = attr;
            orderType = order;
            customSorter = sorter || null;

            return that._processor
        };

        /**
         * Modify the result of a query,
         * sorting it into the given order
         */
        this.modify = function (objects) {
            if (customSorter == null) {
                objects.sort(function (a, b) {
                    try {
                        var targetA = GO.Utils.ObjectUtils.unsafeDeepSelect(targetAttr, a);
                        var targetB = GO.Utils.ObjectUtils.unsafeDeepSelect(targetAttr, b);

                        if (sorter.hasOwnProperty(typeof  targetA)) {
                            return sorter[typeof  targetA](targetA, targetB, orderType);
                        }
                    }
                    catch (e) {
                        //TODO: Some log here
                    }

                    return 0;
                });
            }
            else {
                objects.sort(customSorter);
            }
        };
    };

    GO.Core.Modifier.OrderBy.prototype = new GO.Core.Modifier.PostProcess("OrderBy");
    GO.Core.Modifier.OrderBy.constructor = GO.Core.Modifier.OrderBy;
}(GO));

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

(function (GO) {
    /**
     * Creates a filter chain linked by logic operators
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-11-16
     * @param {GO.query.logic_op} logicOperator
     * @param {GO.Filter} filter
     * @constructor
     */
    GO.Core.FilterChain = function (logicOperator, filter) {
        this.link = filter;
        this.type = logicOperator;
    };
}(GO));

(function (GO) {
    /**
     * Do the dirty work. Process the query based
     * on his record of operations and filters.
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-09-28
     * @param {GO.Query} query
     * @param {Object.<String, GO.Core.Modifier.PostProcess>} [extraMethods]
     * @constructor
     */
    GO.Core.Processor = function (query, extraMethods) {
        var that = this;
        var _query = query;

        (function init() {
            if (typeof extraMethods != "undefined") {
                for (var i in extraMethods) {
                    if (extraMethods.hasOwnProperty(i)) {
                        extraMethods[i].setProcessorReference(that);
                        that[i] = extraMethods[i].init;
                    }
                }
            }
        }());

        //==================================================//
        //                    Private methods               //
        //==================================================//

        /**
         * Applies the given filter, and verify if the value
         * has passed on the filter
         * @param {Object} obj
         * @param {GO.Filter} filter
         * @returns {Boolean}
         * @private
         */
        var _applyFilter = function (obj, filter) {
            var approved = false;

            if (filter.hasOwnProperty("associate")) {
                approved = _applyFilter(obj, filter.associate);
            }
            else {
                var value = GO.Utils.ObjectUtils.deepSelect(filter.attribute, obj);
                approved = new GO.Core.Validator(filter, value).test();
            }

            var chain = filter._getFilterChain();
            if (chain != null) {
                var l = GO.query.logic_op;
                switch (chain.type) {
                    case l.AND:
                        return approved && _applyFilter(obj, filter.next());

                    case l.OR:
                        return approved || _applyFilter(obj, filter.next());

                    case l.XOR:
                        return (approved && !_applyFilter(obj, filter.next())) ||
                            (!approved && _applyFilter(obj, filter.next()))
                }
            }

            return approved;
        };

        /**
         * Apply the user selection to the collection
         * Can get inner attributes too, e.g.: user.vehicle.brand
         * @param {Object} obj
         * @param {String} attr
         * @return {Object}
         * @private
         */
        var _selectInObject = function (obj, attr) {
            var copy = {};
            var index = attr.indexOf(".");

            if (attr == GO.query.WILDCARD) {
                //TODO: Make a safe copy of the object
                copy = obj;
            }

            else if (index == -1) {
                if (typeof obj[attr] == "object") {
                    copy[attr] = JSON.parse(JSON.stringify(obj[attr]));
                }
                else {
                    copy[attr] = obj[attr];
                }
            }

            else {
                var upperKey = attr.slice(0, index);
                attr = attr.slice(index + 1);
                copy[upperKey] = obj[upperKey] || null;

                if (attr.indexOf(".") != -1) {
                    copy[upperKey] = _selectInObject(copy[upperKey], attr);
                }
                else if (typeof copy[upperKey] == "object") {
                    copy = JSON.parse(JSON.stringify(copy));
                }
            }
            return copy;
        };

        /**
         * Applies the selection to the result filtered collection
         * @param values
         * @returns {Object[]}
         * @private
         */
        var _applySelection = function (values) {
            var results = [];
            var attributes = _query._getRecord().selection;
            if (attributes.length == 0) {
                attributes = [GO.query.WILDCARD];
            }

            for (var i=0, l=values.length; i < l; i++) {
                var copy = {};
                for (var j=0, len=attributes.length; j < len; j++) {
                    GO.Core.Helpers.objectMerge(copy, _selectInObject(values[i], attributes[j]));
                }
                results.push(copy);
            }

            return results;
        };

        /**
         * Verify if the collection values pass in the filter test,
         * and if it does, execute a callback passing the value
         * @param {Function} callback
         * @private
         */
        var _processFilter = function (callback) {
            for (var i = 0, l = _query.length; i < l; i++) {
                var currentObj = _query[i];
                if (currentObj instanceof _query._getRecord().from) {
                    if (_applyFilter(currentObj, _query._getRecord().where.filter)) {
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
        var _execSelect = function () {
            var results = [];
            _processFilter(function (currentObj) {
                results.push(currentObj);
            });

            return _applySelection(results);
        };

        /**
         * Executes a Delete operation into the collection
         * @private
         */
        var _execDelete = function () {
            _processFilter(function (currentObj) {
                var selections = _query._getRecord().selection;
                for (var i in selections) {
                    GO.Utils.ObjectUtils.deepDelete(selections[i], currentObj);
                }
            });
        };

        /**
         * Applies all the post modifiers registered into the record
         * @param result
         * @return {Object[]}
         * @private
         */
        var _applyModifiers = function (result) {
            var mods = _query._getRecord().modifiers;
            for (var i = 0; i < mods.length; i++) {
                mods[i].modify(result);
            }

            return result;
        };

        //==================================================//
        //                    Public methods                //
        //==================================================//
        /**
         * Executes the query
         * returning the processed array
         * @throws {GO.Error.QueryMethodError}
         * @return {*}
         */
        this.run = function () {
            var result = null;
            var record = _query._getRecord();

            switch (record.type) {
                case GO.query.type.SELECT:
                case GO.query.type.UPDATE:
                    result = _execSelect();
                    break;

                case  GO.query.type.DELETE:
                    result = _execDelete();
                    break;

                default:
                    throw new GO.Error.QueryMethodError("Query method not found", _query._getRecord());
            }

            return _applyModifiers(result);
        };
    };
}(GO));
(function (GO) {
    /**
     * Saves the clause records of the query
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @since 2013-10-15
     * @constructor
     */
    GO.Core.Record = function () {
        /** @type {GO.query.type} */
        this.type = null;

        /** @type {String[]} */
        this.selection = null;

        /** @type {GO.Clause.From} */
        this.from = null;

        /** @type {GO.Clause.Where} */
        this.where = null;

        /** @type {GO.Core.Modifier.PostProcess[]} */
        this.modifiers = [];
    };
}(GO));

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

(function (GO) {
    GO.Core.Helpers = {

        /**
         * Searches deeply into the given object and return the value
         * or update it
         * @param {Object} object
         * @param {String} attribute
         * @param {*} [setVal] Only used to set a new value to the searched attribute
         * @return {*}
         */
        deepSearch: function (object, attribute, setVal) {
            var index = attribute.indexOf(".");

            if (index == -1) {
                if (typeof setVal == "undefined") {
                    return object[attribute];
                }
                else {
                    object[attribute] = setVal;
                }
            }

            else {
                var currentKey = attribute.slice(0, index);
                attribute = attribute.slice(index + 1);

                return GO.Core.Helpers.deepSearch(object[currentKey], attribute, setVal);
            }
        },

        /**
         * Copy deeply the given object respecting the given path
         * @param {Object} object The object to search into
         * @param {String} attribute The attribute path, joined by dots
         * @example
         * //Will return a {{company: {name: String }}} object
         * var compName = GO.Core.Helpers.deepSearch(user, "company.name");
         * @return Object
         */
        deepSelection: function (object, attribute) {
            var index = attribute.indexOf(".");
            var copy = null;

            if (index == -1) {
                copy[attribute] = GO.Core.Helpers.clone(object[attribute]);
            }

            else {
                var currentKey = attribute.slice(0, index);
                attribute = attribute.slice(index + 1);

                //get the current key value
                copy[currentKey] = object[currentKey] || null;

                //If there more keys to search into
                if (attribute.indexOf(".") != -1) {
                    copy[currentKey] = GO.Core.Helpers.deepSelection(copy[currentKey], attribute);
                }
                else {
                    copy = GO.Core.Helpers.clone(object);
                }
            }

            return copy;
        },

        /**
         * Returns a copy of the given object
         * @param {Object} obj object to be cloned
         * @returns {*}
         * @throws GO.Error.CloneError
         */
        clone: function (obj) {
            // Handle the 3 simple types, and null or undefined
            if (obj == null || typeof obj != "object") {
                return obj;
            }

            var copy = null;

            // Handle Date
            if (obj instanceof Date) {
                copy = new Date();
                copy.setTime(obj.getTime());
                return copy;
            }

            // Handle Array
            if (obj instanceof Array) {
                copy = [];
                for (var i = 0, len = obj.length; i < len; i++) {
                    copy[i] = clone(obj[i]);
                }
                return copy;
            }

            // Handle Object
            if (obj instanceof Object) {
                copy = {};
                for (var attr in obj) {
                    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
                }
                return copy;
            }

            throw new GO.Error.CloneError(obj);
        },

        /**
         * Merges two objects
         * @param {Object} obj1 Object which will receive the other
         * @param {Object} obj2 Object to copy the properties
         */
        objectMerge: function (obj1, obj2) {
            for (var i in obj2) {
                if (obj2.hasOwnProperty(i)) {
                    obj1[i] = obj2[i];
                }
            }
        }
    };
}(GO));

    return GO;
}));
