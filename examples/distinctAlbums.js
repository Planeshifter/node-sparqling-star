'use strict';

/*
	SELECT DISTINCT ?recordLabel
	WHERE {
		?extendedAlbum a dbo:Album .
		?extendedAlbum dbo:artist dbr:Eminem .
		?extendedAlbum dbo:genre ?genre .
		?extendedAlbum dbo:recordLabel ?recordLabel .
	}
*/

var sparqls = require( './../lib' );
var util = require( 'util' );

var extendedAlbum = {
	'type': 'dbo:Album',
	'dbo:artist' : 'dbr:Eminem',
	'dbo:genre' : '?genre',
	'dbo:recordLabel' : '?recordLabel',
};

var myquery = new sparqls.Query({
	'distinct': true
});
myquery.registerVariable( 'extendedAlbum', extendedAlbum );

console.log( myquery.sparqlQuery );

var sparqler = new sparqls.Client();

sparqler.send( myquery, function( error, data ) {
	console.log( util.inspect( data.results.bindings ) );
});
