/**
 * Query method error
 * @author Rubens Pinheiro Gonçalves Cavalcante
 * @since 2013-10-17
 * @param {String} msg
 * @param {*} [data]
 * @constructor
 */
GO.Error.QueryMethodError = function(msg, data){
    this.name =  "QueryMethodError";
    this.message = msg;
    this.data = data || null;
};

GO.Error.QueryMethodError.prototype = new Error();
GO.Error.QueryMethodError.constructor = GO.Error.QueryMethodError;
