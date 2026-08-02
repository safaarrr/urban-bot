import { Router } from "express";
import { generatePairingCode } from "../bot/session.js";
import { getSocket } from "../bot/connect.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| GET /api/status
|--------------------------------------------------------------------------
*/

router.get("/status", (req, res) => {

    const sock = getSocket();

    res.json({
        connected: !!sock,
        number: sock?.user?.id || null
    });

});

/*
|--------------------------------------------------------------------------
| GET /api/qr
|--------------------------------------------------------------------------
*/

router.get("/qr", async (req, res) => {

    try {

        res.json({
            success: true,
            message: "QR will appear automatically when the bot starts if it is not paired."
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

/*
|--------------------------------------------------------------------------
| POST /api/pair
|--------------------------------------------------------------------------
*/

router.post("/pair", async (req, res) => {

    try {

        const { phone } = req.body;

        if (!phone) {

            return res.status(400).json({
                success: false,
                message: "Phone number is required."
            });

        }

        const code = await generatePairingCode(phone);

        res.json({
            success: true,
            code
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});

export default router;
