export type MeetType = "xc" | "tf";

export interface AthletePerformanceResult {
  date: string;
  event_id: string | number | null;
  event_name: string;
  mark_int: number | null;
  meet_type: MeetType;
  meet_id: string | number;
  meet_name: string;
  mark: string;
  wind?: number | null;
  place: string | number | null;
  round?: string | null;
}

export interface AthleteDetail {
  athlete_name: string;
  class_year?: string | null;
  current_team_slug: string;
  current_team_name: string;
  gender: string;
  results: AthletePerformanceResult[];
}

export interface TrackResult {
  place: string | number | null;
  athlete_id: string | number;
  athlete_name: string;
  team_slug: string;
  team_name: string;
  time?: string | null;
  mark?: string | null;
}

export interface TrackRound {
  event_id: string | number;
  event_name: string;
  round?: string | null;
  heat?: string | number | null;
  wind?: string | null;
  results: TrackResult[];
}

export interface TrackEventGroup {
  event_id: string;
  event_name: string;
  rounds: TrackRound[];
}

export interface TrackMeet {
  meet_name: string;
  meet_date: string;
  meet_location: string;
  events: TrackRound[];
}

export interface CrossCountryResult {
  place: string | number | null;
  athlete_id: string | number;
  athlete_name: string;
  team_slug: string;
  team_name: string;
  time: string;
}

export interface CrossCountryEvent {
  event_id: string | number;
  event_name: string;
  results: CrossCountryResult[];
}

export interface CrossCountryMeet {
  meet_name: string;
  meet_date: string;
  meet_location: string;
  events: CrossCountryEvent[];
}

export interface TeamRosterAthlete {
  athlete_id: string | number;
  athlete_name: string;
  year?: string | null;
}

export interface TeamDetail {
  team_name: string;
  sport_type: MeetType;
  conference?: string | null;
  region?: string | null;
  roster: TeamRosterAthlete[];
}

export interface DatedResult {
  date: string;
}

export type FeaturedEventGroup = "Sprints" | "Distance" | "Jumps" | "Throws" | "Other";

export interface FeaturedRatingPoint {
  date: string;
  dateLabel: string;
  rating: number;
  label: string;
}

export interface FeaturedAthlete {
  id: string;
  name: string;
  initials: string;
  school: string;
  year: string;
  event: string;
  group: FeaturedEventGroup;
  rating: number | null;
  delta: number | null;
  place: string;
  mark: string;
  meet: string;
  resultDate: string;
  scoredResults: number;
  totalResults: number;
  history: FeaturedRatingPoint[];
  sourceUrl: string;
}
