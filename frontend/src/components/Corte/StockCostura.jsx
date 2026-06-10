import Loader from '@components/Loader';
import Box from '@mui/material/Box';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { LinePlot } from '@mui/x-charts/LineChart';

export default function StockCostura({ data, isLoading }) {

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <span className='text-6xl font-bold text-white pt-4'>STOCK MATERIAL CORTADO - ÚLTIMOS 30 DÍAS</span>

            {isLoading && <div className='flex items-center justify-center w-full h-full'><Loader fontSize={250} /></div>}
            {(data?.length > 0 && !isLoading) &&
                <Box sx={{ width: '100%', height: '100%' }}>
                    <ChartContainer
                        sx={
                            {
                                '& .MuiLineElement-series-revenue': { strokeWidth: 10, },
                                '& .MuiChartsAxis-line': { stroke: '#fff', strokeWidth: 4 },
                                '& .MuiChartsAxis-tick line': { stroke: '#fff', strokeWidth: 10 },
                                '& .MuiBarLabel-series-cookies-low': {
                                    display: 'block',
                                    fill: '#000',
                                    fontWeight: 600,
                                    fontSize: 30,
                                },
                                '& .MuiBarLabel-series-cookies-mid': {
                                    display: 'block',
                                    fill: '#000',
                                    fontWeight: 600,
                                    fontSize: 30,
                                },
                                '& .MuiBarLabel-series-cookies-high': {
                                    display: 'block',
                                    fill: '#000',
                                    fontWeight: 600,
                                    fontSize: 30,
                                },
                            }
                        }

                        xAxis={[
                            {
                                scaleType: 'band',
                                data: data?.map(m => `${m.dia}/${m.mes}`),
                                tickLabelStyle: { fontSize: 30, fontWeight: 'bold', fill: 'white' },
                                id: 'quarters',
                                height: 50,
                            },
                        ]}
                        yAxis={[
                            { id: 'quantities', position: 'left', width: 65, tickLabelStyle: { fill: 'white', fontSize: 18, fontWeight: 'bold' } },
                        ]}
                        series={[
                            {
                                type: 'line', id: 'revenue', yAxisId: 'quantities', color: 'lime',
                                data: data?.map(m => { return 1500 }),
                            },
                            {
                                type: 'bar', id: 'cookies-low', stack: 'cookies', yAxisId: 'quantities',
                                data: data?.map(d => parseInt(d.sets) < 1000 ? parseInt(d.sets) : null), color: '#ef4444'
                            },
                            {
                                type: 'bar', id: 'cookies-mid', stack: 'cookies', yAxisId: 'quantities',
                                data: data?.map(d => parseInt(d.sets) >= 1000 && parseInt(d.sets) < 1500 ? parseInt(d.sets) : null), color: 'yellow'
                            },
                            {
                                type: 'bar', id: 'cookies-high', stack: 'cookies', yAxisId: 'quantities',
                                data: data?.map(d => parseInt(d.sets) >= 1500 ? parseInt(d.sets) : null), color: '#22c55e'
                            },
                        ]}
                    >
                        <BarPlot barLabel="value" />
                        <LinePlot />
                        <ChartsXAxis axisId="quarters" labelStyle={{ fontSize: 25 }} />
                        <ChartsYAxis axisId="quantities" label="" />
                    </ChartContainer>
                </Box>
            }
        </div>
    )
}
