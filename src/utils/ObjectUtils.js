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
    _deepSearch: function(attribute, obj, remove, valToSet){
        if(attribute == null){
            return null;
        }

        var index = attribute.indexOf('.');
        var value = null;

        if(index != -1){
            var upperKey = attribute.slice(0, index);
            attribute = attribute.slice(index + 1);
            if(obj.hasOwnProperty(upperKey)){
                value = obj[upperKey] || null;
            }

            else{
                throw new GO.Error.PropertyNotDefinedError(upperKey, obj);
            }
        }
        else{
            value = obj;
        }

        //Exists other points? e.g. customer.creditcard.brand
        if(attribute.indexOf('.') != -1 && value != null){
            return this._deepSearch(value, attribute, remove);
        }

        else if(remove){
            delete value[attribute];
            return null;
        }
        else if(typeof valToSet != "undefined"){
            value[attribute] = valToSet;
            return null;
        }
        else{
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
    unsafeDeepSelect: function(key, obj){
        return this._deepSearch(key, obj);
    },

    /**
     * Deep select a attribute from a object
     * @param {String} key Attribute name chained by dots
     * @param {Object} obj The object to search into
     * @return {*}
     */
    deepSelect: function(key, obj){
        try{
            return this._deepSearch(key, obj);
        }
        catch (e){
            if(e instanceof GO.Error.PropertyNotDefinedError){
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
    deepSet: function(key, obj, value){
        try{
            this._deepSearch(key, obj, false, value);
        }
        catch (e){
            if(e instanceof GO.Error.PropertyNotDefinedError){
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
    deepDelete: function(key, obj){
        try{
            this._deepSearch(key, obj, true);
        }
        catch (e){
            if(e instanceof GO.Error.PropertyNotDefinedError){
                return false;
            }
        }
        return true;
    }
};