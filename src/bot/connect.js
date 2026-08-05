import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import Pino from "pino";

import { state, saveCreds } from "../config/mongoAuth.js";
import { setQR, clearQR } from "./qrManager.js";
import { messageHandler } from "./messageHandler.js";

let sock;

export async function connectWhatsApp() {

    const { version } = await fetchLatestBaileysVersion();

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        browser: ["Urban Sync", "Chrome", "1.0.0"],
        logger: Pino({ level: "silent" })
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
        await messageHandler(sock, m);
    });

    sock.ev.on("connection.update", async ({
        connection,
        qr,
        lastDisconnect
    }) => {

        if (qr) {
            setQR(qr);
            console.log("✅ QR Generated");
        }

        if (connection === "open") {
            clearQR();
            console.log("✅ WhatsApp Connected");
        }

        if (connection === "close") {

            const shouldReconnect =
                lastDisconnect?.error?.output?.statusCode !==
                DisconnectReason.loggedOut;

            if (shouldReconnect) {
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
