import { useMongoDBAuthState } from "mongo-baileys";
import { MongoClient } from "mongodb";

let cached = null;
let cachedCollection = null;

export async function getMongoAuthState() {

    if (cached) return cached;

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    console.log("✅ MongoDB Auth Ready");

    const db = client.db("urban-sync");
    const collection = db.collection("baileys_auth");
    cachedCollection = collection;

    const { state, saveCreds } = await useMongoDBAuthState(collection);

    cached = { state, saveCreds };
    return cached;
}

export async function clearMongoAuthState() {

    if (cachedCollection) {
        await cachedCollection.deleteMany({});
        console.log("🗑️ Cleared stale MongoDB auth session");
    }

    cached = null;
}
