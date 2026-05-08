import React, { useEffect, useState, useRef, useImperativeHandle, forwardRef } from "react";
import ReactECharts from "echarts-for-react";
import { processForecastData } from "../../utils/diseaseRiskCalculator";

const LineRaceChart = forwardRef(({ dashboardData = null }, ref) => {
    const [option, setOption] = useState(null);
    const [hasData, setHasData] = useState(false);
    const chartRef = useRef(null);
    const chartDataRef = useRef(null); // Store chart data for export filename

    useEffect(() => {
        // If dashboardData is provided, use it; otherwise use default/empty data
        if (dashboardData && dashboardData.forecast24h && dashboardData.forecast24h.length > 0) {
            const processedData = processForecastData(
                dashboardData.forecast24h,
                dashboardData.prediction?.features || {},
                dashboardData.prediction?.category || ''
            );

            if (processedData.length > 0) {
                setHasData(true);
                chartDataRef.current = dashboardData; // Store for export
                createChart(processedData, dashboardData);
            } else {
                setHasData(false);
                chartDataRef.current = null;
                createEmptyChart();
            }
        } else {
            // Load from localStorage if no props provided
            const storedData = localStorage.getItem('dashboardData');
            if (storedData) {
                try {
                    const data = JSON.parse(storedData);
                    if (data.forecast24h && data.forecast24h.length > 0) {
                        const processedData = processForecastData(
                            data.forecast24h,
                            data.prediction?.features || {},
                            data.prediction?.category || ''
                        );

                        if (processedData.length > 0) {
                            setHasData(true);
                            chartDataRef.current = data; // Store for export
                            createChart(processedData, data);
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error parsing dashboard data:', error);
                }
            }
            setHasData(false);
            createEmptyChart();
        }
    }, [dashboardData]);

    const createChart = (processedData, data) => {
        const locationName = data.location?.locationName || data.location?.cityVillage || 'Current Location';
        const predictedCategory = data.prediction?.category || 'Unknown';

        // Prepare data series for disease categories
        const diseaseCategories = [
            { name: 'Vector Borne', key: 'vectorBorne', color: '#EE6666' },
            { name: 'Water Borne', key: 'waterBorne', color: '#5470C6' },
            { name: 'Air Borne', key: 'airBorne', color: '#91CC75' },
            { name: 'Contact/Infectious', key: 'contactInfectious', color: '#FAC858' }
        ];

        // Prepare data series for weather metrics
        const weatherMetrics = [
            { name: 'Temperature (°C)', key: 'temperature', color: '#FF6B6B', yAxisIndex: 1 },
            { name: 'Humidity (%)', key: 'humidity', color: '#4ECDC4', yAxisIndex: 1 },
            { name: 'Precipitation (mm)', key: 'precipitation', color: '#45B7D1', yAxisIndex: 1 },
            { name: 'Air Quality', key: 'airQuality', color: '#FFA07A', yAxisIndex: 1 }
        ];

        const times = processedData.map(d => d.time);
        
        // Create series for disease categories (main focus)
        // Check which category is predicted by ML model
        const predictedCategoryLower = predictedCategory.toLowerCase();
        const isPredictedCategory = (catName) => {
            const catLower = catName.toLowerCase();
            if (predictedCategoryLower.includes('vector')) return catLower.includes('vector');
            if (predictedCategoryLower.includes('water')) return catLower.includes('water');
            if (predictedCategoryLower.includes('air')) return catLower.includes('air');
            if (predictedCategoryLower.includes('infectious') || predictedCategoryLower.includes('cautious')) {
                return catLower.includes('contact') || catLower.includes('infectious');
            }
            return false;
        };

        const diseaseSeries = diseaseCategories.map(category => {
            const values = processedData.map(d => d[category.key]);
            const isPredicted = isPredictedCategory(category.name);
            
            return {
                name: category.name + (isPredicted ? ' (Predicted)' : ''),
                type: 'line',
                data: values,
                smooth: true,
                symbol: 'circle',
                symbolSize: isPredicted ? 10 : 6,
                lineStyle: {
                    width: isPredicted ? 4 : 2.5,
                    type: 'solid'
                },
                itemStyle: {
                    color: category.color,
                    borderWidth: isPredicted ? 3 : 1,
                    borderColor: isPredicted ? category.color : 'transparent'
                },
                emphasis: {
                    focus: 'series',
                    lineStyle: {
                        width: 6
                    }
                },
                label: {
                    show: false
                },
                areaStyle: isPredicted ? {
                    opacity: 0.2,
                    color: category.color
                } : {
                    opacity: 0.1,
                    color: category.color
                },
                yAxisIndex: 0
            };
        });

        // Create series for weather metrics (secondary, on right axis)
        const weatherSeries = weatherMetrics.map(metric => ({
            name: metric.name,
            type: 'line',
            data: processedData.map(d => d[metric.key]),
            smooth: true,
            symbol: 'none',
            lineStyle: {
                width: 1.5,
                type: 'dashed'
            },
            itemStyle: {
                color: metric.color
            },
            yAxisIndex: metric.yAxisIndex,
            silent: true // Don't highlight on hover by default
        }));

        const allSeries = [...diseaseSeries, ...weatherSeries];

        // Find dominant disease at each time point
        const dominantDiseases = processedData.map(d => d.dominantDisease);

        setOption({
            animation: true,
            animationDuration: 1000,
            color: diseaseCategories.map(c => c.color),
            title: {
                text: `Disease Risk Prediction - ${locationName}`,
                subtext: `Predicted Category: ${predictedCategory} | 24-Hour Forecast`,
                left: 'center',
                top: 10,
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold'
                },
                subtextStyle: {
                    fontSize: 12,
                    color: '#666'
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                },
                formatter: function(params) {
                    let result = `<strong>${params[0].axisValue}</strong><br/>`;
                    params.forEach(param => {
                        if (param.seriesName.includes('Temperature')) {
                            result += `${param.seriesName}: ${param.value}°C<br/>`;
                        } else if (param.seriesName.includes('Humidity')) {
                            result += `${param.seriesName}: ${param.value}%<br/>`;
                        } else if (param.seriesName.includes('Precipitation')) {
                            result += `${param.seriesName}: ${param.value}mm<br/>`;
                        } else if (param.seriesName.includes('Air Quality')) {
                            result += `${param.seriesName}: ${param.value}/100<br/>`;
                        } else {
                            result += `${param.seriesName}: ${param.value}% risk<br/>`;
                        }
                    });
                    const timeIndex = times.indexOf(params[0].axisValue);
                    if (timeIndex >= 0 && dominantDiseases[timeIndex]) {
                        result += `<br/><strong>Dominant: ${dominantDiseases[timeIndex]}</strong>`;
                    }
                    return result;
                }
            },
            legend: {
                data: [...diseaseCategories.map(c => c.name), ...weatherMetrics.map(m => m.name)],
                top: 50,
                type: 'scroll',
                orient: 'horizontal'
            },
            grid: {
                left: '3%',
                right: '8%',
                bottom: '10%',
                top: '25%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: times,
                name: 'Time (2-hour intervals)',
                nameLocation: 'middle',
                nameGap: 30,
                axisLabel: {
                    rotate: 45
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: 'Disease Risk (%)',
                    position: 'left',
                    min: 0,
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                },
                {
                    type: 'value',
                    name: 'Weather Metrics',
                    position: 'right',
                    axisLabel: {
                        formatter: function(value) {
                            return value;
                        }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider',
                    start: 0,
                    end: 100,
                    height: 20,
                    bottom: 10
                }
            ],
            series: allSeries
        });
    };

    const createEmptyChart = () => {
        setOption({
            title: {
                text: 'Disease Risk Prediction - No Data Available',
                subtext: 'Please submit a report with weather data to see predictions. Go to Report Form to get started.',
                left: 'center',
                top: 'center',
                textStyle: {
                    fontSize: 16,
                    color: '#999'
                },
                subtextStyle: {
                    fontSize: 14,
                    color: '#666',
                    margin: [10, 0, 0, 0]
                }
            },
            xAxis: { type: 'category', data: [], show: false },
            yAxis: { type: 'value', show: false },
            series: [],
            graphic: {
                type: 'text',
                left: 'center',
                top: '60%',
                style: {
                    text: '📊',
                    fontSize: 48,
                    opacity: 0.3
                }
            }
        });
    };

    // Export chart as image
    const exportChartAsImage = () => {
        if (!chartRef.current) {
            console.error('Chart instance not available');
            return;
        }

        try {
            const chartInstance = chartRef.current.getEchartsInstance();
            if (!chartInstance) {
                console.error('ECharts instance not found');
                return;
            }

            // Get chart as base64 image with high quality
            const imageData = chartInstance.getDataURL({
                type: 'png',
                pixelRatio: 2, // Higher quality (2x resolution)
                backgroundColor: '#ffffff'
            });

            // Generate filename with location and prediction info
            let filename = 'disease-risk-prediction';
            if (chartDataRef.current) {
                const location = chartDataRef.current.location;
                const prediction = chartDataRef.current.prediction;
                
                if (location?.cityVillage || location?.locationName) {
                    const locationName = (location.locationName || location.cityVillage || '').replace(/[^a-z0-9]/gi, '-').toLowerCase();
                    filename += `-${locationName}`;
                }
                
                if (prediction?.category) {
                    const category = prediction.category.replace(/[^a-z0-9]/gi, '-').toLowerCase();
                    filename += `-${category}`;
                }
            }
            
            // Add date
            filename += `-${new Date().toISOString().split('T')[0]}.png`;

            // Create download link
            const link = document.createElement('a');
            link.download = filename;
            link.href = imageData;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting chart:', error);
            alert('Failed to export chart as image. Please try again.');
        }
    };

    // Expose export function via ref
    useImperativeHandle(ref, () => ({
        exportChartAsImage
    }));

    if (!option) {
        return <div style={{ height: "500px", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Loading chart...</p>
        </div>;
    }

    return (
        <div>
            <ReactECharts 
                ref={chartRef}
                option={option} 
                style={{ height: "600px", width: "100%" }} 
                opts={{ renderer: 'canvas' }} // Use canvas for better image export quality
            />
            {hasData && (
                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <small className="text-muted">
                        <strong>Note:</strong> The chart shows disease risk predictions based on weather conditions over the next 24 hours. 
                        The dominant disease category (highlighted with thicker line) is determined by the ML model prediction and current weather conditions.
                        Risk scores are calculated based on temperature, humidity, precipitation, air quality, and environmental factors.
                    </small>
                </div>
            )}
        </div>
    );
});

LineRaceChart.displayName = 'LineRaceChart';

export default LineRaceChart;
