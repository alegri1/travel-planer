export interface Trip {
  id: number;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Activity {
  id: number;
  trip_id: number;
  day_index: number;
  position: number;
  title: string;
  time: string | null;
  notes: string | null;
  metadata: string | null;
  created_at: string;
}

export interface FlightMetadata {
  type: "flight";
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  price: string;
  currency: string;
  cabin: string;
  stops: number;
}

export interface DayPlan {
  dayIndex: number;
  date: string;
  label: string;
  activities: Activity[];
}
