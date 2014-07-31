var sparqls = require("../src/index.js");
var util = require("util");

var myquery2 = new sparqls.Query(); 

var extendedAlbum = { 
  "type": "dbpedia-owl:Album",
  "dbpedia-owl:artist" : "dbpedia:Eminem",
  "dbpedia-owl:genre" : "?genre",
  "dbpedia-owl:recordLabel" : "?recordLabel",
  };
  
myquery2.registerVariable("extendedAlbum", extendedAlbum);
myquery2.selection("recordLabel");

var sparqler = new sparqls.Client();

sparqler.send(myquery2, function(error, data){
	console.log(util.inspect(data.results.bindings));
});
