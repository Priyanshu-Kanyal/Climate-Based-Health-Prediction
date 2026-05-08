import React from 'react';
import ReactECharts from 'echarts-for-react';

const DoughnutChart1 = () => {
    const option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 1000, itemStyle: { color: '#0a47a1' } },
                    { value: 450, itemStyle: { color: '#75cd4cff' } },
                    { value: 300, itemStyle: { color: '#d43b3bff' } }
                ]
            }
        ]
    };

    return (
        <div>
            <ReactECharts
                option={option}
                style={{ height: '118px', width: '100%' }}
                opts={{ renderer: 'canvas' }}
                onEvents={{
                    click: (params) => {
                        console.log('Chart element clicked:', params);
                    }
                }}
            />
        </div>
    );
};

export default DoughnutChart1;