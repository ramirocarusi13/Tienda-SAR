import { BarElement, CategoryScale, Chart, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { useEffect, useRef, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels'

// Registrar los componentes de Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

export default function ChartBarraDefectos({ dataSource }) {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {

            }
        ]
    })
    const [isLoading, setIsLoading] = useState(false)
    const chartRef = useRef(null);

    useEffect(() => {
        if (dataSource?.length > 0) {
            loadData()
        }
    }, [dataSource])

    const updateChart = () => {

        if (chartRef.current && chartRef.current.chartInstance) {
            chartRef.current.chartInstance.update();
        } else if (chartRef.current && chartRef.current.update) {
            chartRef.current.update();
        }
    }

    const loadData = () => {
        setIsLoading(true)
        const temp = {
            labels: dataSource?.map(i => i?.falla),
            datasets: [
                {
                    label: 'Defectos',
                    data: dataSource?.map(i => parseInt(i?.cantidad)),
                    backgroundColor: ['#2196f3', '#2196f3', '#2196f3', '#2196f3', '#2196f3'],
                    borderColor: 'black',
                    barThickness: dataSource?.length < 3 ? 100 : 38,
                    borderWidth: 0,
                },
            ],
        };

        // console.log(dataSource)

        setData(temp)

        setTimeout(() => {
            updateChart();
            setIsLoading(false)
        }, [200])
    }

    // console.log(data)
    // const data = {
    //     labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
    //     datasets: [
    //         {
    //             label: 'Ventas',
    //             data: [120, 190, 300, 250],
    //             backgroundColor: 'rgba(75, 192, 192, 0.5)',
    //         },
    //     ],
    // };

    const options = {
        // type:'horizontalBar',
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                display: false
            },
            title: {
                display: false,
                text: 'Gráfico de Barras de Ventas',
            },
            datalabels: {
                color: 'white',
                anchor: 'center',
                align: 'right',
                font: {
                    weight: 'bold',
                    size: 20,
                },
                formatter: (value) => `${value}`, // podés agregar % o $
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: 'black',
                    font: {
                        size: 12,
                        weight: 'bold'
                    }
                },
            },
            y: {
                stacked: true,
                ticks: {
                    color: 'white',
                    font: {
                        size: 15,
                        weight: 'bold'
                    }
                }
            }
        }
    };

    return <Bar ref={chartRef} data={data} options={options} plugins={[ChartDataLabels]} />;
};

