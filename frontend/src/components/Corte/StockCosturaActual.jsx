import Loader from '@components/Loader';
import Box from '@mui/material/Box';
import { ChartsGrid } from '@mui/x-charts';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { LinePlot } from '@mui/x-charts/LineChart';
import { FaCircle } from "react-icons/fa";
import { IoTriangle } from "react-icons/io5";
import { ImCross } from "react-icons/im";


const StatusCorte = ({ data }) => {
    const total = data?.length
    const sinCorte = data?.filter(m => parseInt(m.en_buffer?.length) > 0)?.length
    const porcentajeSinCorte = total > 0 ? (sinCorte / total) * 100 : 0

    return <div className='px-4 bg-transparent flex flex-col items-start gap-4 py-2 mr-20'>

        {/* {porcentajeSinCorte >= 99.1 && <FaCircle className=' fill-green-500 text-6xl animate-pulse' />}
        {(porcentajeSinCorte >= 80 && porcentajeSinCorte <= 99) && <IoTriangle className=' fill-yellow-300 text-6xl animate-pulse' />}
        {porcentajeSinCorte < 80 && <ImCross className=' fill-red-500 text-6xl animate-pulse' />}

        <span className='text-white font-bold text-6xl'>{porcentajeSinCorte.toFixed(0)}%</span>

        {porcentajeSinCorte >= 99.1 && <span className='text-white font-bold text-4xl'>(100%)</span>}
        {(porcentajeSinCorte >= 80 && porcentajeSinCorte <= 99) && <span className='text-white font-bold text-4xl'>(80% - 99%)</span>}
        {porcentajeSinCorte < 80 && <span className='text-white font-bold text-4xl'>(0% - 79%)</span>} */}

        <div className='flex items-center gap-2'>
            <FaCircle className=' fill-green-500 text-6xl' />
            <div className={`border-2 w-24 h-14 border-white text-black text-4xl flex items-center justify-center ${porcentajeSinCorte >= 99.1 && "bg-green-300"}`}>
                {porcentajeSinCorte >= 99.1 && porcentajeSinCorte.toFixed(0) + "%"}
            </div>
            <span className='font-bold text-5xl text-white'>(100%)</span>
        </div>

        <div className='flex items-center gap-2'>
            <IoTriangle className=' fill-yellow-300 text-6xl' />
            <div className={`border-2 w-24 h-14 border-white text-black text-4xl flex items-center justify-center ${(porcentajeSinCorte >= 80 && porcentajeSinCorte <= 99) && "bg-yellow-300"}`}>
                {(porcentajeSinCorte >= 80 && porcentajeSinCorte <= 99) && porcentajeSinCorte.toFixed(0) + "%"}
            </div>
            <span className='font-bold text-5xl text-white'>(80% - 99%)</span>
        </div>

        <div className='flex items-center gap-2'>
            <ImCross className=' fill-red-500 text-6xl' />
            <div className={`border-2 w-24 h-14 border-white text-black text-4xl flex items-center justify-center ${porcentajeSinCorte < 80 && "bg-red-300 animate-pulse"}`}>
                {porcentajeSinCorte < 80 && porcentajeSinCorte.toFixed(0) + "%"}
            </div>
            <span className='font-bold text-5xl text-white'>(0% - 79%)</span>
        </div>
        {/* {porcentajeSinCorte >= 99.1 && <FaCircle className=' fill-green-500 text-6xl animate-pulse' />}
        {(porcentajeSinCorte >= 80 && porcentajeSinCorte <= 99) && <IoTriangle className=' fill-yellow-300 text-6xl animate-pulse' />}
        {porcentajeSinCorte < 80 && <ImCross className=' fill-red-500 text-6xl animate-pulse' />}

        <span className='text-white font-bold text-6xl'>{porcentajeSinCorte.toFixed(0)}%</span>

        {porcentajeSinCorte >= 99.1 && <span className='text-white font-bold text-4xl'>(100%)</span>}
        {(porcentajeSinCorte >= 80 && porcentajeSinCorte <= 99) && <span className='text-white font-bold text-4xl'>(80% - 99%)</span>}
        {porcentajeSinCorte < 80 && <span className='text-white font-bold text-4xl'>(0% - 79%)</span>} */}

    </div>
}

