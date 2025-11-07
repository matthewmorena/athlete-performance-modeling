import { Router } from "express";
import { getAthleteDetails } from "../services/athlete.service";

const router = Router();

router.get("/:athleteId", async (req, res) => {
  const { athleteId } = req.params;

  try {
    const data = await getAthleteDetails(Number(athleteId));
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch athlete data" });
  }
});

export default router;
