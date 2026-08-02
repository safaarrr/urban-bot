const status = document.getElementById("status");
const number = document.getElementById("number");
const logs = document.getElementById("logs");

const qrBtn = document.getElementById("qrBtn");
const pairBtn = document.getElementById("pairBtn");

// ----------------------------
// Bot Status
// ----------------------------

async function getStatus() {

    try {

        const response = await fetch("/api/status");

        const data = await response.json();

        status.innerHTML = data.connected
            ? "🟢 Connected"
            : "🔴 Disconnected";

        number.innerHTML =
            data.number || "Not Connected";

    } catch (err) {

        console.error(err);

    }

}

// ----------------------------
// Generate QR
// ----------------------------

qrBtn.addEventListener("click", async () => {

    logs.innerHTML = "Generating QR Code...";

    try {

        const response = await fetch("/api/qr");

        const data = await response.json();

        if (!data.success) {

            logs.innerHTML = data.message;

            return;

        }

        logs.innerHTML = `
            <img
                src="${data.qr}"
                alt="QR Code"
                width="250"
            />
        `;

    } catch (err) {

        logs.innerHTML = err.message;

    }

});

// ----------------------------
// Pair by Phone Number
// ----------------------------

pairBtn.addEventListener("click", async () => {

    const phone = prompt(
        "Enter WhatsApp Number\nExample: 919876543210"
    );

    if (!phone) return;

    logs.innerHTML = "Generating Pairing Code...";

    try {

        const response = await fetch("/api/pair", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                phone
            })

        });

        const data = await response.json();

        if (!data.success) {

            logs.innerHTML = data.message;

            return;

        }

        logs.innerHTML = `
            <h2>Pairing Code</h2>

            <h1>${data.code}</h1>

            <p>
                Open WhatsApp →
                Linked Devices →
                Link with Phone Number →
                Enter this code.
            </p>
        `;

    } catch (err) {

        logs.innerHTML = err.message;

    }

});

// ----------------------------
// Refresh Status
// ----------------------------

setInterval(getStatus, 3000);

getStatus();
