import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/api", apiRoutes);

// Dashboard
app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

export default app;
