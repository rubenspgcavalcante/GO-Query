GO Query!
===========
[![Build Status](https://travis-ci.org/rubenspgcavalcante/GO-Query.png?branch=master)] (https://travis-ci.org/rubenspgcavalcante/GO-Query)
[![Bower Module](https://badge.fury.io/bo/goquery.svg)] (https://badge.fury.io/hooks/github)
[![npm version](https://badge.fury.io/js/goquery.svg)](http://badge.fury.io/js/goquery)
[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/rubenspgcavalcante/go-query/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

##About
*GO Query!* is a javascript library to execute queries into array of objects. You can perorm a **SELECT**, **UPDATE** or
**REMOVE** into your array based on the objects and filters.

##Download
Latest development version:
[source file](https://raw.githubusercontent.com/rubenspgcavalcante/GO-Query/master/dist/goquery.js)

Latest production version:
[minified](https://raw.githubusercontent.com/rubenspgcavalcante/GO-Query/master/dist/goquery.min.js)

###Why use it?
Sometimes, you just want to search into a array of objects in a simple way, but with more complex filters,
avoiding to do a request to the server and wait for server response time and network transfer time.


###Where can I use it?
Well, you can use in client-side, but you can use it in server side too (nodejs, commonjs).

###Dependeces?
Nope!

###How can I use?
Well, let's suppose we have a array of 'users' and need to find
all who are older than 20 years or have the first name John and
works on company ACME

````javascript
var query = new GO.Query(objArray);
query = query.select("*")
             .from(Object)
             .where(
                 new GO.Filter("age", GO.op.GTE, 21)
                       .or("name", GO.op.LIKE, /^John/)
                       .and("company.name", GO.op.EQ, "ACME")
             );

var result = query.run();
````

###Using with Node.js?
first intall via npm
````script
npm install goquery
````
... and import the module
````node
//import
var GO = require("goquery");

//use
var q = new GO.Query(data);
//...
````

###More details?
See the [API](https://github.com/rubenspgcavalcante/GO-Query/wiki/GO-Query!-API)

#Building
If you want to build the sources, you will need first install all dependences and after intall the grunt client
globally:
```script
npm install
sudo install -g grunt-cli
```

To run the tasks:
```script
grunt
```

##Author
Rubens Pinheiro Gonçalves Cavalcante  
email: [rubenspgcavalcante@gmail.com](mailto:rubenspgcavalcante@gmail.com)

##License & Rights

Using GNU GENERAL PUBLIC LICENSE *Version 3, 29 June 2007*
[gnu.org](http://www.gnu.org/copyleft/gpl.html)

