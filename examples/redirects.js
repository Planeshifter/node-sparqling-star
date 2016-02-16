'use strict';

/*
	PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
	PREFIX dbo: <http://dbpedia.org/ontology/>

	SELECT ?redirectsTo WHERE {
		?x rdfs:label "Controversial"@en .
		?x dbo:wikiPageRedirects ?redirectsTo .
	}
*/

var sparqls = require( './../lib' );
var util = require( 'util' );

var myquery = new sparqls.Query();

var x = {
	'rdfs:label': {
		'value': 'Controversial',
		'literal': true,
		'language': 'en'
	},
	'dbo:wikiPageRedirects': '?redirectsTo'
};

myquery
	.selection( ['redirectsTo'] )
	.registerPrefix( 'dbo', '<http://dbpedia.org/ontology/>' )
	.registerPrefix( 'rdfs', '<http://www.w3.org/2000/01/rdf-schema#>' )
	.registerVariable( 'x', x );

console.log( myquery.sparqlQuery );

var sparqler = new sparqls.Client();
sparqler.send( myquery, function( error, data ) {
	console.log( util.inspect( data.results.bindings ) );
});
