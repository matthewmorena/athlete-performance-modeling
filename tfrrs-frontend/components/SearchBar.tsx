"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface AthleteResult {
  athlete_name: string;
  athlete_id: string;
  team_name: string;
  team_slug: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AthleteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // Debounce search to avoid flooding API
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search?query_type=athlete&query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data.results || []);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [query]);

  return (
    <div className="relative w-64">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search athletes..."
        className="w-full border border-green-300 bg-white/90 text-gray-800 placeholder:text-gray-400 rounded-full py-1.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="max-h-64 overflow-y-auto text-sm">
            {results.map((athlete) => (
              <li key={athlete.athlete_id}>
                <Link
                  href={`/athletes/${athlete.athlete_id}`}
                  className="text-gray-500 block px-4 py-2 hover:bg-gray-50"
                  onClick={() => {
                    setShowDropdown(false);
                    setQuery("");
                  }}
                >
                  <span className="font-medium">{athlete.athlete_name}</span>
                  <span className="text-green-900 text-xs ml-1">
                    • {athlete.team_name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
          ...
        </div>
      )}
    </div>
  );
}
