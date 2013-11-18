GO.Core.Helpers = {

    /**
     * Searches deeply into the given object and return the value
     * or update it
     * @param {Object} object
     * @param {String} attribute
     * @param {*} [setVal] Only used to set a new value to the searched attribute
     * @return {*}
     */
    deepSearch: function(object, attribute, setVal){
        var index = attribute.indexOf(".");

        if(index == -1){
            if(typeof setVal == "undefined"){
                return object[attribute];
            }
            else{
                object[attribute] = setVal;
            }
        }

        else{
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
    deepSelection: function(object, attribute){
        var index = attribute.indexOf(".");
        var copy = null;

        if(index == -1){
            copy[attribute] = GO.Core.Helpers.clone(object[attribute]);
        }

        else{
            var currentKey = attribute.slice(0, index);
            attribute = attribute.slice(index + 1);

            //get the current key value
            copy[currentKey] = object[currentKey] || null;

            //If there more keys to search into
            if(attribute.indexOf(".") != -1){
                copy[currentKey] = GO.Core.Helpers.deepSelection(copy[currentKey], attribute);
            }
            else{
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
    clone: function(obj){
        // Handle the 3 simple types, and null or undefined
        if (obj == null || typeof obj != "object"){
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
    objectMerge: function(obj1, obj2){
        for(var i in obj2){
            if(obj2.hasOwnProperty(i)){
                obj1[i] = obj2[i];
            }
        }
    }
};
