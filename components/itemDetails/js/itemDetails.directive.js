/*global buildApp*/
buildApp.directive('itemDetails', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
    	'itemData': '=' 
    },
    templateUrl: 'itemDetails/html/default.tmpl'
  };
}); 