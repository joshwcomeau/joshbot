import { MongoClient } from 'mongodb';

let uri = process.env.MONGODB_URI;
let dbName = process.env.MONGODB_DB;
let cachedClient = null;
let cachedDb = null;

if (!uri) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

if (!dbName) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo;

if (!cached) {
  cached = global.mongo = { client: null, db: null, promise: null };
}

export default async function connectToDatabase() {
  function closeConnection() {
    if (cached.client) {
      cached.client.close();
      cached = { client: null, db: null, promise: null };
    }
  }

  if (cached.client) {
    return cached;
  }

  if (!cached.promise) {
    cached.promise = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  cached.client = await cached.promise;

  cached.db = await cached.client.db(dbName);

  cached.closeConnection = closeConnection;

  return cached;
}
