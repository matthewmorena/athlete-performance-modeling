import axios from "axios";

export async function getMeetResults(meetId: number, sport: string, gender: string) {
  const scraperUrl = process.env.SCRAPER_URL || "http://localhost:8000";
  const url = `${scraperUrl}/meets/${meetId}?sport=${sport}&gender=${gender}`;

  const response = await axios.get(url);
  return response.data;
}
