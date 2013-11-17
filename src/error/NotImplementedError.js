/**
 * Not implemented error
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-11-16
 * @param {String} methodName
 * @param {Function} [constructor]
 * @constructor
 */
GO.Error.NotImplementedError = function(methodName, constructor){
    this.name =  "NotImplementedError";
    this.message = "Constructor must implement " + methodName;
    this.data = constructor || null;
};

GO.Error.NotImplementedError.prototype = new Error();
GO.Error.NotImplementedError.constructor = GO.Error.NotImplementedError;
