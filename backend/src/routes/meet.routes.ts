import { Router } from "express";
import { getMeetResults } from "../services/meet.service";

const router = Router();

router.get("/:meetId", async (req, res) => {
  const { meetId } = req.params;
  const { sport = "tf", gender = "m" } = req.query;

  try {
    const data = await getMeetResults(Number(meetId), sport as string, gender as string);
    res.json(data);
  } catch (err) {
    console.error("Error fetching meet results:", err);
    res.status(500).json({ error: "Failed to fetch meet data" });
  }
});

export default router;
