import makeWASocket, {
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";

import Pino from "pino";

let sock = null;

export async function connectWhatsApp() {

    const { state, saveCreds } =
        await useMultiFileAuthState("auth");

    const { version } =
        await fetchLatestBaileysVersion();

    sock = makeWASocket({

        version,

        auth: state,

        logger: Pino({
            level: "silent"
        }),

        printQRInTerminal: true

    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update",
        ({ connection, lastDisconnect }) => {

            if (connection === "open") {

                console.log("✅ WhatsApp Connected");

            }

            if (connection === "close") {

                const shouldReconnect =
                    lastDisconnect?.error?.output?.statusCode !==
                    DisconnectReason.loggedOut;

                if (shouldReconnect) {

                    console.log("🔄 Reconnecting...");

                    connectWhatsApp();

                }

            }

        });

    return sock;

}

export function getSocket() {

    return sock;

}
