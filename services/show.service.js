"use strict";

// const { ServiceBroker } = require("moleculer");
// let broker = new ServiceBroker();


module.exports = {
	name: "show",

	/**
	 * Service settings
	 */
	settings: {

	},

	/**
	 * Service dependencies
	 */
	dependencies: [
		// "greeter"
	],

	/**
	 * Actions
	 */
	actions: {
		good() {
			console.log("good");
		}
	},

	/**
	 * Events
	 */
	events: {
		"hello.called"(payload) {
			console.log("Event caught!");
			console.log(payload);
		}
	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		console.log("show created");
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {
        console.log("show started");
    },

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {
        console.log("show stopped");
    }
};
// broker.waitForServices("greeter", 10000).then(() => {
//     broker.loadService("show");
//     console.log('myau');
//     // Called after the `posts` & `users` services are available
// });
