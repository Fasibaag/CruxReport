import * as echarts from "echarts";
import { useEffect } from "react";

const colors = ["#2eb872", "#ffa952", "#e46161"];

interface ChartDataItem {
  value: number | string;
  name: string;
}

interface DonutChartProps {
  title: string;
  chartData: ChartDataItem[];
  currentPercentage: number | string;
}

const DonutChart1: React.FC<DonutChartProps> = ({
  title,
  chartData,
  currentPercentage,
}) => {
  useEffect(() => {
    const chartDom = document.getElementById(title) as HTMLElement;
    const myChart = echarts.init(chartDom);

    // Calculate the total value and determine the angle for the mark line
    const totalValue = chartData.reduce(
      (acc, item) => acc + Number(item.value),
      0
    );
    const angle = (Number(currentPercentage) / totalValue) * 360;

    // Calculate x2 and y2 based on the angle
    const radius = 100; // Adjust based on your chart's size
    const x2 = 150 + radius * Math.cos((angle * Math.PI) / 180); // Center + radius * cos(angle)
    const y2 = 150 + radius * Math.sin((angle * Math.PI) / 180); // Center + radius * sin(angle)

    const option = {
      title: {
        subtext: `${title}`,
        bottom: "left",
      },
      tooltip: {
        trigger: "item",
      },
      legend: {
        orient: "vertical",
        left: "left",
      },
      series: [
        {
          name: title,
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: false,
              fontSize: "18",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
          itemStyle: {
            color: (params: any) => colors[params.dataIndex],
          },
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: `${currentPercentage}%`,
            textAlign: "center",
            font: "bold 14px Arial",
            fill: "#000",
          },
        },
        {
          type: "line",
          shape: {
            x1: "50%", // Center of the chart
            y1: "50%",
            x2: x2, // Calculated x2
            y2: y2, // Calculated y2
          },
          style: {
            stroke: "#000000", // Color of the line
            lineDash: [5, 5], // Dashed line style
            lineWidth: 2,
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [title, chartData, currentPercentage]);

  return <div id={title} style={{ width: "300px", height: "300px" }}></div>;
};

export default DonutChart1;
