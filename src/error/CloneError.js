/**
 * Object clonning error
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-11-17
 * @param {Object} [object]
 * @augments Error
 */
GO.Error.CloneError = function(object){
    this.name =  "CloneError";
    this.message = "Object couldn't be cloned. One or more inner attributes types are not supported";
    this.data = object || null;
};

GO.Error.CloneError.prototype = new Error();

