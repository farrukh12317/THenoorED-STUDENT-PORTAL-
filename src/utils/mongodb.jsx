import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client;
let clientPromise;

const options = {
  tls: true,
  tlsInsecure: true,
  family: 4, // Forces IPv4 to bypass local network/DNS SSL routing conflicts
};

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
}

export async function connectToMongoDB() {
  try {
    const connectedClient = await clientPromise;
    const db = connectedClient.db();
    return { client: connectedClient, db };
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
    throw err;
  }
}