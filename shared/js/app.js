/*global angular*/

var buildApp = angular.module('buildApp',[]);
buildApp.config(function($provide) {
	$provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
}); 