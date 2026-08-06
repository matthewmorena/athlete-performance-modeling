import MarketDashboard from "@/components/MarketDashboard";
import {
  buildFeaturedAthlete,
  FEATURED_ATHLETE_IDS,
} from "@/lib/featuredAthletes";
import type { AthleteDetail, FeaturedAthlete } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getAthlete(id: string): Promise<AthleteDetail | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/athletes/${id}`, {
      next: { revalidate: 15 * 60 },
    });

    if (!response.ok) {
      console.error(`Featured athlete ${id} returned ${response.status}`);
      return null;
    }

    return (await response.json()) as AthleteDetail;
  } catch (error) {
    console.error(`Featured athlete ${id} fetch failed:`, error);
    return null;
  }
}

async function getFeaturedAthletes(): Promise<{
  athletes: FeaturedAthlete[];
  failedCount: number;
}> {
  const records = await Promise.all(
    FEATURED_ATHLETE_IDS.map(async (id) => {
      const athlete = await getAthlete(id);
      if (!athlete) return null;
      return buildFeaturedAthlete(id, athlete);
    }),
  );

  const athletes = records.filter(
    (athlete): athlete is FeaturedAthlete => athlete !== null,
  );

  return {
    athletes,
    failedCount: FEATURED_ATHLETE_IDS.length - athletes.length,
  };
}

export default async function Home() {
  const { athletes, failedCount } = await getFeaturedAthletes();
  return <MarketDashboard athletes={athletes} failedCount={failedCount} />;
}
