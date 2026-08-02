import mongoose from "mongoose";

export async function connectDatabase() {

    try {

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ MongoDB Connected");

    } catch (err) {

        console.error("❌ MongoDB Connection Failed");

        console.error(err);

        process.exit(1);

    }

}
