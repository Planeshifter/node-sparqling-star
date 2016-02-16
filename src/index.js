'use strict';

// MODULES //

var request = require( 'request' );
var querystring = require( 'querystring' );
var underscore = require( 'underscore' );


// NAMESPACE //

var sparqls = {};

sparqls.QueryVariable = function( name, obj ) {
	this.name  = name;
	this.obj = obj || {};
};

sparqls.PrefixVariable = function( name, url ) {
   this.name = name;
   this.url = url;
};

sparqls.Query = function( obj ) {
	if ( !( obj instanceof Object ) ) {
		obj = {};
	}

	this.limit = obj.limit || 100;
	this.offset = obj.offset || 0;
	this.distinct = obj.distinct || false;
	this.reduced = obj.reduced  || false;

	this.orderBy = null;

	this.variables = [];
	this.globalFilters = [];
	this.prefixes = [];
	this.selectors = [];

	this.__defineGetter__( 'sparqlQuery', function() {
		return this.toString();
	});

};

sparqls.Query.prototype.registerVariable = function( name, obj ) {
	var a = new sparqls.QueryVariable( name, obj );
	this.variables.push( a );
	return this;
};

sparqls.Query.prototype.registerPrefix = function( name, url ) {
	var a = new sparqls.PrefixVariable( name, url );
	this.prefixes.push( a );
	return this;
};

sparqls.Query.prototype.selection = function( list ) {
	if (typeof list === 'string') {
		this.selectors.push( list );
	}
	if ( this.selectors.length === 0 ) {
		this.selectors = list;
	} else {
		this.selectors = this.selectors.concat( list );
	}
	return this;
};

sparqls.Query.prototype.getPrefixes = function() {
	var c = '';
	this.prefixes.forEach( function( elem ) {
		c += 'PREFIX ';
		c += elem.name + ': ';
		c += elem.url + '\n';
	} );
	return c;
};

sparqls.Query.prototype.getSelectors = function() {
	var d = '';
	this.selectors.forEach( function( elem ) {
		if ( elem[0] !== '?' ) {
			d += '?' + elem;
		}
		else {
			d += elem;
		}
		d += ' ';
	} );
	d += '\n';
	return d;
};

sparqls.Query.prototype.filter = function( str ) {
	this.globalFilters.push( str );
	return this;
};

sparqls.Query.prototype.order = function( str ) {
	this.orderBy = str;
	return this;
};

sparqls.Query.prototype.getWhereString = function() {
	var a = '';
	this.variables.forEach( function( elem ) {
		for ( var key in elem.obj ) {
			if ( elem.obj.hasOwnProperty( key ) === true ) {
				var rightObj = elem.obj[key];

				if ( typeof rightObj === 'object' ) {

					var s;
					if ( rightObj.literal ) {
						var lang = rightObj.language || 'en';
						s = '?' + elem.name + ' ';
						s += key + ' ';
						s += '\'' + rightObj.value + '\'@' + lang + ' .';
					} else {
						s = '?' + elem.name + ' ';
						s += key + ' ';
						s += rightObj.value + ' .';
					}

					if ( rightObj.filter ) {
						s += ' FILTER ( ' + rightObj.filter + ' )';
					}
					s += ' \n';

					if ( rightObj.optional === true ) {
						s = 'OPTIONAL { ' + s + '}';
					}

					a += s;
				}
				else {
					if( key === 'type') {
						a += '?' + elem.name + ' ';
						a += 'a ';
						a += rightObj + ' .\n';
					} else {
						a += '?' + elem.name + ' ';
						a += key + ' ';
						a += rightObj + ' .\n';
					}
				}
			}
		}
	});
	return a;
};

sparqls.Query.prototype.getGlobalFilters = function() {
	var b = '';
	this.globalFilters.forEach( function( elem ) {
		b += 'FILTER ( ' + elem + ' )';
	} );
	return b;
};

sparqls.Query.prototype.getSelect = function() {
	if ( this.distinct === true && this.reduced === true ) {
		try {
				throw new TypeError('Distinct and Reduced cannot be both true. Using only simple SELECT.');
		} catch (e) {
			console.log(e.name);
			console.log(e.message);
			return 'SELECT ';
		}
	}

	var ret = 'SELECT ';
	if (this.distinct === true) {
		ret += 'DISTINCT ';
	}
	if (this.reduced === true) {
		ret += 'REDUCED ';
	}
	return ret;
};

sparqls.Query.prototype.toString = function() {
	var ret = '';
	ret +=  this.getPrefixes();

	ret += this.getSelect();
	if ( this.selectors.length > 0 ) {
		 ret += this.getSelectors();
	}
	else {
		ret += '* ';
	}

	ret += 'WHERE { \n';
	ret += this.getWhereString();
	ret += this.getGlobalFilters();
	ret += '} \n';
	if ( this.orderBy !== null ) {
		ret += 'ORDER BY ' + this.orderBy + '\n';
	}
	ret += 'LIMIT ' + this.limit + '\n';
	if ( this.offset ) {
		ret += 'OFFSET ' + this.offset;
	}
	return ret;
};

sparqls.Client = function(endpoint){

	if ( !(this instanceof sparqls.Client) ) {
		return new sparqls.Client( endpoint );
	}

	var self = this;
	this.endpoint = endpoint || 'http://dbpedia.org/sparql';
	this.defaultParameters = {
		'format': 'application/json',
		'content-type': 'application/json'
	};

	this.init = function() {
		self.requestDefaults = {
			url: self.endpoint,
			method: 'POST',
			encoding: 'utf8',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			}
		};

		self.makeRequest = request.defaults(self.requestDefaults);
	};

	self.init();
};

sparqls.Client.prototype.send = function( query, callback ) {
	var requestBody = underscore.extend( this.defaultParameters, {
		query: String(query)
	});
	var opts = {
		body: querystring.stringify(requestBody)
	};

	this.makeRequest(opts, function( error, response, body ) {
		var data = JSON.parse( body );
		callback( error, data );
	});
};


// EXPORTS //

module.exports = sparqls;
