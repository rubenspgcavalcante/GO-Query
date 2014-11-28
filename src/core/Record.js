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
