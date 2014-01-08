/**
 * A base post process modifier
 * @since 2013-11-16
 * @param {String} modifierName
 * @constructor
 */
GO.Core.Modifier.PostProcess = function(modifierName){

    /**
     * @type {Object[]}
     * @protected
     */
    this._collection = [];

    /**
     * @type {GO.Core.Processor}
     * @protected
     */
    this._processor = null;

    /** @type {String} */
    this.modifierName = modifierName;

    /**
     * Sets the internal collection
     * @param {Object[]} collection
     */
    this.setCollection = function(collection){
        this._collection = collection;
    };

    /**
     * Sets the back reference to the where object
     * @param {GO.Core.Processor} ref
     */
    this.setProcessorReference = function(ref){
        this._processor = ref;
    };

    /**
     * Used to init the object in the GO.Clause.Where object
     * [Warning] Always return the where reference
     * @abstract
     * @throws {GO.Error.NotImplementedError}
     * @return {GO.Clause.Where}
     */
    this.init = function(){
        throw new GO.Error.NotImplementedError("init", this.constructor);
    };

    /**
     * The query result modifier method
     * After implement, create a alias to turn available to use
     * @abstract
     * @throws {GO.Error.NotImplementedError}
     */
    this.modify = function(){
        throw new GO.Error.NotImplementedError("modify", this.constructor);
    };
};
