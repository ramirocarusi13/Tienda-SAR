import TimeLineLectra from '@components/Corte/TimeLineLectra';
import Loader from '@components/Loader';
import Reloj from '@components/Reloj';
import { getEstadoLectrasTimeline } from '@services/LectraService';
import { useQuery } from '@tanstack/react-query';
import { estadosParateLectra, formatTime, getFormatLengthZero } from '@utils/Utils';
import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import { FaRegCirclePlay } from "react-icons/fa6";

function validaTurnoManana(fecha) {
    const inicioTurnoManana = new Date()
    const finTurnoManana = new Date()

    inicioTurnoManana.setHours(6, 13, 0)
    finTurnoManana.setHours(15, 11, 0)

    // inicioTurnoManana.setHours(6, 13, 0)
    // finTurnoManana.setHours(9, 30, 0)

    return fecha.valueOf() >= inicioTurnoManana.valueOf() && fecha.valueOf() <= finTurnoManana.valueOf();
    // return inicioTurnoManana.valueOf() <= fecha.valueOf() && fecha.valueOf() <= finTurnoManana.valueOf();
}

// function terminaEnTurnoMañana(fecha) {
//     const finTurnoManana = new Date()
//     finTurnoManana.setHours(15, 11, 0)
//     // finTurnoManana.setHours(9, 30, 0)

//     return fecha.valueOf() <= finTurnoManana.valueOf();
// }

// const difHoras = (horaF, horaI, format = false) => {

//     let minutosTotal = 0;
//     const horasI = horaI?.split(":")
//     const horasF = horaF?.split(":")

//     let hora = horasF[0] - horasI[0]
//     let minutos = horasF[1] - horasI[1]

//     if (format) {
//         if (minutos < 0) {
//             minutos = 60 + minutos
//             hora = hora - 1

//             if (hora < 0) {
//                 hora = 0
//             }
//         }
//     } else {
//         minutosTotal = minutos + (hora * 60)
//     }

//     // console.log(horaI, horaF, `${getFormatLengthZero(hora, 2)}:${getFormatLengthZero(minutos, 2)}`)
//     if (format) {
//         return `${getFormatLengthZero(hora, 2)}:${getFormatLengthZero(minutos, 2)}`
//     } else {
//         return minutosTotal;
//     }
// }

