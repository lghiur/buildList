/*global buildApp, angular*/
buildApp.controller('buildListController', ['$scope', '$q', '$interval', 'buildListService', function ($scope, $q, $interval, buildListService) {
	
	var deferred = $q.defer(),
		updateBuildsInterval,
		intervalTime = 5000,
		timeElapsed = 0;

	function init() {
				getData();
		$q.when(deferred.promise, function() {
			updateBuildsInterval = $interval(updateBuildsList, intervalTime);
		});
	}

	function getData() {
		return buildListService.getData().then(function(response) { 
								$scope.buildList = response.data;
			deferred.resolve();
		});

		return;
	}

	function getData() {
		return buildListService.getData().then(function(response) { 
								$scope.buildList = response.data;
			deferred.resolve();
		});
	}
	
	$scope.displayResults = function(item) {
		if (item.status !== 'complete' && item.status !== 'rejected') {
			return false;
		}

		buildListService.getResults(item.id).then(function(response) {
			item.results = response.data;
		});

		return true;
	};
	function setStatusOnJob(job, percentage) {
		if (percentage >= 100) {
			var random = Math.round(Math.random());
			job.status = (random) ? 'complete' : 'rejected';
			job.percentage = 100;
			return;
		}

		job.status = 'running';
		job.percentage = percentage; 
	}

	/**
	 * Sets the status of a process after analysing the states of its children
	 * @method setStatusOfProcess
	 * @param {Array} statesArr states array of the children of the process
	 */
	function setStatusOfProcess(statesArr) { 
		var state;

		if (statesArr.indexOf('running') > -1) {
			state = 'running';
		} else if (statesArr.indexOf('rejected') > -1) {
			state = 'rejected';
		} else {
			state = 'complete';
		}

		return state;
	}

	/**
	 * Updates the job state and completeness percentage, based on it's estimated time
	 * @method updateJob
	 * @param  {Object} job Job object that is analysed
	 * @param  {Object} defered
	 */
	function updateJob(job, defered) {
		if (job.status === 'complete' || job.status === 'rejected') {
			defered.resolve(job.status);
			return;
		}

		var estimatedTime = job.estimatedTime * 1000;
		var percentage = parseInt((timeElapsed * 100) / estimatedTime, 10);

		setStatusOnJob(job, percentage);
		defered.resolve(job.status);
	}

	/**
	 * Updates the firewall status
	 * @method updateFirewall
	 * @param  {Object} firewall Firewall that is analysed, for each firewall all it's jobs are requested to be updated
	 * @param  {Object} firewallDefered
	 */
	function updateFirewall(firewall, firewallDefered) {
		if (firewall.status === 'complete' || firewall.status === 'rejected') {
			firewallDefered.resolve();
			return;
		}

		var jobsDeferals = [],
			jobsStates = [];
		firewall.status = 'running';

		angular.forEach(firewall.jobs, function(job) {
			var jDefered = $q.defer();
			jobsDeferals.push(jDefered.promise);
			updateJob(job, jDefered);
		});

		//update firewall information after all its jobs have been updated
		$q.all(jobsDeferals).then(function() {

			angular.forEach(firewall.jobs, function(job) {
				jobsStates.push(job.status);
			});

			firewall.status = setStatusOfProcess(jobsStates);
			firewallDefered.resolve(); 
		});
	}

	/**
	 * Updates the build status
	 * @method updateBuild
	 * @param  {Object} build Build that is analysed, for each build all its firewalls are requested to be updated
	 * @param  {Object} firewallDefered
	 */
	function updateBuild(build, buildDefered) {

		if (build.status === 'complete' || build.status === 'rejected') {
			buildDefered.resolve();
			return;
		}

		var firewallsPromises = [];

		angular.forEach(build.firewalls, function(firewall) {
			var firewallDefered = $q.defer();
			firewallsPromises.push(firewallDefered.promise);
			updateFirewall(firewall, firewallDefered); 
		});

		//update build information after all its firewalls have been updated
		$q.all(firewallsPromises).then(function() {
			var fStates = [];

			var buildJobs = {
				metrics: {
					percentage: 0,
					status: []
				},
				build: {
					percentage: 0,
					status: []
				},
				unitTest: {
					percentage: 0,
					status: []
				},
				functionalTest: {
					percentage: 0,
					status: []
				}
			};

			angular.forEach(build.firewalls, function(firewall) {
				fStates.push (firewall.status);
				angular.forEach(firewall.jobs, function(job, jobName) {
					buildJobs[jobName].percentage += job.percentage;
					buildJobs[jobName].status.push(job.status);
				});
			});

			angular.forEach(buildJobs, function(value) {
				value.percentage = parseInt(value.percentage / build.firewalls.length, 10);
				value.status = setStatusOfProcess(value.status);
			});

			build.jobs = buildJobs;
			build.status = setStatusOfProcess(fStates);
			buildDefered.resolve();
		});
	}


	/**
	 * Starts to calculate the states of the builds.
	 * @method updateBuildsList
	 */
	function updateBuildsList() {

		timeElapsed += intervalTime;
		var overallStatus = 'running';
		var buildPromises = [];

		angular.forEach($scope.buildList, function(build) {
			var buildDefered = $q.defer();
			buildPromises.push(buildDefered.promise);
			updateBuild(build, buildDefered);
		});

		$q.all(buildPromises).then(function() {
			var buildStates = [];

			angular.forEach($scope.buildList, function(build) {
				buildStates.push (build.status);
			});

			overallStatus = setStatusOfProcess(buildStates);
			if (overallStatus === 'complete' || overallStatus === 'rejected') {
				$interval.cancel(updateBuildsInterval);
			}
		});
	}

	init();
}]).controller('buildListController', ['$scope', '$q', '$interval', 'buildListService', function ($scope, $q, $interval, buildListService) {
	
	var deferred = $q.defer(),
		updateBuildsInterval,
		intervalTime = 5000,
		timeElapsed = 0;

	/**
	 * Initializes the functionality of this controller
	 *  - requests the data
	 *  - starts to calculate all the processes
	 * @method init
	 */
	function init() {
		getData();
		$q.when(deferred.promise, function() {
			updateBuildsInterval = $interval(updateBuildsList, intervalTime);
		});
	}

	/**
	 * Requests for the build list data
	 * @method getData
	 */
	function getData() {
		return buildListService.getData().then(function(response) { 
			$scope.buildList = response.data;
			deferred.resolve();
		});
	}

	/**
	 * This is called when details about a specific build or firewall are requested
	 *  - if the build status is not complete or rejected then we can't display the results
	 * @method displayResults
	 * @param  {Object} item Item for which details are requested
	 * @return {Boolean} if status of item is not complete or rejected, false value is returned otherwise true
	 */
	$scope.displayResults = function(item) {
		if (item.status !== 'complete' && item.status !== 'rejected') {
			return false;
		}

		buildListService.getResults(item.id).then(function(response) {
			item.results = response.data;
		});

		return true;
	};

	/**
	 * Establishes the status of a specific job (metrics, build, unit test, functional test)
	 * - if the completness percentage it's greater or equal with 100% then a request to the server 
	 * 	 should have been made in order to establish the final status (I choosed randomly between complete and rejected)
	 * - if the completnees percentage it's smaller than 100, 'running' status is returned
	 * @method setStatusOnJob
	 * @param {Object} job object containing information about the job (percentage, status)
	 * @param {Number} percentage
	 */
	function setStatusOnJob(job, percentage) {
		if (percentage >= 100) {
			var random = Math.round(Math.random());
			job.status = (random) ? 'complete' : 'rejected';
			job.percentage = 100;
			return;
		}

		job.status = 'running';
		job.percentage = percentage; 
	}

	/**
	 * Sets the status of a process after analysing the states of its children
	 * @method setStatusOfProcess
	 * @param {Array} statesArr states array of the children of the process
	 */
	function setStatusOfProcess(statesArr) { 
		var state;

		if (statesArr.indexOf('running') > -1) {
			state = 'running';
		} else if (statesArr.indexOf('rejected') > -1) {
			state = 'rejected';
		} else {
			state = 'complete';
		}

		return state;
	}

	/**
	 * Updates the job state and completeness percentage, based on it's estimated time
	 * @method updateJob
	 * @param  {Object} job Job object that is analysed
	 * @param  {Object} defered
	 */
	function updateJob(job, defered) {
		if (job.status === 'complete' || job.status === 'rejected') {
			defered.resolve(job.status);
			return;
		}

		var estimatedTime = job.estimatedTime * 1000;
		var percentage = parseInt((timeElapsed * 100) / estimatedTime, 10);

		setStatusOnJob(job, percentage);
		defered.resolve(job.status);
	}

	/**
	 * Updates the firewall status
	 * @method updateFirewall
	 * @param  {Object} firewall Firewall that is analysed, for each firewall all it's jobs are requested to be updated
	 * @param  {Object} firewallDefered
	 */
	function updateFirewall(firewall, firewallDefered) {
		if (firewall.status === 'complete' || firewall.status === 'rejected') {
			firewallDefered.resolve();
			return;
		}

		var jobsDeferals = [],
			jobsStates = [];
		firewall.status = 'running';

		angular.forEach(firewall.jobs, function(job) {
			var jDefered = $q.defer();
			jobsDeferals.push(jDefered.promise);
			updateJob(job, jDefered);
		});

		//update firewall information after all its jobs have been updated
		$q.all(jobsDeferals).then(function() {

			angular.forEach(firewall.jobs, function(job) {
				jobsStates.push(job.status);
			});

			firewall.status = setStatusOfProcess(jobsStates);
			firewallDefered.resolve(); 
		});
	}

	/**
	 * Updates the build status
	 * @method updateBuild
	 * @param  {Object} build Build that is analysed, for each build all its firewalls are requested to be updated
	 * @param  {Object} firewallDefered
	 */
	function updateBuild(build, buildDefered) {

		if (build.status === 'complete' || build.status === 'rejected') {
			buildDefered.resolve();
			return;
		}

		var firewallsPromises = [];

		angular.forEach(build.firewalls, function(firewall) {
			var firewallDefered = $q.defer();
			firewallsPromises.push(firewallDefered.promise);
			updateFirewall(firewall, firewallDefered); 
		});

		//update build information after all its firewalls have been updated
		$q.all(firewallsPromises).then(function() {
			var fStates = [];

			var buildJobs = {
				metrics: {
					percentage: 0,
					status: []
				},
				build: {
					percentage: 0,
					status: []
				},
				unitTest: {
					percentage: 0,
					status: []
				},
				functionalTest: {
					percentage: 0,
					status: []
				}
			};

			angular.forEach(build.firewalls, function(firewall) {
				fStates.push (firewall.status);
				angular.forEach(firewall.jobs, function(job, jobName) {
					buildJobs[jobName].percentage += job.percentage;
					buildJobs[jobName].status.push(job.status);
				});
			});

			angular.forEach(buildJobs, function(value) {
				value.percentage = parseInt(value.percentage / build.firewalls.length, 10);
				value.status = setStatusOfProcess(value.status);
			});

			build.jobs = buildJobs;
			build.status = setStatusOfProcess(fStates);
			buildDefered.resolve();
		});
	}


	/**
	 * Starts to calculate the states of the builds.
	 * @method updateBuildsList
	 */
	function updateBuildsList() {

		timeElapsed += intervalTime;
		var overallStatus = 'running';
		var buildPromises = [];

		angular.forEach($scope.buildList, function(build) {
			var buildDefered = $q.defer();
			buildPromises.push(buildDefered.promise);
			updateBuild(build, buildDefered);
		});

		$q.all(buildPromises).then(function() {
			var buildStates = [];

			angular.forEach($scope.buildList, function(build) {
				buildStates.push (build.status);
			});

			overallStatus = setStatusOfProcess(buildStates);
			if (overallStatus === 'complete' || overallStatus === 'rejected') {
				$interval.cancel(updateBuildsInterval);
			}
		});
	}

	init();
}]);