import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import Pino from "pino";
import { messageHandler } from "./messageHandler.js";
import { setQR, clearQR } from "./qrManager.js";

let sock = null;

export async function connectWhatsApp() {

    const { state, saveCreds } =
        await useMultiFileAuthState("auth");

    const { version } =
        await fetchLatestBaileysVersion();

    sock = makeWASocket({

        version,

        auth: state,

        browser: ["Urban Sync", "Chrome", "1.0.0"],

        logger: Pino({
            level: "silent"
        }),

        printQRInTerminal: false

    });

    // Save Session
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

        if (qr) {

            setQR(qr);

            console.log("📱 QR Code Generated");

        }

        if (connection === "open") {

            clearQR();

            console.log("✅ WhatsApp Connected");
            console.log("👤", sock.user);

        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            if (shouldReconnect) {

                console.log("🔄 Reconnecting...");

                connectWhatsApp();

            } else {

                console.log("❌ Logged Out");

            }

        }

    });

    return sock;

}

export function getSocket() {

    return sock;

}
