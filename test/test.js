'use strict';

var chai = require( 'chai' );
var expect = chai.expect;
var sparqler = require( '../lib/' );

describe( 'Query', function tests() {

	describe( 'constructor', function tests() {

		it( 'can create an instance of Query', function test() {
			var query = new sparqler.Query();
			expect( query ).to.be.an.instanceOf( sparqler.Query );
		});
	});

});
