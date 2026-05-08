import React from 'react';
import ReactECharts from 'echarts-for-react';

const Barplot = () => {
    const option = {

        tooltip: {
            trigger: 'axis'
        },
        calculable: true,
        xAxis: [
            {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                type: 'bar',
                color: '#0a47a1',
                data: [
                    5.0, 4.0, 3.0, 7.0, 5.0, 10.0, 3.0
                ],

            },
            {
                type: 'bar',
                color: '#ff0073ff',
                data: [
                    3.0, 2.0, 9.0, 5.0, 4.0, 6.0, 4.0
                ],

            }
        ]
    };

    return (
        <div style={{ padding: '0px', background: '#ffffffff', borderRadius: '0px' }}>
            <ReactECharts
                option={option}
                style={{ height: '197.5px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
            />
        </div>
    );
};

export default Barplot;