SELECT ?abstract
WHERE {
{ <http://dbpedia.org/resource/Civil_engineering> dcterms:subject ?abstract }
}

var sparqls = require("../src/index.js");
var util = require("util");

var myquery = new sparqls.Query();

var album = { 
  "type": "dbpedia-owl:Album",
  "dbpedia-owl:artist" : "dbpedia:Eminem"
 };
 
myquery.registerVariable("album", album);

var sparqler = new sparqls.Client();
sparqler.send(myquery, function(error, data){
	console.log(util.inspect(data.results.bindings));
});
