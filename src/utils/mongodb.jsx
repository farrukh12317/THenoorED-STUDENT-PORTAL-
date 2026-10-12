// lib/mongodb.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const isDev = process.env.NODE_ENV === 'development';

const options = {
  family: 4,
  maxPoolSize: 10,                 // cap connections per instance
  serverSelectionTimeoutMS: 5000,  // fail fast instead of hanging
  // Local debugging only. Remove once the SSL issue is fixed:
  ...(isDev ? { tlsInsecure: true } : {}),
};

function createClientPromise() {
  const client = new MongoClient(MONGODB_URI, options);
  return client.connect().catch((err) => {
    // allow a retry on the next call instead of caching the failure
    global._mongoClientPromise = undefined;
    throw err;
  });
}

// Use the global in all environments so there is one client per process
if (!global._mongoClientPromise) {
  global._mongoClientPromise = createClientPromise();
}

export async function connectToMongoDB() {
  const client = await global._mongoClientPromise;
  return { client, db: client.db() };
}