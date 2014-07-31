[![NPM version](https://badge.fury.io/js/sparqling-star.svg)](http://badge.fury.io/js/sparqling-star)

node-SPARQLing Star
===================

# Introduction

This package allows you to create SPARQL calls via JavaScrapt object notation and to query a SPARQL endpoint and fetch the results 

## What it is about?

Using the query language SPARQL (Simple Protocol and RDF Query Language) provides methods to retrieve machine-readable data stored in RDF. RDF stands for Resource Description Framework and is a way to store data in triplets, following the syntactical structure of subject, predicate and noun. In a very practical sense, it gives an access point to semantic web technologies and databases. One of the prime examples is the DBpedia, which is the machine-readable form of Wikipedia. DBpedia allows you to understand the Wikipedia as a big, structured database from which one can extract valuable information.  

# Getting Started

To install the package, call 

```
npm install sparqling-star
```

from your working directory. To require the package in a *.js file, use the usual syntax:

```
var sparqler = require('sparqling-star')
```

If you are interested in using the package not only on the server, but also client-sided, you could use the *Browserify* to convert your code into one single *.js file which can easily be embedded in an html document. 

## Quick Overview

To give you an idea how the package, we are going through the steps of creating a call to DBpedia and printing the fetched results to the console. Our objective is to load all the names of the music albums from Eminem. After loading the package, we can construct a query object as follows:


```
var myquery = new sparqls.Query();
```

This is an empty query object, so we have to add some information. Our *myquery* object expects JavaScript objects to perform the search. First, we create an *album* object which specifies the properties that we wish to retrieve.

```
var album = { 
  "type": "dbpedia-owl:Album",
  "dbpedia-owl:artist" : "dbpedia:Eminem"
  };
```

In this object, the keys represent the RDF predicates and the right-hand side our search values. 

Then we have to register the query object in our query: 
```
myquery.registerVariable("album", album);
``` 

Behind the scenes, this creates a valid SPARQL call. To retrieve the code, you can access the *sparqlQuery* property of the *myquery* object as in `myquery.sparqlQuery` which will print out

```
SELECT * WHERE { 
?album a dbpedia-owl:Album .
?album dbpedia-owl:artist dbpedia:Eminem .
} 
LIMIT 100
``` 

To test the created code, you can use a web frontend of a SPARQL endpoint of DBpedia such as [Virtuoso](http://dbpedia.org/sparql). 

To fetch results in JSON format inside JavaScript, we have to create a client object that communicates with a SPARQL endpoint. The constructor function Client expects an optional string argument to specify the endpoint. If you do not pass an argument, it will default to *http://dbpedia.org/sparql*. Since we are fine with this in our current application, we can simply type

``` 
var sparqler = new sparqls.Client();
``` 

With this object, you can send a multitide of queries, even at the same time. One simply has to pass a Query object to the send method and provide as a second argument a callback function which has two parameters: error and data.

``` 
sparqler.send(myquery, function(error, data){
	console.log(data.results.bindings);
});
```

By default, a created SPARQL call we fetch all variables that have been registered. DBpedia provides a nice visual interface which gives you a preview of all the information stored for a certain entity. The URL for the DBpedia entry for Eminems second album, the Marshall Mathers LP, is [http://dbpedia.org/page/The_Marshall_Mathers_LP](http://dbpedia.org/page/The_Marshall_Mathers_LP). For example, we could extend our album object to also include the music genre and the record label:

```
var extendedAlbum = { 
  "type": "dbpedia-owl:Album",
  "dbpedia-owl:artist" : "dbpedia:Eminem",
  "dbpedia-owl:genre" : "?genre",
  "dbpedia-owl:recordLabel" : "?recordLabel",
  };
```

As you can see here, this query differs from the previous one insofar as it introduces open variables that we want to retrieve but upon which we do not impose any restrictions. We use a starting "?" for such a local variable. Using a new query, we can retrieve results as follows:

``` 
var myquery2 = new sparqls.Query();
myquery2.registerVariable("extendedAlbum", extendedAlbum);

sparqler.send(myquery2, function(error, data){
	console.log(util.inspect(data.results.bindings));
});

``` 

# Further Options

## Selection
By default, all registered and other variables are returned in the result set. This corresponds to a "SELECT *" statement in SPARQL. However, you might want to reduce the returned data by specifying them explicitly. This is achieved by using the `selection` method of the query object. Assume that we only want to view the record labels of Eminems albums. We can do this by typing

``` 
myquery2.selection("recordLabel")
``` 

Besides passing a string, it is also possible to supply a multitude of variables arranged in a JavaScript Array. As you may notice, the returned result set contains multiple instances of the different record labels. To only retrieve these instances once, we can use a modifier.

## Modifiers

### Distinct 
When creating a query, we can use the *distinct* option to filter out duplicate instance. All modifiers are set when creating the query object.

```
var myquery3 = new sparqls.Query({distinct: true}); 
```

### Reduced

While the distinct modifier ensures that duplicates are eliminated from the result set, reduced just allows them to be eliminated. 

```
var myquery3 = new sparqls.Query({reduced: true}); 
```

### Limit

To limit the size of the result set, we use the limit modifier. 

```
var myquery3 = new sparqls.Query({limit: 5}); 
```

By default, a maximum of a hundred entries is returned. 

### Offset

To skip the first five results, you can define an offset:

```
var myquery3 = new sparqls.Query({offset: 5}); 
```

You can also combine these modifiers, e.g. as in 

``` 
var myquery3 = new sparqls.Query({offset: 5, limit: 20, reduced: true, distinct: false}); 
``` 

## Order By 

The query object might be ordered by passing a regular SPARQL command to its order method.

``` 
myquery3.order("ASC(?extendedAlbum)");
``` 

## Filters

To refine your query, you can use filters. These again accept valid SPARQL filter expressions. For example, we could only retain results in which the city contains "New".

```
myquery.filter("regex(?city, 'New')");
```

## Prefixes

Prefixes can be creates as follows:

```
myquery.registerPrefix("dbres","<http://dbpedia.org/resource/>")
```

This important if you use to combine ontologies and query other endpoints than DBpedia. 

## Method Chaining

One of the neat features of the SPARQLing star package is that it allows method chaining, that is you can build up your query in one rush like this:

```
myquery.registerVariable("company", company)
		.registerVariable("city", city) 
		.registerPrefix("dbres","<http://dbpedia.org/resource/>")
		.selection(["company","num"])
		.order("ASC(?num)");
``` 

This sample code is taken from the *companies.js* file. You can find all example code in the *examples* subdirectory of the repository. 