export default function StockCosturaActual({ data, isLoading }) {

    return (
        <div className='w-full h-full flex flex-col items-center'>
            <span className='text-6xl font-bold text-white pt-4'>STOCK MATERIAL CORTADO ACTUAL</span>

            {!isLoading &&
                <div className='flex items-center justify-between  w-full'>
                    <div></div>
                    <div className='flex items-center gap-10 bg-orange-300 px-10 py-1' >
                        <span className='text-5xl text-black font-bold'>TOTAL MODELOS : {data?.length}</span>
                        <span className='text-5xl text-black font-bold'>CON CORTE : {data?.filter(m => parseInt(m.en_buffer?.length) > 0)?.length}</span>
                        <span className='text-5xl text-black font-bold'>SIN CORTE : {data?.filter(m => parseInt(m.en_buffer?.length) <= 0)?.length}</span>
                    </div>

                    <StatusCorte data={data} />
                </div>
            }


            {isLoading && <div className='flex items-center justify-center w-full h-full'><Loader fontSize={250} /></div>}

            {(data?.length > 0 && !isLoading) &&
                <Box sx={{ width: '100%', height: '100%' }}>
                    <ChartContainer
                        sx={{
                            '& .MuiChartsGrid-horizontalLine': {
                                stroke: '#F3A344',
                                strokeWidth: .5
                            },
                            '& .MuiLineElement-series-revenue': { strokeWidth: 7, },
                            '& .MuiChartsAxis-line': { stroke: '#fff', strokeWidth: 4 },
                            '& .MuiChartsAxis-tick line': { stroke: '#fff', strokeWidth: 10 },
                            '& .MuiBarLabel-series-cookies-low': {
                                display: 'block',
                                fill: '#fff',
                                fontWeight: 600,
                                fontSize: 25,
                            },
                            '& .MuiBarLabel-series-cookies-mid': {
                                display: 'block',
                                fill: '#fff',
                                fontWeight: 600,
                                fontSize: 25,
                            },
                            '& .MuiBarLabel-series-cookies-high': {
                                display: 'block',
                                fill: '#fff',
                                fontWeight: 600,
                                fontSize: 25,
                            }
                        }}
                        margin={{ bottom: 40 }}
                        xAxis={[
                            {
                                scaleType: 'band',
                                data: data?.map(m => m.nombre),
                                id: 'quarters',
                                height: 200,
                                tickLabelStyle: {
                                    angle: -90,
                                    fontSize: 30,
                                    fontWeight: 'bold',
                                    fill: 'white',
                                    textAnchor: 'end',
                                    dominantBaseline: 'middle',
                                    // transform: 'translate(-10px, 90px)'
                                },
                                tickLabelInterval: () => true,
                            },
                        ]}
                        yAxis={[
                            {
                                id: 'quantities',
                                position: 'left',
                                width: 65,
                                tickLabelStyle: {
                                    fill: 'white',
                                    fontSize: 30,
                                    fontWeight: 'bold'
                                }
                            },
                        ]}
                        series={[
                            {
                                type: 'line',
                                curve: 'step',
                                id: 'revenue',
                                showMark: true,
                                yAxisId: 'quantities',
                                color: 'white',
                                data: data?.map(m => Number(m?.consumo ?? 0)),
                            },
                            {
                                type: 'bar', id: 'cookies-low', stack: 'cookies', yAxisId: 'quantities',
                                data: data?.map(d => (parseInt(d.en_buffer?.length) * parseInt(d?.cantidad)) < parseInt(d.consumo) ? parseInt(d.en_buffer?.length) * parseInt(d?.cantidad) : null), color: '#ef4444'
                                // data: data?.map(d => {
                                //     const total = Number(d?.en_buffer?.length ?? 0) * Number(d?.cantidad ?? 0);
                                //     const consumo = Number(d?.consumo ?? 0);
                                //     return Number.isFinite(total) && total < consumo ? total : 0; // antes: null
                                // }),
                                // color: '#ef4444',
                            },
                            {
                                type: 'bar', id: 'cookies-mid', stack: 'cookies', yAxisId: 'quantities',
                                data: data?.map(d => parseInt(d.en_buffer?.length) * parseInt(d?.cantidad) >= parseInt(d.consumo) ? parseInt(d.en_buffer?.length) * parseInt(d?.cantidad) : null), color: '#22c55e'
                                // data: data?.map(d => {
                                //     const total = Number(d?.en_buffer?.length ?? 0) * Number(d?.cantidad ?? 0);
                                //     const consumo = Number(d?.consumo ?? 0);
                                //     return Number.isFinite(total) && total >= consumo ? total : 0; // antes: null
                                // }),
                                // color: '#22c55e',
                            },
                        ]}
                    >
                        <BarPlot barLabel={(item) => String(item.value ?? 0)} />
                        <LinePlot />

                        {/* Líneas de referencia horizontales (sobre valores Y) */}
                        {/* <ChartsReferenceLine
                            y={100}                      // valor en el eje Y
                            yAxisId="quantities"
                            label="Meta 100"
                            lineStyle={{ stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '6 6' }}
                        />
                        <ChartsReferenceLine
                            y={200}
                            yAxisId="quantities"
                            label="Crítico 200"
                            lineStyle={{ stroke: '#ef4444', strokeWidth: 2 }}
                        /> */}
                        <ChartsGrid horizontal />
                        {/* (Opcional) Banda sombreada entre dos Y */}
                        {/* <ChartsReferenceBand
                            y1={120}
                            y2={160}
                            yAxisId="quantities"
                            fillOpacity={0.12}
                        /> */}

                        <ChartsXAxis axisId="quarters" labelStyle={{ fontSize: 25 }} />
                        <ChartsYAxis axisId="quantities" label="" />
                    </ChartContainer>
                </Box>
            }
        </div>
    )
}
