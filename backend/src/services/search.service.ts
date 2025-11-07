import axios from "axios";

const BASE_URL = process.env.SCRAPER_URL || "http://localhost:8000";

/**
 * Call the FastAPI /search endpoint.
 */
export const searchTfrrs = async (type: string, query: string) => {
  const url = `${BASE_URL}/search?query_type=${type}&query=${encodeURIComponent(query)}`;
  const response = await axios.get(url);
  return response.data;
};
