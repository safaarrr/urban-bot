import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import Pino from "pino";

import { setQR, clearQR } from "./qrManager.js";
import { messageHandler } from "./messageHandler.js";

let sock = null;

export async function connectWhatsApp() {

    const { state, saveCreds } =
        await useMultiFileAuthState("auth");

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

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            console.log("❌ Connection Closed");
            console.log("Reconnect :", shouldReconnect);

            if (shouldReconnect) {
                console.log("🔄 Reconnecting...");
                connectWhatsApp();
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
