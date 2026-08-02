import { Router } from "express";

const router = Router();

// Bot Status
router.get("/status", (req, res) => {

    res.json({
        connected: false,
        number: null
    });

});

// Generate QR
router.get("/qr", async (req, res) => {

    res.json({
        success: true,
        message: "QR Code will be generated here."
    });

});

// Pair with Phone Number
router.post("/pair", async (req, res) => {

    const { phone } = req.body;

    if (!phone) {

        return res.status(400).json({
            success: false,
            message: "Phone number required"
        });

    }

    res.json({

        success: true,

        code: "ABCD-EFGH"

    });

});

export default router;
