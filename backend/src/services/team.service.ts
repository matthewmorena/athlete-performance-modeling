import axios from "axios";

const BASE_URL = process.env.SCRAPER_URL || "http://localhost:8000";

/**
 * Fetch a team roster from the Python scraper API
 */
export const getTeamRoster = async (teamSlug: string, sport: string = "tf") => {
  const url = `${BASE_URL}/teams/${teamSlug}?sport=${sport}`;
  const response = await axios.get(url);
  return response.data;
};
