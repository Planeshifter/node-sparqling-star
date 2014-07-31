var sparqls = require("../src/index.js");
var util = require("util");

var extendedAlbum = { 
  "type": "dbpedia-owl:Album",
  "dbpedia-owl:artist" : "dbpedia:Eminem"
  };
  
var myquery3 = new sparqls.Query({distinct: true}); 
myquery3.registerVariable("extendedAlbum", extendedAlbum);
myquery3.order("ASC(?extendedAlbum)");

var sparqler = new sparqls.Client();

sparqler.send(myquery3, function(error, data){
	console.log(util.inspect(data.results.bindings));
});