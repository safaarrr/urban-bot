import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

let collection = null;

export async function getAuthCollection() {
    if (!collection) {
        await client.connect();

        const db = client.db("whatsapp");
        collection = db.collection("authState");

        console.log("✅ Mongo Auth Ready");
    }

    return collection;
}
