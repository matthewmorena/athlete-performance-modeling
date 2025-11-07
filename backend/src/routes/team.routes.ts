import { Router } from "express";
import { getTeamRoster } from "../services/team.service";

const router = Router();

/**
 * @route GET /api/teams/:teamSlug?sport=tf
 * @desc  Fetch team roster data (XC or TF)
 */
router.get("/:teamSlug", async (req, res) => {
  const { teamSlug } = req.params;
  const { sport = "tf" } = req.query; // default to track & field

  try {
    const data = await getTeamRoster(teamSlug as string, sport as string);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch team data" });
  }
});

export default router;
