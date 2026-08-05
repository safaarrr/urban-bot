import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import Pino from "pino";
import { messageHandler } from "./messageHandler.js";
import { setQR, clearQR } from "./qrManager.js";
import { state, saveCreds } from "../config/mongoAuth.js";

let sock = null;

export async function connectWhatsApp() {

    const { version } = await fetchLatestBaileysVersion();

    console.log("📦 Using Baileys Version:", version);

    sock = makeWASocket({

        version,

        auth: state,

        browser: ["Urban Sync", "Chrome", "1.0.0"],

        logger: Pino({
            level: "debug"
        }),

        printQRInTerminal: false

    });

    // Save Credentials
    sock.ev.on("creds.update", saveCreds);

    // Listen for Messages
    sock.ev.on("messages.upsert", async (message) => {
        await messageHandler(sock, message);
    });

    // Connection Events
    sock.ev.on("connection.update", async ({
        connection,
        lastDisconnect,
        qr
    }) => {

        console.log("========== CONNECTION UPDATE ==========");
        console.log("Connection :", connection);
        console.log("QR Exists :", !!qr);
        console.log("Last Error :", lastDisconnect);
        console.log("=======================================");

        // QR Generated
        if (qr) {
            setQR(qr);
            console.log("📱 QR Code Generated");
        }

        // Connected
        if (connection === "open") {

            clearQR();

            console.log("✅ WhatsApp Connected");
            console.log("👤 User :", sock.user);

        }

        // Connection Closed
        if (connection === "close") {

            clearQR();

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            console.log("❌ Connection Closed");
            console.log("Reconnect :", shouldReconnect);

            // Clear old socket
            sock = null;

            if (shouldReconnect) {

                console.log("🔄 Reconnecting in 3 seconds...");

                setTimeout(() => {
                    connectWhatsApp();
                }, 3000);

            } else {

                console.log("🚪 Logged Out");

            }
        }

    });

    return sock;
}

export function getSocket() {
    return sock;
}
