/*global buildApp*/
buildApp.directive('modal',['$rootScope', '$document', function ($rootScope, $document) {
	return {
		restrict: 'E',
		replace: true, 
		scope: {
			modalOpened: '=',
			textMessage: '='
		},
		templateUrl: 'modal/html/default.tmpl',
		link: function(scope) {

			/**
			 * Closes the dialog box and all events attached on $document are removed
			 * @method closeModal
			 */
			scope.closeModal = function() {
				scope.modalOpened = false;
				scope.$emit('modal:closed');
				unBindEvents();
			};

			/**
			 * Opens the dialog box
			 * @method openModal
			 */
			scope.openModal = function(message) {
				scope.modalOpened = true;
				scope.textMessage = message;
				bindEvents();
			};

			/**
			 * Binds the events needed for the dialog box
			 * @method bindEvents
			 */
			function bindEvents() {

				//attach event on esc key
				$document.on('keyup', function(e) {
					if (e.keyCode === 27) {
						scope.closeModal();
						scope.$apply();
					}
				});
			}

			function unBindEvents() {
				$document.off('keyup');
			}

			$rootScope.$on('modal:open', function(e, data) {
				scope.openModal(data.message);
			});
		}
	};
}]);