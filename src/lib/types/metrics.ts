export interface MetricsBreakdown {
  api: number;
  www: number;
  other: number;
  total: number;
}

export interface MetricsPeriod {
  window_days: number;
  requests: MetricsBreakdown;
  visits: MetricsBreakdown;
  bandwidth_tb: number;
}

export interface MetricsSample {
  timestamp: string;
  requests: MetricsBreakdown;
  visits: MetricsBreakdown;
  bandwidth_tb: number;
}

export interface MetricsHistory {
  window_hours: number;
  samples: MetricsSample[];
}

export interface MetricsData {
  last_updated: string;
  periods: {
    last_24_hours: MetricsPeriod;
    last_7_days: MetricsPeriod;
  };
  history?: MetricsHistory;
}
