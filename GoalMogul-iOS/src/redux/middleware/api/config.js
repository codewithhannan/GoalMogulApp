export const config = {
	url: 'https://api.goalmogul.com/api/', // Official endpoint
	// url: 'http://192.168.2.174:8081/api/', // # Local endpoint
	socketIOUrl: 'https://api.goalmogul.com/',
	// socketIOUrl: 'http://192.168.2.174:8081', // # Local

	/**
	 * Print out all log with level that is smaller than the logLevel setting here
	 * 1. Most important message that we shouldn' miss
	 * 2. Typical debugging message
	 * 3. API request should go here
	 * 4. 
	 * 5. Timer firing message
	 * 
	 * When log level is set to 5, it means to show all log messages we have
	 * TODO: wrap console.log with such a logger
	 */
	logLevel: 1
};
