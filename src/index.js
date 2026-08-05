import dotenv from "dotenv";
import { connectWhatsApp } from "./bot/connect.js";
import app from "./app.js";
import connectDatabase from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log("==================================");
    console.log(`🚀 ${process.env.BOT_NAME} Started`);
    console.log(`🌐 Server : http://localhost:${PORT}`);
    console.log("==================================");

    await connectDatabase();
    connectWhatsApp();
});
