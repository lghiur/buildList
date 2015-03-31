/*global buildApp, console*/
buildApp.factory('buildListService', function($http) { 

  var buildListAPI = {};

  buildListAPI.getData = function() {
		return $http.get('/buildList');
  };

  buildListAPI.getResults = function(id) {
  	console.log(id);
  	return $http.get('/buildList/item');
  };

	return buildListAPI; 
});