/*global buildApp*/
buildApp.controller('mainController', ['$scope', '$rootScope', function ($scope, $rootScope) {

	function init() {
		bindEvents();
	}

	function bindEvents() {
		$rootScope.$on('modal:open', function() { 
			$scope.modalOpened = true; 
		});

		$rootScope.$on('modal:closed', function() { 
			$scope.modalOpened = false; 
		});
	}

  init();
}]);