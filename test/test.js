'use strict';

var chai = require( 'chai' );
var expect = chai.expect;
var lib = require( '../src/index');

describe( 'Query', function tests() {

	describe( 'constructor', function tests() {

		it( 'can create an instance of Query', function test() {
			var query = new lib.Query();
			expect( query ).to.be.an.instanceOf( lib.Query );
		});
	});

});
