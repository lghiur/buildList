/*global buildApp, buildList, buildItemResults*/
buildApp.run(['$httpBackend', function($httpBackend) { 
	$httpBackend.whenGET('/buildList').respond(buildList); 
	$httpBackend.whenGET('/buildList/item').respond(buildItemResults);
}]); 