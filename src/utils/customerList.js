import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILE_PATH = path.join(__dirname, "../data/customers.json");

export function loadCustomerList() {

    if (!fs.existsSync(FILE_PATH)) {
        console.warn("⚠️ customers.json not found at", FILE_PATH);
        return [];
    }

    const raw = fs.readFileSync(FILE_PATH, "utf-8");

    let list;

    try {
        list = JSON.parse(raw);
    } catch (err) {
        console.error("❌ customers.json is not valid JSON:", err.message);
        return [];
    }

    const seen = new Set();
    const deduped = [];

    for (const entry of list) {

        const cleanPhone = (entry.phone || "").replace(/\D/g, "");

        if (!cleanPhone) continue;

        if (seen.has(cleanPhone)) {
            console.log(`🔁 Duplicate skipped: ${cleanPhone}`);
            continue;
        }

        seen.add(cleanPhone);

        deduped.push({
            name: entry.name || "",
            phone: cleanPhone
        });

    }

    console.log(`📋 Loaded ${deduped.length} unique customers (from ${list.length} entries)`);

    return deduped;

}
