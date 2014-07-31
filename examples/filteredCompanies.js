var sparqls = require("../src/index.js");
var util = require("util");

var myquery = new sparqls.Query({limit:10, offset:100, distinct:false, reduced:true});

var company = {
	"type" : "dbpedia-owl:Company",
	"dbpedia-owl:location" : "?city",
	"dbpedia-owl:numberOfEmployees" : {value: "?num", optional:false,filter:"?num > 1000"},
};


myquery.registerVariable("company", company)
		.filter("regex(?city, 'New')")
		.registerPrefix("dbres","<http://dbpedia.org/resource/>")
		.selection(["company","city"])
		.order("ASC(?city)");
		
console.log(myquery.sparqlQuery);
		
var sparqler = new sparqls.Client();
sparqler.send(myquery, function(error, data){
	console.log(util.inspect(data.results.bindings));
});
