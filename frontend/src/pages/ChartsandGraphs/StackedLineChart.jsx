import React from "react";
import ReactECharts from "echarts-for-react";

const StackedLineChart = () => {
    const option = {
        title: {
            // text: "Water Quality Parameters Over a Week",
        },

        tooltip: {
            trigger: "axis",
        },
        legend: {
            data: ["Contamination Level (ppm)", "Ph Level", "Turbidity (NTU)", "Dissolved Oxygen (mg/ltr)", "Lead Concentration (micro gram/ltr)", "Water Source Type"],
        },
        grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
        },
        toolbox: {
            feature: {
                saveAsImage: {},
            },
        },
        xAxis: {
            type: "category",
            boundaryGap: false,
            data: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
        },
        yAxis: {
            type: "value",
        },
        series: [
            {
                name: "Water Source Type",
                type: "line",
                stack: "Total",
                data: ["Rainwater Harvesting", "Spring", "Community Tap", "Ground Water", "Tube well", "Rainwater Harvesting", "Rainwater Harvesting", "Tube well", "Pond", "River"],
            },
            {
                name: "Contamination Level (ppm)",
                type: "line",
                stack: "Total",
                data: [2.64, 0.33, 0.91, 3.72, 0.51, 3.06, 1.30, 2.01, 1.51, 1.84],
            },
            {
                name: "Ph Level",
                type: "line",
                stack: "Total",
                data: [7.17, 8.23, 7.77, 6.16, 6.37, 6.02, 7.58, 7.12, 6.34, 8.40],
            },
            {
                name: "Turbidity (NTU)",
                type: "line",
                stack: "Total",
                data: [6.66, 6.82, 9.32, 9.98, 7.23, 2.94, 8.81, 0.59, 2.39, 8.98],
            },
            {
                name: "Dissolved Oxygen (mg/ltr)",
                type: "line",
                stack: "Total",
                data: [7.24, 6.75, 9.67, 8.04, 4.39, 6.79, 5.44, 6.82, 6.73, 7.51],
            },
            {
                name: "Lead Concentration (micro gram/ltr)",
                type: "line",
                stack: "Total",
                data: [15.09, 15.38, 13.67, 5.45, 12.17, 11.84, 10.20, 11.45, 10.34, 11.84],
            },
        ],
    };

    return <ReactECharts option={option} style={{ height: "400px", width: "100%" }} />;
};

export default StackedLineChart;
