'use strict';

/*
	PREFIX dbres: <http://dbpedia.org/resource/>
	SELECT REDUCED ?company ?city
	WHERE {
		?company a dbo:Company .
		?company dbo:location ?city .
		?company dbo:numberOfEmployees ?num . FILTER ( ?num > 1000 )
		FILTER ( regex(?city, 'New') )
	} 
	ORDER BY ASC(?city)
	LIMIT 10
	OFFSET 100
*/

var sparqls = require( './../lib' );
var util = require( 'util' );

var myquery = new sparqls.Query({
	'limit': 10,
	'offset': 100,
	'distinct': false,
	'reduced': true
});

var company = {
	'type': 'dbo:Company',
	'dbo:location': '?city',
	'dbo:numberOfEmployees' : {
		'value': '?num',
		'optional': false,
		'filter': '?num > 1000'
	}
};


myquery.registerVariable( 'company', company )
	.filter( 'regex(?city, \'New\')' )
	.registerPrefix( 'dbres', '<http://dbpedia.org/resource/>' )
	.selection( [ 'company', 'city' ] )
	.order( 'ASC(?city)' );

console.log( myquery.sparqlQuery );

var sparqler = new sparqls.Client();
sparqler.send( myquery, function( error, data ) {
	console.log( util.inspect( data.results.bindings ) );
});
