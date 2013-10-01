## GO.Query
## Constructor
* parameter `Object[] collection` Array of objects to search into
* usage:
```javascript
new GO.Query(collection)
```

## Methods
### select()
Activate a select operation into the query
* parameters `...String attributes` Attributes to do a selection (default = "*")
* returns `GO.Core.From` From object
* usage:
```javascript
query.select("id", "name", "email");

//Select all
query.select("*");
query.select();
```

### update()
Activate a update operation into the query
* parameters `...String attributes` Attributes to do a update
* returns `GO.Core.From` From object
* usage:
```javascript
query.update("name", "email");
```

### remove()
Activate a remove operation into the query
* parameters `none`
* returns `GO.Core.From` From object
* usage:
```javascript
query.delete();
```

***

## GO.Core.From
Object returned by the query when call the select/update/remove methods
## Methods
### from()
Register to the query which object instance type to search into
* parameters `* constructor` object constructor to use as reference
* returns `GO.Core.Where` Where object
* usage:
```javascript
//Searchs in any type of object instance, independent of the constructor
query.select("id").from(Object);

//On a especific type of object
query.select("name").from(User);

```

***

## GO.Core.Where
Object returned by a From instance when call the from method
## Methods
### where()
Register to the query which filters used when search into the array
* parameters `GO.Filter filter` a customized filter with the search rules
* returns `GO.Core.Processor` Processor object
* usage:
```javascript
query.select("id").from(Object).where(myFilter);
```

***

# GO.Core.Processor
Object returned by a Where instance when call the where method
## Methods
### run()
Executes the query
* parameters `none`
* returns `Object[]` Array with the query results
* usage:
```javascript
query.select("id").from(Object).where(filter).run();
```

***

# GO.Filter
Dinamic filter to create custom searchs. Can receive a attribute/operator/value or a filter.
If a filter is given, respect the associativity rules.
## Constructor
* parameters 
  * `String|GO.Filter attrOrFilter` the attribute to search into or a filter
  * `Number operator` the operator (see GO.op enumeration)
  * `* value` The value to compare
* usage:
```javascript
var innerFilter = new GO.Filter("id", GO.op.EQ, 100);
var outterFilter = new GO.Filter(innerFilter);
```

## Methods
### and()
Chains a 'and' operation to the filter
* parameters 
  * `String|GO.Filter attrOrFilter` the attribute to search into or a filter
  * `Number operator` the operator (see GO.op enumeration)
  * `* value` The value to compare
* returns `GO.Filter`
* usage:
```javascript
filter.and("name", GO.op.EQ, "Rubens");
filter.and(otherFilter);
```

### or()
Chains a 'or' operation to the filter
* parameters 
  * `String|GO.Filter attrOrFilter` the attribute to search into or a filter
  * `Number operator` the operator (see GO.op enumeration)
  * `* value` The value to compare
* returns `GO.Filter`
* usage:
```javascript
filter.or("age", GO.op.LT, 80);
filter.or(otherFilter);
```

### xor()
Chains a 'xor' operation to the filter
* parameters 
  * `String|GO.Filter attrOrFilter` the attribute to search into or a filter
  * `Number operator` the operator (see GO.op enumeration)
  * `* value` The value to compare
* returns `GO.Filter`
* usage:
```javascript
filter.xor("email", GO.op.LIKE, /@mymail.com$/);
filter.xor(otherFilter);
```

### isEmpty()
Verify if the filter is empty
* parameters `none`
* returns `Boolean`
* usage:
```javascript
filter.isEmpty();
```

### root()
Bubble up, returns to the root filter
* parameters `none` the attribute to search into
* returns `GO.Filter`
* usage:
```javascript
var root = filter.root();
```

### parent()
Get the parent filter
* parameters `none`
* returns `?GO.Filter`
* usage:
```javascript
var parent = filter.parent();
```

### child()
Get the child filter
* parameters `none`
* returns `?GO.Filter`
* usage:
```javascript
var child = filter.child();
```