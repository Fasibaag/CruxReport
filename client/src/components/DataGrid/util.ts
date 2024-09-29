interface MetricData {
  data: any;
  value: number;
}

interface RowData {
  id: string;
  url: string;
  interaction_to_next_paint: MetricData;
  round_trip_time: MetricData;
  cumulative_layout_shift: MetricData;
  experimental_time_to_first_byte: MetricData;
  first_contentful_paint: MetricData;
  largest_contentful_paint: MetricData;
}

interface SummaryRow {
  id: string;
  url: string;
  largest_contentful_paint: { value: string };
  cumulative_layout_shift: { value: string };
  first_contentful_paint: { value: string };
  experimental_time_to_first_byte: { value: string };
  interaction_to_next_paint: { value: string };
}

interface MetricThreshold {
  good: { min: number; max: number };
  needsImprovement: { min: number; max: number };
  poor: { min: number };
}

interface MetricThresholds {
  [key: string]: MetricThreshold;
}

export const getData = (data: any[]): (RowData | SummaryRow)[] => {
  const rows: RowData[] = data.map((item) => ({
    id: item.url, // Unique ID for each row
    url: item.url,
    interaction_to_next_paint: {
      data: item.data.record.metrics.interaction_to_next_paint,
      value: item.data.record.metrics.interaction_to_next_paint.percentiles.p75,
    },
    round_trip_time: {
      data: item.data.record.metrics.round_trip_time,
      value: item.data.record.metrics.round_trip_time.percentiles.p75,
    },
    cumulative_layout_shift: {
      data: item.data.record.metrics.cumulative_layout_shift,
      value: item.data.record.metrics.cumulative_layout_shift.percentiles.p75,
    },
    experimental_time_to_first_byte: {
      data: item.data.record.metrics.experimental_time_to_first_byte,
      value:
        item.data.record.metrics.experimental_time_to_first_byte.percentiles
          .p75,
    },
    first_contentful_paint: {
      data: item.data.record.metrics.first_contentful_paint,
      value: item.data.record.metrics.first_contentful_paint.percentiles.p75,
    },
    largest_contentful_paint: {
      data: item.data.record.metrics.largest_contentful_paint,
      value: item.data.record.metrics.largest_contentful_paint.percentiles.p75,
    },
  }));

  const summaryRows: SummaryRow[] = data.length ? getsummaryRows(rows) : [];

  return [...rows, ...summaryRows];
};

export const getValue = (data: any): number => {
  return Number(data);
};

export const getsummaryRows = (data: RowData[]): SummaryRow[] => {
  const totalLCP = data.reduce(
    (acc, row) => acc + getValue(row.largest_contentful_paint.value),
    0
  );
  const avgLCP = totalLCP / data.length;
  const totalCLS = data.reduce(
    (acc, row) => acc + getValue(row.cumulative_layout_shift.value),
    0
  );
  const avgCLS = totalCLS / data.length;
  const totalFCP = data.reduce(
    (acc, row) => acc + getValue(row.first_contentful_paint.value),
    0
  );
  const avgFCP = totalFCP / data.length;

  const totalRTT = data.reduce(
    (acc, row) => acc + getValue(row.experimental_time_to_first_byte.value),
    0
  );
  const avgRTT = totalRTT / data.length;

  const totalINP = data.reduce(
    (acc, row) => acc + getValue(row.interaction_to_next_paint.value),
    0
  );
  const avgINP = totalINP / data.length;

  // Append sum and average rows to the data
  const summaryRows: SummaryRow[] = [
    {
      id: "sum",
      url: "Total",
      largest_contentful_paint: { value: totalLCP.toFixed(2) },
      cumulative_layout_shift: { value: totalCLS.toFixed(2) },
      first_contentful_paint: { value: totalFCP.toFixed(2) },
      experimental_time_to_first_byte: { value: totalRTT.toFixed(2) },
      interaction_to_next_paint: { value: totalINP.toFixed(2) },
    },
    {
      id: "avg",
      url: "Average",
      largest_contentful_paint: { value: avgLCP.toFixed(2) },
      cumulative_layout_shift: { value: avgCLS.toFixed(2) },
      first_contentful_paint: { value: avgFCP.toFixed(2) },
      experimental_time_to_first_byte: { value: avgRTT.toFixed(2) },
      interaction_to_next_paint: { value: avgINP.toFixed(2) },
    },
  ];

  return summaryRows;
};

export const metricThresholds: MetricThresholds = {
  largest_contentful_paint: {
    good: { min: 0, max: 2500 }, // LCP (0–2500ms)
    needsImprovement: { min: 2500, max: 4000 }, // LCP (2500–4000ms)
    poor: { min: 4000 }, // LCP (4000ms+)
  },
  cumulative_layout_shift: {
    good: { min: 0.0, max: 0.1 }, // CLS (0.00-0.10)
    needsImprovement: { min: 0.1, max: 0.25 }, // CLS (0.10–0.25)
    poor: { min: 0.25 }, // CLS (0.25+)
  },
  interaction_to_next_paint: {
    good: { min: 0, max: 200 }, // INP (0–200ms)
    needsImprovement: { min: 200, max: 500 }, // INP (200ms–500ms)
    poor: { min: 500 }, // INP (500ms+)
  },
  first_contentful_paint: {
    good: { min: 0, max: 1800 }, // FCP (0–1800ms)
    needsImprovement: { min: 1800, max: 3000 }, // FCP (1800ms–3000ms)
    poor: { min: 3000 }, // FCP (3000ms+)
  },
  experimental_time_to_first_byte: {
    good: { min: 0, max: 800 }, // TTFB (0–800ms)
    needsImprovement: { min: 800, max: 1800 }, // TTFB (800ms–1800ms)
    poor: { min: 1800 }, // TTFB (1800ms+)
  },
  round_trip_time: {
    good: { min: 0, max: 800 }, // RTT (assuming similar thresholds to TTFB)
    needsImprovement: { min: 800, max: 1800 },
    poor: { min: 1800 },
  },
};

export function getThresholdCategory(
  metric: string,
  value: number
): { label: string; color: string } {
  const thresholds = metricThresholds[metric];
  if (!thresholds) return { label: "", color: "" };

  if (value >= thresholds.good.min && value <= thresholds.good.max) {
    return {
      label: "Good",
      color: "#2eb872",
    };
  }
  if (
    value >= thresholds.needsImprovement.min &&
    value < thresholds.needsImprovement.max
  ) {
    return {
      label: "Needs Improvement",
      color: "#ffa952",
    };
  }
  if (value >= thresholds.poor.min) {
    return { label: "Poor", color: "#e46161" };
  }

  return { label: "", color: "" };
}

interface HistogramItem {
  start: number;
  end?: number;
  density: number;
}

interface TransformedData {
  value: number;
  name: string;
}

interface DataTransformationResult {
  chartData: TransformedData[];
  currentPercentage: string;
  threshold: { label: string; color: string } | string;
}

export const dataTransformation = (
  histogramData: HistogramItem[],
  currentValue: number,
  metric: string
): DataTransformationResult => {
  const maxValue =
    histogramData[histogramData.length - 1].end ||
    histogramData[histogramData.length - 1].start;
  const currentPercentage = ((currentValue / maxValue) * 100).toFixed(2);

  const transformedData: TransformedData[] = histogramData.map((item) => ({
    value: item.density,
    name: `${item.start}-${item.end || ">" + item.start} ms`,
  }));

  return {
    chartData: transformedData,
    currentPercentage,
    threshold: getThresholdCategory(metric, currentValue),
  };
};
