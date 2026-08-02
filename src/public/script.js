const status = document.getElementById("status");
const number = document.getElementById("number");
const logs = document.getElementById("logs");

const qrBtn = document.getElementById("qrBtn");
const pairBtn = document.getElementById("pairBtn");

// Check Bot Status
async function getStatus() {
    try {
        const response = await fetch("/api/status");
        const data = await response.json();

        status.innerHTML = data.connected
            ? "🟢 Connected"
            : "🔴 Disconnected";

        number.innerHTML = data.number || "Not Connected";

    } catch (err) {
        console.log(err);
    }
}

// Generate QR
qrBtn.addEventListener("click", async () => {

    logs.innerHTML = "Generating QR Code...";

    const response = await fetch("/api/qr");

    const data = await response.json();

    logs.innerHTML = data.message;

});

// Pair by Phone Number
pairBtn.addEventListener("click", async () => {

    const phone = prompt("Enter WhatsApp Number");

    if (!phone) return;

    logs.innerHTML = "Generating Pairing Code...";

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

    logs.innerHTML =
        "Pairing Code : " + data.code;

});

// Refresh every 3 seconds
setInterval(getStatus, 3000);

getStatus();
