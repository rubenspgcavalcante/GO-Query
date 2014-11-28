    /**
     * GO Query global namespace
     * @author Rubens Pinheiro Gonçalves Cavalcante
     * @global
     * @namespace GO
     * @alias GO
     */

    /**
     * Clause objects namespace
     * @namespace
     */
    GO.Clause = {};

    /**
     * Core objects namespace
     * [Warning] Only used internally by the lib
     * @namespace
     */
    GO.Core = {};

    /**
     * Query result modifiers namespace
     * @namespace
     */
    GO.Core.Modifier = {};

    /**
     * Helper functions
     * @namespace
     */
    GO.Core.Helpers = {};

    /**
     * Custom error objects namespace
     * @namespace
     */
    GO.Error = {};

    /**
     * Utils libraries
     * @namespace
     */
    GO.Utils = {};

    /**
     * Query env namespace
     * @namespace
     */
    GO.query = {};

    /**
     * Describes the query types
     * @readonly
     * @enum {Number}
     */
    GO.query.type = {
        SELECT: 0,
        DELETE: 1,
        UPDATE: 2
    };

    /**
     * Describes the logic operator available
     * @readonly
     * @enum {Number}
     */
    GO.query.logic_op = {
        AND: 0,
        OR: 1,
        XOR: 2
    };

    /**
     * @constant {String}
     * @default
     */
    GO.query.WILDCARD = "*";

    /**
     * Describes the query operators
     * @readonly
     * @enum {Number}
     */
    GO.op = {
        TAUTOLOGICAL: 0,
        CONTRADICTORY: 1,
        EQ: 2,
        NEQ: 3,
        GT: 4,
        GTE: 5,
        MT: 6,
        MTE: 7,
        LIKE: 8,
        HAS: 9
    };

    /**
     * Describes the order types
     * @readonly
     * @enum {Number}
     */
    GO.order = {
        ASC: 0,
        DESC: 1
    };

    /**
     * Describes the three values of
     * a sort function which references the
     * first value compared with the second value
     * @enum {Number}
     */
    GO.comparison = {
        GREATER: 1,
        EQUALS: 0,
        LESSER: -1
    };

    /*=========================*/
    /*   Callback definitions  */
    /*=========================*/

    /**
     * Callbacks defines
     * @name GO.Callback
     * @namespace
     */

    /**
     * Sorter callback
     * @name GO.Callback.SorterCallback
     * @callback SorterCallback
     * @param {*} a
     * @param {*} b
     * @return {GO.comparison}
     */