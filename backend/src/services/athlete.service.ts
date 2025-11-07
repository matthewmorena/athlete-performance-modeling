import axios from "axios";

const BASE_URL = process.env.SCRAPER_URL || "http://localhost:8000";

export const getAthleteDetails = async (athleteId: number) => {
  const url = `${BASE_URL}/athletes/${athleteId}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching athlete ${athleteId}:`, error.message);
    throw error;
  }
};
