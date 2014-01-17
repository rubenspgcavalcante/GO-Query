/**
 * OrderBy Clause
 * @constructor
 * @augments GO.Core.Modifier.PostProcess
 * @param {GO.Core.Record} record
 */
GO.Core.Modifier.OrderBy = function(record){
    record.modifiers.push(this);
    var that = this;

    /** @type {String} */
    var targetAttr = null;

    /** @type {GO.order} */
    var orderType = null;

    var customSorter = null;

    /**
     * Array with the sorters by type
     * @type {{number: function}}
     */
    var sorter = {
        "number": function(a, b, order){
            return order == GO.order.ASC? a-b : b-a;
        },

        "string": function(a, b, order){
            var comp = null;
            if(a > b){
                comp = 1;
            }
            else if(a < b){
                comp = -1
            }
            else{
                comp = 0;
            }

            return order == GO.order.ASC? comp : !comp;
        }
    };

    /**
     * Sets the internal data
     * @param {String} attr The attribute to use as reference
     * @param {GO.order} order The chosen order
     * @param {GO.Callback.SorterCallback} [sorter] A custom sorter function returning (1, 0, -1) like
     * @return {GO.Core.Processor}
     */
    this.init = function(attr, order, sorter){
        targetAttr = attr;
        orderType = order;
        customSorter = sorter || null;

        return that._processor
    };

    /**
     * Modify the result of a query,
     * sorting it into the given order
     */
    this.modify = function(objects){
        if(customSorter == null){
            objects.sort(function(a, b){
                if(a.hasOwnProperty(targetAttr) && b.hasOwnProperty(targetAttr)){
                    var targetA = a[targetAttr];
                    var targetB = b[targetAttr];

                    if(sorter.hasOwnProperty(typeof  a[targetAttr])){
                        return sorter[typeof  targetA](targetA, targetB, orderType);
                    }
                }
                return 0;
            });
        }
        else{
            objects.sort(customSorter);
        }
    };
};

GO.Core.Modifier.OrderBy.prototype = new GO.Core.Modifier.PostProcess("OrderBy");
GO.Core.Modifier.OrderBy.constructor = GO.Core.Modifier.OrderBy;
