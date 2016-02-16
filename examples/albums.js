'use strict';

/*
	SELECT * WHERE {
		?album a dbo:Album .
		?album dbo:artist dbr:Eminem .
	}
*/

var sparqls = require( './../lib' );
var util = require( 'util' );

var myquery = new sparqls.Query();

var album = {
	'type': 'dbo:Album',
	'dbo:artist' : 'dbr:Eminem'
};

myquery.registerVariable( 'album', album );

console.log( myquery.sparqlQuery );

var sparqler = new sparqls.Client();
sparqler.send( myquery, function( error, data ) {
	console.log( util.inspect( data.results.bindings ) );
});
