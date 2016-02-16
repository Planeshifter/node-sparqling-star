'use strict';

/*
	SELECT DISTINCT * WHERE {
		?extendedAlbum a dbo:Album .
		?extendedAlbum dbo:artist dbr:Eminem .
	}
	ORDER BY ASC(?extendedAlbum)
*/

var sparqls = require( './../lib' );
var util = require( 'util' );

var extendedAlbum = {
	'type': 'dbo:Album',
	'dbo:artist': 'dbr:Eminem'
};

var myquery = new sparqls.Query({
	'distinct': true
});

myquery.registerVariable( 'extendedAlbum', extendedAlbum );
myquery.order( 'ASC(?extendedAlbum)' );

console.log( myquery.sparqlQuery );

var sparqler = new sparqls.Client();

sparqler.send( myquery, function( error, data ) {
	console.log( util.inspect( data.results.bindings ) );
});
