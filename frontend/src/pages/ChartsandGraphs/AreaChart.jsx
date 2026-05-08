import React from 'react';
import ReactECharts from 'echarts-for-react';


const AreaChartComponent = () => {
    const option = {
        grid: {
            left: '5%',
            right: '5%',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#393939ff',
                fontSize: 12,
                margin: 16
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 80000,
            interval: 10000,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0'
                }
            },
            axisLabel: {
                formatter: function (value) {
                    return '$' + (value / 1000) + 'k';
                },
                color: '#5d5d5dff',
                fontSize: 12,
                margin: 8
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                return params[0].name + '<br/>' +
                    '<span style="display:inline-block;margin-right:4px;border-radius:50%;width:10px;height:10px;background-color:#5470c6;"></span>' +
                    'Sales: <strong>$' + params[0].value.toLocaleString() + '</strong>';
            },
            backgroundColor: 'rgba(255, 255, 255, 1)',
            borderColor: '#ffffffff',
            borderWidth: 1,
            textStyle: {
                color: '#333'
            },
            padding: 12,
            extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);'
        },
        series: [
            {
                name: 'Sales',
                type: 'line',
                data: [22000, 43200, 50100, 53400, 69000, 73000, 62000],
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'rgba(84, 112, 198, 0.6)'
                        }, {
                            offset: 1,
                            color: 'rgba(84, 112, 198, 0.1)'
                        }]
                    }
                },
                lineStyle: {
                    width: 3,
                    color: '#0a47a1'
                },
                itemStyle: {
                    color: '#0a47a1'
                },
                symbol: 'circle',
                symbolSize: 8,
                smooth: true
            }
        ],

    };

    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            maxWidth: '1000px',
            margin: '20px auto'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '1px solid #ffffffff'
            }}>

            </div>
            <ReactECharts
                option={option}
                style={{ height: '333.5px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
            />
        </div>
    );
};

export default AreaChartComponent;