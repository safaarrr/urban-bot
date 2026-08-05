import { MongoClient } from "mongodb";
import { useMongoDBAuthState } from "mongo-baileys";

const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();

const db = client.db("urban-sync");

const collection = db.collection("baileys_auth");

export const { state, saveCreds } =
    await useMongoDBAuthState(collection);

console.log("✅ MongoDB Auth Ready");
