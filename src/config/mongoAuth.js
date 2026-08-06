import makeMongoAuthState from "mongo-baileys";
import { MongoClient } from "mongodb";

let cached = null;

export async function getMongoAuthState() {

    if (cached) return cached;

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    console.log("✅ MongoDB Auth Ready");

    const db = client.db("urban-sync");

    const { state, saveCreds } = await makeMongoAuthState(
        db.collection("baileys_auth")
    );

    cached = { state, saveCreds };
    return cached;
}
