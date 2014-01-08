/**
 * Do the dirty work. Process the query based
 * on his record of operations and filters.
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-09-28
 * @param {GO.Query} query
 * @param {Object.<String, GO.Core.Modifier.PostProcess>} [extraMethods]
 * @constructor
 */
GO.Core.Processor = function(query, extraMethods){
    var that = this;
    var _query = null;

    var _init = function(){
        _query = query;

        if(typeof extraMethods != "undefined"){
            for(var i in extraMethods){
                extraMethods[i].setProcessorReference(that);
                that[i] = extraMethods[i].init;
            }
        }
    }();

    //==================================================//
    //                    Private methods               //
    //==================================================//

    /**
     * Search the attribute value in inner objects
     * and return/set the value
     * @param {Object} obj
     * @param {String} attribute
     * @param {GO.query.type} [operation={GO.query.type.SELECT}]
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
     * @private
     */
    var _applyFilter = function(obj, filter){
        var approved = false;

        if(filter.hasOwnProperty("associate")){
            approved = _applyFilter(obj, filter.associate);
        }
        else{
            var value = _deepAttribute(obj, filter.attribute);
            approved = new GO.Core.Validator(filter, value).test();
        }

        var chain = filter._getFilterChain();
        if(chain != null){
            var l = GO.query.logic_op;
            switch (chain.type){
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
    var _selectInObject = function(obj, attr){
        var copy = {};
        var index = attr.indexOf(".");

        if(attr == GO.query.WILDCARD){
            //TODO: Make a safe copy of the object
            copy = obj;
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
                GO.Core.Helpers.objectMerge(copy, _selectInObject(values[i], attributes[j]));
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

    /**
     * Applies all the post modifiers registered into the record
     * @param result
     * @return {Object[]}
     * @private
     */
    var _applyModifiers = function(result){
        var mods = _query._getRecord().modifiers;
        for(var i = 0; i < mods.length; i++){
            mods[i].setCollection(result);
            mods[i].modify();
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
    this.run = function(){
        var result = null;
        var record = _query._getRecord();

        switch(record.type){
            case GO.query.type.SELECT:
                result = _execSelect();
                break;

            case GO.query.type.UPDATE:
                result = _execUpdate();
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
