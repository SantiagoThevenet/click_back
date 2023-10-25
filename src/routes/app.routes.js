import { Router } from "express";
import { getAvailableDates } from "../dates.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const availableDates = await getAvailableDates();
        res.json(availableDates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
