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