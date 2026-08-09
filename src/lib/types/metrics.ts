/**
 * Metrics contract for the external worker payload.
 * @see HANDOFF.md
 */
export interface MetricsBreakdown {
  api: number;
  www: number;
  other: number;
  total: number;
}

export interface HourlySample {
  timestamp: string; // ISO 8601 UTC, top of hour
  requests: MetricsBreakdown;
  visits: MetricsBreakdown;
  bandwidth_bytes: number;
}

export interface DailySample {
  date: string; // "YYYY-MM-DD" UTC
  requests: MetricsBreakdown;
  visits: MetricsBreakdown;
  bandwidth_bytes: number;
}

export interface MetricsPayload {
  last_updated: string; // ISO 8601 UTC
  hourly: {
    window_hours: number;
    samples: HourlySample[]; // oldest -> newest
  };
  daily: {
    window_days: number;
    samples: DailySample[]; // oldest -> newest
  };
  totals: {
    last_24_hours: {
      requests: MetricsBreakdown;
      visits: MetricsBreakdown;
      bandwidth_bytes: number;
    };
    last_7_days: {
      requests: MetricsBreakdown;
      visits: MetricsBreakdown;
      bandwidth_bytes: number;
    };
    requests_per_day_avg: number;
  };
}
