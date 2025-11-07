import { Router } from "express";
import { searchTfrrs } from "../services/search.service";

const router = Router();

/**
 * @route GET /search?query_type=team&query=Northern%20Arizona
 */
router.get("/", async (req, res) => {
  const { query_type, query } = req.query;

  if (!query_type || !query) {
    return res.status(400).json({ error: "Missing required parameters: type and query" });
  }

  try {
    const data = await searchTfrrs(query_type as string, query as string);
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

export default router;
