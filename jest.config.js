// jest.config.js

module.exports = {
	testEnvironment: 'node',

  	// Spins up in-memory Mongo & connects Mongoose
  	setupFilesAfterEnv: ['./tests/setup.js'],
  	testTimeout: 10000,
};