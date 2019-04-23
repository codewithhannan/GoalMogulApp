export const config = {
	url: 'https://api.goalmogul.com/api/', // Official endpoint
	// url: 'https://goalmogul-api-dev.herokuapp.com/api/', # Development endpoint
	// url: 'http://192.168.2.174:8081/api/', // # Local endpoint
	socketIOUrl: 'https://api.goalmogul.com/', // 'http://192.168.2.174:8081'

	/**
	 * Print out all log with level that is smaller than the logLevel setting here
	 * 1. Most important message that we shouldn' miss
	 * 2. 
	 * 3. API request should go here
	 * 4. 
	 * 5. Debugging messages
	 * 
	 * When log level is set to 5, it means to show all log messages we have
	 * TODO: wrap console.log with such a logger
	 */
	logLevel: 1
};
