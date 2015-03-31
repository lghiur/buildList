/*global buildApp*/
buildApp.directive('buildList', function () {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'buildList/html/default.tmpl'
  };
});