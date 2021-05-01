import connectToDatabase from '../../src/database';

export default async function resetDatabase() {
  const { db, closeConnection } = await connectToDatabase();

  try {
    const collection = db.collection('discord-members');
    await collection.drop();
  } catch (err) {
    // no-op; The operation will fail if the collection doesn't exist,
    // but we don't care.
    console.warn('Probably nothing, but error: ', err);
  } finally {
    await db.createCollection('discord-members');
  }

  // Kill the connection
  try {
    closeConnection();
  } catch (err) {
    console.error(err);
  }

  return null;
}
