/*global buildApp, angular*/
buildApp.directive('buildItem', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: {
    	'itemType': '=',
    	'onExpand': '=',
    	'ngModel': '=' 
    }, 
    templateUrl: 'buildItem/html/default.tmpl',
    link: function(scope) {


      /**
      * Expands the results of a build or firewall item. When one opens the other one are closing
      * @method expandItem
      * @param  {id} item id of Item we want to open
      */
    	function expandItem (id) {
    		angular.forEach(scope.ngModel, function(value) {
  				value.expanded = (value.id === id);
  				angular.forEach(value.firewalls, function(vvalue) {
  					vvalue.expanded = (vvalue.id === id);
  				});
    		});
    	}

    /**
     * This is called when details about a specific build or firewall are requested
     * @method displayResults
     * @param  {Object} item Item for which details are requested
     */
      scope.displayResults = function(item) {
        if (item.results && item.expanded) {
          item.expanded = false;
          return;
        }

        if (scope.onExpand(item)) {
          expandItem(item.id);
        } else {
          var modalMessage = item.type + ' (' + item.id + ') is currently ' + item.status;
          scope.$emit('modal:open', {
            message: modalMessage
          });
        }
      }; 
    
    }
  };
});