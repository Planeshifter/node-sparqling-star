'use strict';

/*
	PREFIX dbres: <http://dbpedia.org/resource/>
	SELECT REDUCED ?company ?num
	WHERE {
		?company a dbo:Company .
		?company dbo:location ?city .
		?company dbo:numberOfEmployees ?num . FILTER ( ?num > 1000 )
		?city dbo:country dbr:United_States .
	}
	ORDER BY ASC(?num)
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

var city = {
	'dbo:country' : 'dbr:United_States',
};

myquery
	.registerVariable( 'company', company )
	.registerVariable( 'city', city )
	.registerPrefix( 'dbres', '<http://dbpedia.org/resource/>' )
	.selection( [ 'company', 'num' ] )
	.order( 'ASC(?num)' );

console.log( myquery.sparqlQuery );

var sparqler = new sparqls.Client();
sparqler.send( myquery, function( error, data ) {
	console.log( util.inspect( data.results.bindings ) );
});
