var buildList =  [
	{
		id: "Tenrox-R1_1235",
		status: "pending",
		type: "build",
		firewalls: [
			{
				id: 432462,
				owner: "jtuck",
				timeStarted: "4/18/2014 10:53am",
				status: "pending",
				type: "firewall",
				jobs: {
					metrics: {
						estimatedTime: 92
					},
					build: {
						estimatedTime: 120
					},
					unitTest: {
						estimatedTime: 140
					},
					functionalTest: {
						estimatedTime: 60
					}
				}
			},
			{
				id: 432461,
				owner: "samy",
				timeStarted: "4/18/2014 10:53am",
				status: "pending",
				type: "firewall",
				jobs: {
					metrics: {
						estimatedTime: 2
					},
					build: {
						estimatedTime: 4
					},
					unitTest: {
						estimatedTime: 8
					},
					functionalTest: {
						estimatedTime: 10
					}
				}
			}
		]
	},

	{
		id: "Tenrox-R1_1230",
		status: "pending",
		type: "build",
		firewalls: [
			{
				id: 432422,
				owner: "jtuck",
				timeStarted: "4/18/2014 10:53am",
				status: "pending",
				type: "firewall",
				jobs: {
					metrics: {
						estimatedTime: 21
					},
					build: {
						estimatedTime: 68
					},
					unitTest: {
						estimatedTime: 45
					},
					functionalTest: {
						estimatedTime: 100
					}
				}
			},
			{
				id: 432423,
				owner: "samy",
				timeStarted: "4/18/2014 10:53am",
				status: "pending",
				type: "firewall",
				jobs: {
					metrics: {
						estimatedTime: 12
					},
					build: {
						estimatedTime: 47
					},
					unitTest: {
						estimatedTime: 25
					},
					functionalTest: {
						estimatedTime: 20
					}
				}
			}
		]
	}
];

var buildItemResults = {
	metrics: {
		text: 'Metrics results'
	},
	build: {
		text: 'Build results'
	},
	unitTest: {
		text: 'Unit test results'
	},
	functionalTest: {
		text: 'Functional test results'
	}
}; 