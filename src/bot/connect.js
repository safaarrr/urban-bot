import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import Pino from "pino";

import { setQR, clearQR } from "./qrManager.js";
import { messageHandler } from "./messageHandler.js";
import { getMongoAuthState, clearMongoAuthState } from "../config/mongoAuth.js";

let sock = null;
let connectionState = "close";

export async function connectWhatsApp() {

    const { state, saveCreds } = await getMongoAuthState();

    const { version } =
        await fetchLatestBaileysVersion();

    console.log("📦 Using Baileys Version:", version);

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        browser: ["Urban Sync", "Chrome", "1.0.0"],
        logger: Pino({
            level: "silent"
        })
    });

    sock.ev.on("creds.update", async () => {
        await saveCreds();
        console.log("💾 Session Saved");
    });

    sock.ev.on("messages.upsert", async (message) => {
        await messageHandler(sock, message);
    });

    sock.ev.on("connection.update", async ({
        connection,
        qr,
        lastDisconnect
    }) => {

        console.log("========== CONNECTION UPDATE ==========");
        console.log("Connection :", connection);
        console.log("QR Exists :", !!qr);
        console.log("Last Error :", lastDisconnect);
        console.log("=======================================");

        if (connection) {
            connectionState = connection;
        }

        if (qr) {
            setQR(qr);
            console.log("📱 QR Code Generated");
        }

        if (connection === "open") {
            clearQR();
            console.log("✅ WhatsApp Connected");
            console.log("👤 User :", sock.user);
        }

        if (connection === "close") {

            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

            console.log("❌ Connection Closed");
            console.log("Reconnect :", shouldReconnect);

            if (shouldReconnect) {
                console.log("🔄 Reconnecting...");
                connectWhatsApp();
            } else {
                console.log("🚪 Logged Out — clearing stale session");
                await clearMongoAuthState();
                sock = null;
                connectionState = "close";
            }
        }
    });

    return sock;
}

export function getSocket() {
    return sock;
}

export function isConnected() {
    return connectionState === "open" && !!sock?.user;
}
