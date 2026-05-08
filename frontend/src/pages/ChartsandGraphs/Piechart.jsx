import React from 'react';
import ReactECharts from 'echarts-for-react';

const PieChart = () => {
    // Chart configuration options
    const option = {

        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        series: [
            {
                name: 'Dominant Bacteria',
                type: 'pie',
                radius: '75%',
                data: [
                    { value: 50, name: 'Fecal Coliform', itemStyle: { color: '#0a47a1' } },
                    { value: 35, name: 'Fecal Streptococci', itemStyle: { color: '#ff0073ff' } },
                    { value: 15, name: 'E.Coli', itemStyle: { color: '#ffce56' } },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 20,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    return (
        <div className="pie-chart-container">
            <ReactECharts
                option={option}
                style={{ height: '190px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
            />
        </div>
    );
};

export default PieChart;