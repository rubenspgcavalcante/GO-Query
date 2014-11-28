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
