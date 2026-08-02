import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send(`
        <h1>${process.env.BOT_NAME}</h1>
        <p>🚀 WhatsApp Bot is Running...</p>
    `);
});

app.listen(PORT, () => {
    console.log("================================");
    console.log(`${process.env.BOT_NAME} Started`);
    console.log(`Server Running on Port ${PORT}`);
    console.log("================================");
});
