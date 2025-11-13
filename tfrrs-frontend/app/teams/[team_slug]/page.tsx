import { notFound } from "next/navigation";

async function getTeam(slug: string, sport = "xc") {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        : "";
    const res = await fetch(`${baseUrl}/api/teams/${slug}?sport=${sport}`, {
      next: { revalidate: 300 }, // 5 minutes cache
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error("Team fetch failed:", err);
    return null;
  }
}

export default async function TeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ team_slug: string }>;
  searchParams: Promise<{ sport?: string }>;
}) {
  const { team_slug } = await params;
  const { sport = "xc" } = await searchParams;
  const team = await getTeam(team_slug, sport);
  if (!team) return notFound();

  const altGenderSlug = team_slug.includes("_m_")
  ? team_slug.replace("_m_", "_f_")
  : team_slug.replace("_f_", "_m_");

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Team Header */}
      <div className="bg-white border border-green-200 rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-green-700">
                {team.team_name}
              </h1>
              <p className="text-gray-700">
                {team_slug.includes("_m_") ? "Men\'s" : "Women\'s"} {team.sport_type=="xc" ? "Cross Country" : "Track & Field"}
              </p>
              <p className="text-gray-500 text-sm">{team.conference}, {team.region}</p>
            </div>

            <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 justify-end">
            {/* Gender toggle */}
            <div className="flex gap-2">
              <a
                href={`/teams/${altGenderSlug}?sport=${sport}`}
                className="px-3 py-1.5 rounded-md border text-sm font-medium border-green-300 text-green-700 hover:bg-green-50"
              >
                {team_slug.includes("_m_") ? "View Women’s Team" : "View Men’s Team"}
              </a>
            </div>

            {/* Sport toggle */}
            <div className="flex gap-2">
              <a
                href={`/teams/${team_slug}?sport=xc`}
                className={`px-3 py-1.5 rounded-md border text-sm font-medium ${
                  sport === "xc"
                  ? "bg-green-600 text-white border-green-600"
                  : "border-green-300 text-green-700 hover:bg-green-50"
                }`}
                >
                XC
              </a>
              <a
                href={`/teams/${team_slug}?sport=tf`}
                className={`px-3 py-1.5 rounded-md border text-sm font-medium ${
                  sport === "tf"
                  ? "bg-green-600 text-white border-green-600"
                  : "border-green-300 text-green-700 hover:bg-green-50"
                }`}
                >
                TF
              </a>
            </div>
          </div>
        </div>
      </div>


      {/* Roster Section */}
      <div className="bg-white border border-green-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-4 py-2 border-b bg-green-100 text-green-800 font-semibold">
          Roster
        </div>

        <table className="w-full text-sm">
          <thead className="bg-green-50 border-b text-gray-700">
            <tr>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Year</th>
            </tr>
          </thead>
          <tbody>
            {team.roster?.map((athlete: any, idx: number) => (
              <tr key={idx} className="border-b hover:bg-green-50">
                <td className="py-2 px-4 text-green-700 hover:underline">
                  <a href={`/athletes/${athlete.athlete_id}`}>
                    {athlete.athlete_name}
                  </a>
                </td>
                <td className="py-2 px-4 text-gray-700">{athlete.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
