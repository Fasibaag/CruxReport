import { Box, Typography } from "@mui/material";
import React from "react";
import { dataTransformation } from "./DataGrid/util";
import DonutChart from "./DonutChart";

interface HistogramData {
  start: number;
  end: number;
  density: number;
}

interface Percentiles {
  p75: number;
}

interface MetricData {
  data: {
    histogram: HistogramData[];
    percentiles: Percentiles;
  };
}

interface Metric {
  url: string;
  experimental_time_to_first_byte: MetricData;
  interaction_to_next_paint: MetricData;
  cumulative_layout_shift: MetricData;
  first_contentful_paint: MetricData;
  largest_contentful_paint: MetricData;
}

interface MetricsOverviewProps {
  metric: Metric;
}

const MetricsOverview: React.FC<MetricsOverviewProps> = ({ metric }) => {
  return (
    <div>
      <Box display={"flex"} alignItems={"center"}>
        <Typography variant="h4" gutterBottom>
          Metrics Overview
        </Typography>
        <Typography variant="h6" gutterBottom>
          ({metric?.url})
        </Typography>
      </Box>
      <Box display="flex">
        <DonutChart
          title="Time to First Byte (p75)"
          {...dataTransformation(
            metric.experimental_time_to_first_byte.data.histogram,
            metric.experimental_time_to_first_byte.data.percentiles.p75,
            "experimental_time_to_first_byte"
          )}
        />
        <DonutChart
          title="Interaction to Next Paint (p75)"
          {...dataTransformation(
            metric.interaction_to_next_paint.data.histogram,
            metric.interaction_to_next_paint.data.percentiles.p75,
            "interaction_to_next_paint"
          )}
        />
        <DonutChart
          title="Cumulative Layout Shift (p75)"
          {...dataTransformation(
            metric.cumulative_layout_shift.data.histogram,
            metric.cumulative_layout_shift.data.percentiles.p75,
            "cumulative_layout_shift"
          )}
        />
        <DonutChart
          title="First Contentful Paint (p75)"
          {...dataTransformation(
            metric.first_contentful_paint.data.histogram,
            metric.first_contentful_paint.data.percentiles.p75,
            "first_contentful_paint"
          )}
        />
        <DonutChart
          title="Largest Contentful Paint (p75)"
          {...dataTransformation(
            metric.largest_contentful_paint.data.histogram,
            metric.largest_contentful_paint.data.percentiles.p75,
            "largest_contentful_paint"
          )}
        />
      </Box>
    </div>
  );
};

export default MetricsOverview;
