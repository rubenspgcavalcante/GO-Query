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
