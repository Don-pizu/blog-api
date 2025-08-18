// tests/setup.js

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();

  const uri = mongo.getUri();
    await mongoose.connect(uri);
}, 300000); // allow up to 5 min for binary spin-up

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
  if (mongo) 
    await mongo.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
