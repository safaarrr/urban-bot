import { getSocket } from "./connect.js";

export async function generatePairingCode(phoneNumber) {

    const sock = getSocket();

    if (!sock) {
        throw new Error("WhatsApp not connected.");
    }

    const code = await sock.requestPairingCode(phoneNumber);

    return code;

}
