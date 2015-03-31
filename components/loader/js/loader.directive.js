/*global buildApp*/
buildApp.directive('loader', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
    	itemJobs: '='
    },
    templateUrl: 'loader/html/default.tmpl'
  };
});