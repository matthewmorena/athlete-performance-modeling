"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

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

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/search?query_type=athlete&query=${encodeURIComponent(normalizedQuery)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Search request failed with status ${response.status}`);
        }

        const data = (await response.json()) as { results?: AthleteResult[] };
        setResults(data.results ?? []);
        setShowDropdown(true);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;

        console.error("Search failed:", error);
        setResults([]);
        setShowDropdown(false);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    const nextQuery = event.target.value;
    setQuery(nextQuery);
    setShowDropdown(false);

    if (!nextQuery.trim()) {
      setResults([]);
      setLoading(false);
    }
  }

  function resetSearch() {
    setShowDropdown(false);
    setQuery("");
    setResults([]);
    setLoading(false);
  }

  return (
    <div className="relative w-full">
      <label htmlFor="athlete-search" className="sr-only">
        Search athletes
      </label>
      <input
        id="athlete-search"
        type="search"
        value={query}
        onChange={handleQueryChange}
        onFocus={() => results.length > 0 && setShowDropdown(true)}
        placeholder="Search athletes…"
        autoComplete="off"
        className="w-full rounded-xl border border-border bg-background px-3 py-2 pr-10 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent"
      />

      {loading && (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted"
          aria-live="polite"
        >
          …
        </span>
      )}

      {showDropdown && (
        <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-border bg-panel shadow-2xl">
          {results.length > 0 ? (
            <ul className="max-h-72 overflow-y-auto py-1 text-sm">
              {results.map((athlete) => (
                <li key={athlete.athlete_id}>
                  <Link
                    href={`/athletes/${athlete.athlete_id}`}
                    className="block px-3 py-2.5 transition-colors hover:bg-surface"
                    onClick={resetSearch}
                  >
                    <span className="block font-medium text-foreground">
                      {athlete.athlete_name}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {athlete.team_name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-3 text-sm text-muted">No athletes found.</p>
          )}
        </div>
      )}
    </div>
  );
}
