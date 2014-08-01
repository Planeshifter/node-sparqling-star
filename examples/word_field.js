/*
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dbo: <http://dbpedia.org/ontology/>

SELECT ?subject WHERE {
  ?x rdfs:label "Controversial"@en .
  ?x dbo:wikiPageRedirects ?redirectsTo .
  ?redirectsTo dcterms:subject ?subject .
}
*/

var sparqls = require("../src/index.js");
var util = require("util");

var myquery = new sparqls.Query();

var x = { 
  "rdfs:label": {value:"Face",literal:true,language:"en"},
  "dbo:wikiPageRedirects" : "?redirectsTo",
 };
 
var redirectsTo = {
	"dcterms:subject" : "?subject"
};

var subject = {
	"rdfs:label" : "?label"
};
 
myquery
    .selection(["label"])
	.registerPrefix("dbo", "<http://dbpedia.org/ontology/>")
	.registerPrefix("rdfs", "<http://www.w3.org/2000/01/rdf-schema#>")
	.registerVariable("x", x)
	.registerVariable("redirectsTo",redirectsTo)
	.registerVariable("subject", subject);

console.log(myquery.sparqlQuery)

var sparqler = new sparqls.Client();
sparqler.send(myquery, function(error, data){
	var arr = data.results.bindings;
	var labels = arr.map(function(elem){
		return elem.label.value;
	});
	console.log(labels);
});
