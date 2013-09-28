GO Query!
===========
##About
*GO Query!* is a javascript library to execute queries into array of objects. You can perorm a **SELECT**, **UPDATE** or
**REMOVE** into your array based on the objects and filters.

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

##Author
Rubens Pinheiro Gonçalves Cavalcante  
email: [rubenspgcavalcante@gmail.com](mailto:rubenspgcavalcante@gmail.com)

##License & Rights

Using GNU LESSER GENERAL PUBLIC LICENSE *Version 3, 29 June 2007*  
[gnu.org](http://www.gnu.org/copyleft/gpl.html)  