export default function EstadoLectraPage({ lectra }) {

    const [estadoFrenada, setEstadoFrenada] = useState(null)
    const [gralError, setGralError] = useState(null)

    const fetchData = async () => {
        let tmpDataLectra, tmpDados, data

        try {
            const temp = await getEstadoLectrasTimeline()
            if (temp?.error) {
                setGralError(temp?.message)
                return;
            }

            setGralError(null)
            const dadosTemp = temp?.data?.dados?.filter(d => d.lectra == lectra)

            const now = new Date();
            const turnoActual = validaTurnoManana(now) ? "MAÑANA" : "TARDE"

            // setData(temp?.data?.planificacion?.filter(d => d.lectra == lectra))
            data = temp?.data?.planificacion?.filter(d => d.lectra == lectra)
            // setDados(dadosTemp)
            tmpDados = dadosTemp
            const tiemposMuertos = []

            let min_total = 0, hour_total = 0, dados = 0, dados_c = 0, gap = 0, gapR = ''
            let hour_gap = 0, min_gap = 0, min_eficiencia = 0, eficiencia = 0, horaFinPlanificado = ''
            let hour_cortados = 0, min_cortados = 0, hour_pendientes = 0, min_pendientes = 0

            dadosTemp?.filter(p => p?.group == `R-${lectra}`)?.map(d => {
                let dem;
                if (estadosParateLectra?.includes(d?.dado)) {
                    if (d?.fin_real_dado == null) {
                        setEstadoFrenada(d?.dado)
                    }
                }

                const tempDuracion = d?.duracion_real?.split(":")
                if (d?.duracion_real != null) {
                    min_total = min_total + parseInt(tempDuracion[1])
                    hour_total = hour_total + parseInt(tempDuracion[0])
                }

                dados = dados + 1
                if (d?.fin_real_dado != null) {
                    dados_c = dados_c + 1
                    hour_cortados = hour_cortados + parseInt(tempDuracion[0])
                    min_cortados = min_cortados + parseInt(tempDuracion[1])
                }

                let h, m
                if (turnoActual == "MAÑANA") {
                    gap = gap + parseInt(d?.demoraTM)
                    dem = gapR?.split(":")

                    if (gapR?.length > 0) {
                        m = parseInt(dem[1]) + parseInt(d?.demoraTM)
                        h = parseInt(dem[0])
                    } else {
                        m = parseInt(d?.demoraTM)
                        h = 0
                    }

                    if (m > 60) {
                        m = m / 60
                        h = h + parseInt(m)
                        m = (m - parseInt(m)) * 60
                    }
                    gapR = `${getFormatLengthZero(h, 2)}:${getFormatLengthZero(m.toFixed(0), 2)}`
                } else {
                    gap = gap + parseInt(d?.demoraTT)

                    dem = gapR?.split(":")

                    if (gapR?.length > 0) {
                        m = parseInt(dem[1]) + parseInt(d?.demoraTT)
                        h = parseInt(dem[0])
                    } else {
                        m = parseInt(d?.demoraTT)
                        h = 0
                    }

                    if (m > 60) {
                        m = m / 60
                        h = h + parseInt(m)
                        m = (m - parseInt(m)) * 60
                    }
                    gapR = `${getFormatLengthZero(h, 2)}:${getFormatLengthZero(m.toFixed(0), 2)}`
                }
                horaFinPlanificado = d?.horaFin
            })

            min_pendientes = Math.abs(min_total - min_cortados)
            hour_pendientes = hour_total - hour_cortados
            if (min_pendientes >= 60) {
                min_pendientes = min_pendientes / 60
                hour_pendientes = hour_pendientes + parseInt(min_pendientes)
                min_pendientes = parseInt((min_pendientes - parseInt(min_pendientes)) * 60)
            }

            min_total = 52
            hour_total = 8

            if (min_cortados >= 60) {
                min_cortados = min_cortados / 60
                hour_cortados = hour_cortados + parseInt(min_cortados)
                min_cortados = parseInt((min_cortados - parseInt(min_cortados)) * 60)
            }

            if (min_cortados >= 60) {
                min_cortados = min_cortados / 60
                hour_cortados = hour_cortados + parseInt(min_cortados)
                min_cortados = parseInt((min_cortados - parseInt(min_cortados)) * 60)
            }

            if (gap > 0) {
                // GAP EN MINUTOS
                min_gap = gap / 60
                hour_gap = hour_gap + parseInt(min_gap)
                min_gap = parseInt((min_gap - parseInt(min_gap)) * 60)
            }

            min_eficiencia = min_total + min_gap + ((hour_gap + hour_total) * 60)

            if (min_eficiencia == 0) {
                eficiencia = 0
            } else {
                eficiencia = parseInt(((min_total + (hour_total * 60)) / min_eficiencia) * 100)
            }

            tmpDataLectra = {
                gap: gapR, //`${getFormatLengthZero(hour_gap, 2)}:${getFormatLengthZero(min_gap, 2)}`,
                eficiencia: eficiencia,
                t_plan: `${getFormatLengthZero(hour_total, 2)}:${getFormatLengthZero(min_total, 2)}`,
                t_cortados: `${getFormatLengthZero(hour_cortados, 2)}:${getFormatLengthZero(min_cortados, 2)}`,
                t_pendientes: `${getFormatLengthZero(hour_pendientes, 2)}:${getFormatLengthZero(min_pendientes, 2)}`,
                dados_totales: dados,
                dados_cortados: dados_c,
                dados_pendientes: dados - dados_c,
                ocupacion: '00:00',//`${getFormatLengthZero(hour_ocupacion, 2)}:${getFormatLengthZero(min_ocupacion, 2)}`,
                tiemposMuertos: tiemposMuertos,
                horaFin: '00:00',
                horaFinPlanificado: horaFinPlanificado,
                dados: tmpDados,
                data: data,
                turno: turnoActual
            }
        } catch (error) {
            tmpDataLectra = {
                gap: '00:00',
                eficiencia: '0%',
                t_plan: '00:00',
                t_cortados: '00:00',
                t_pendientes: '00:00',
                dados_totales: [],
                dados_cortados: [],
                dados_pendientes: 0,
                ocupacion: '00:00',
                tiemposMuertos: [],
                horaFin: '00:00',
                horaFinPlanificado: '00:00',
                dados: tmpDados,
                data: data,
                turno: null

            }
        }

        return tmpDataLectra
    }

    const query = useQuery({ queryKey: [`estado_lectra_${lectra}`], queryFn: fetchData, staleTime: 1000, refetchInterval: 60000 })

    useEffect(() => {
        fetchData()
    }, [])

    if (gralError) {
        return <div className='w-full h-[100vh] flex flex-col items-center gap-4 justify-center bg-white'>
            <Loader fontSize={100} />
            <span className='text-center text-6xl block w-full text-red-500 font-bold'>{gralError?.toUpperCase()}</span>
        </div>
    }

    return (
        <div className='flex flex-col w-full  h-full px-4 py-2'>
            <div className='w-full py-1 flex justify-between items-center'>

                <div className='text-nowrap bg-blue-500 py-1 px-4'>
                    <span className='block w-full text-start min-w-[200px] text-5xl font-bold text-white'>LECTRA {lectra}</span>
                </div>

                {estadoFrenada &&
                    <div className='w-full bg-red-500 py-1 px-4'>
                        <span className='text-white text-5xl text-center block animate-pulse font-bold'>{estadoFrenada}</span>
                    </div>
                }

                <div className='w-full bg-green-300 py-1 px-4'>
                    <span className='text-5xl text-center justify-center gap-2 flex items-center animate-pulse font-bold'>TURNO {query?.data?.turno}</span>
                </div>

                <div className=' bg-white py-1 px-4 text-end'>
                    <Reloj className='text-5xl font-bold text-black' />
                </div>
            </div>

            {!query.isFetching &&
                <div className='flex flex-col w-full gap-1'>
                    <TimeLineLectra
                        hoursQty={4}
                        classNames="!w-full "
                        data={query?.data?.dados ? query?.data?.dados : []}
                        size="large"
                        groups={[
                            { id: `P-${lectra}`, title: `PLAN`, bg: 'bg-slate-200' },
                            { id: `R-${lectra}`, title: 'REAL', bg: 'bg-yellow-200' },
                        ]}
                    />

                    <div className='w-full flex px-3'>
                        <div className='flex flex-col gap-2 w-full'>
                            <div className='flex items-center justify-between gap-4 mt-1'>

                                <div className={`flex gap-2 items-center px-8 justify-center py-1 rounded-lg ${query?.data?.gap != '00:00' ? 'bg-red-500' : 'bg-green-400'} w-full`}>
                                    <span className='text-black text-4xl font-bold'>GAP TURNO</span>
                                    <span className='text-black text-4xl font-bold'>{query?.data?.gap}</span>
                                </div>

                                <div className={`flex  gap-2  items-center justify-center px-8 py-1 rounded-lg ${query?.data?.eficiencia >= 90 ? 'bg-green-500' : (query?.data?.eficiencia < 60 ? 'bg-red-500' : 'bg-orange-400')} w-full`}>
                                    <span className='text-black text-4xl font-bold'>OA</span>
                                    <span className='text-black text-4xl font-bold'>{query?.data?.eficiencia}%</span>
                                </div>

                                <div className={`flex  gap-2  items-center px-8 justify-center py-1 rounded-lg bg-blue-300 w-full`}>
                                    <span className='text-black text-4xl font-bold'>FIN PLAN</span>
                                    <span className='text-black text-4xl font-bold'>{query?.data?.horaFinPlanificado}</span>
                                </div>
                            </div>

                            <div className='w-full flex items-start'>
                                <Table
                                    size='small'
                                    className='!bg-white w-full mt-0'
                                    rootClassName='!bg-white'
                                    rowClassName={(record) => {
                                        let className = '!bg-white'

                                        if (record?.inicio_real_dado != null && record?.fin_real_dado == null) {
                                            className = '!bg-green-500 animate-pulse'
                                        }
                                        return ` !text-black text-2xl font-bold ${className}`
                                    }}
                                    pagination={false}
                                    dataSource={query?.data?.dados?.filter(d => d.group == `R-${lectra}`)?.filter(d => d.modelo != 'CAM. TURNO')?.filter(d => d?.fin_real_dado == null)?.filter(d => !estadosParateLectra?.includes(d?.dado))?.slice(0, 10)}
                                    rowKey={r => r.dado + r.horaInicio}
                                    loading={query?.isFetching}
                                    columns={[
                                        {
                                            dataIndex: 'modelo',
                                            title: <span className='font-bold'>MODELO</span>,
                                            className: "text-2xl font-bold "
                                        },
                                        {
                                            dataIndex: 'mat',
                                            title: <span className='font-bold'>MATERIAL</span>,
                                            className: "text-2xl font-bold",
                                            render: (_, record) => {
                                                if (record?.material) {
                                                    return <span className='flex items-center gap-3'>{(record?.inicio_real_dado != null && record?.fin_real_dado == null) && <FaRegCirclePlay className='text-white' />}{record?.material?.codigo_interno} - {record?.material?.nombre}</span>
                                                } else {
                                                    return <span className='bg-red-500 animate-pulse px-2'>SIN INFORMACIÓN - CONSULTAR CON CORTE</span>
                                                }
                                            }
                                        },
                                        {
                                            dataIndex: 'horaInicio',
                                            className: "text-2xl font-bold",
                                            title: <span className='font-bold'>INICIO</span>,
                                            align: 'center',
                                            render: (text, record) => {

                                                if (record?.inicio_real_dado != null) {
                                                    return formatTime(record?.inicio_real_dado)
                                                } else {
                                                    return text
                                                }
                                            }
                                        },
                                        // {
                                        //     dataIndex: 'hora_fin_plan',
                                        //     className: "text-2xl font-bold",
                                        //     title: <span className='font-bold'>FIN PLAN</span>,
                                        //     align: 'center',
                                        //     render: (text, record) => {

                                        //         if (record?.inicio_real_dado != null) {
                                        //             return record?.hora_fin_plan
                                        //         } else {

                                        //             return ''
                                        //         }
                                        //     }
                                        // },
                                        {
                                            dataIndex: 'horaFin',
                                            className: "text-2xl font-bold",
                                            title: <span className='font-bold'>FIN</span>,
                                            align: 'center',
                                            render: (text, r) => {

                                                if (r?.fin_estimado == null) {
                                                    return text
                                                } else {
                                                    return formatTime(r?.fin_estimado)
                                                }
                                            }

                                        },
                                        {
                                            dataIndex: 'duracion_real',
                                            className: "text-2xl font-bold",
                                            title: <span className='font-bold'>DURACIÓN</span>,
                                            align: 'center',
                                            // render: (text) => {
                                            //     return text
                                            // }
                                        },

                                        {
                                            dataIndex: 'abastecido',
                                            align: 'center',
                                            className: "text-2xl font-semibold",
                                            title: <span className='font-bold'>PC</span>,
                                            render: (text, record) => {
                                                if (record?.inicio_real_dado != null && record?.fin_real_dado == null) {
                                                    return <Tag className='text-2xl' color='green-inverse'>EN CORTE</Tag>
                                                } else {
                                                    if (text == "1") {
                                                        return <Tag className='text-2xl' color='blue-inverse'>ABASTECIDO</Tag>
                                                    } else {
                                                        return <Tag className='text-2xl' color='red-inverse'>PENDIENTE</Tag>
                                                    }
                                                }
                                            }
                                        }
                                    ]}
                                />

                            </div>

                        </div>
                    </div>
                </div>
            }

            {query.isFetching &&
                <div className='w-full h-full flex flex-col gap-4 items-center justify-center mt-10'>
                    <Loader fontSize={200} />
                    <span className='font-semibold text-6xl'>ACTUALIZANDO</span>
                </div>
            }
        </div>
    )
}
