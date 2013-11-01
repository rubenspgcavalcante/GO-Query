GO Query!
===========
[![Build Status](https://travis-ci.org/rubenspgcavalcante/GO-Query.png?branch=master)](https://travis-ci.org/rubenspgcavalcante/GO-Query)
##About
*GO Query!* is a javascript library to execute queries into array of objects. You can perorm a **SELECT**, **UPDATE** or
**REMOVE** into your array based on the objects and filters.

##Download
[source file](https://github.com/rubenspgcavalcante/GO-Query/raw/master/build/go-query.0.1.0.js)
[minified](https://github.com/rubenspgcavalcante/GO-Query/raw/master/build/go-query.0.0.9.min.js)

###Why use it?
Sometimes, you just want to search into a array of objects in a simple way, but with more complex filters,
avoiding to do a request to the server and wait for server response time and network transfer time.


###Where can I use it?
Well, you can use in client-side, but you can use it in server side too (nodejs, commonjs).

###Dependeces?
Nope!

###How can I use?
Well, let's suppose we have a array of 'users' and need to find
all who are older than 20 years or have the first name John

````javascript
var query = new GO.Query(objArray);
query = query.select("*")
             .from(Object)
             .where(new GO.Filter("age", GO.op.GTE, 21).or("name", GO.op.LIKE, /^John/));

var result = query.run();
````

###More details?
See the [API](https://github.com/rubenspgcavalcante/GO-Query/wiki/GO-Query!-API)

#Building
If you want to build the sources, you will need first install all dependences and after intall the grunt client
globally:
```shellscript
npm install
sudo install -g grunt-cli
```

To run the tasks:
```shellscript
grunt
```

##Author
Rubens Pinheiro Gonçalves Cavalcante  
email: [rubenspgcavalcante@gmail.com](mailto:rubenspgcavalcante@gmail.com)

##License & Rights

Using GNU GENERAL PUBLIC LICENSE *Version 3, 29 June 2007*
[gnu.org](http://www.gnu.org/copyleft/gpl.html)  
