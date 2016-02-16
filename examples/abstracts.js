'use strict';

/*
	SELECT ?abstract
	WHERE {
		<http://dbpedia.org/resource/Civil_engineering> dct:subject ?abstract
	}
*/

var sparqls = require( './../lib' );
var util = require( 'util' );

var myquery = new sparqls.Query();

var triple = {
	'subject': '<http://dbpedia.org/resource/Civil_engineering>',
	'predicate': 'dct:subject',
	'object': '?abstract'
};

myquery.registerTriple( triple );

var sparqler = new sparqls.Client();
sparqler.send( myquery, function( error, data ) {
	console.log( util.inspect( data.results.bindings ) );
});
