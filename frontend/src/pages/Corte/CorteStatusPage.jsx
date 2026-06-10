import TimeLine from '@components/Corte/TimeLine';
import Loader from '@components/Loader';
import ModalChangeStatusKanban from '@components/ModalChangeStatusKanban';
import Reloj from '@components/Reloj';
import useCaptureScan from '@hooks/useCaptureScan';
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { useEffect, useRef, useState } from "react";
import StockCostura from '../../components/Corte/StockCostura';
import StockCosturaActual from '../../components/Corte/StockCosturaActual';
import { getStockCorteBuffer } from '../../services/LectraService';
import { estadosParateLectra } from '../../utils/Utils';

const CartelParpadeante = ({ text, parpadear = false, className = "" }) => {
    return <span className={`text-xl lg:text-[6rem] min-w-[38rem] block w-full py-10 ${parpadear ? "animate-pulse" : ""} ${className}`}>{text}</span>
}

const screens = {
    // GAP: 1,
    // TIMELINE: 2,
    STOCK: 3,
    STOCK_DIA: 4,
}

// Estados normalizados y helpers
const STATES = {
    EN_PROCESO: 'EN PROCESO',
    PREPARACION: 'PREPARACIÓN',
}

// 15:10 a 15:40
const isCambioTurno = (date) => date.getHours() === 15 && date.getMinutes() >= 10 && date.getMinutes() <= 40

// 00:50 a 06:00 inclusive
const isParadoNocturno = (date) => {
    const h = date.getHours();
    const m = date.getMinutes();
    return (h === 0 && m >= 50) || (h > 0 && h < 6) || (h === 6 && m === 0);
}

export default function CorteStatusPage() {
    const refDiv = useRef()

    const { onKeyDown, finalText } = useCaptureScan()
    const [kanbanScan, setKanbanScan] = useState(null)
    const [ultimosEscaneos, setUltimosEscaneos] = useState([])
    const [screen, setScreen] = useState(screens.STOCK)

    const fetchInfo = async () => {
        refDiv.current?.focus()
        try {
            const temp = await getStockCorteBuffer()

            // console.log(temp?.data)
            if (!temp?.error) {
                const stock = temp?.data?.stockBuffer
                const hoy = new Date()

                const indexHoy = stock.findIndex(d => parseInt(d.dia) == hoy.getDate() && parseInt(d.mes) == hoy.getMonth() + 1)
                if (indexHoy > -1) {
                    stock[indexHoy].sets = parseInt(temp.data.stockBufferHoy?.sets)
                }

                return { planLectra: temp?.data?.planLectra, stockBuffer: stock?.slice(stock?.length - 30), stockDia: temp?.data?.stockBufferCorteHoyModelo }
            }
        } catch (error) {
            console.log("SE PERDIO CONEXION", error)
            return []
        }
    }

    const query = useQuery({ queryKey: ['andon_corte'], queryFn: fetchInfo, refetchInterval: 90_000, refetchIntervalInBackground: true, staleTime: 30_000, });

    useEffect(() => {
        const id = setInterval(() => {
            setScreen((s) => (s === screens.STOCK ? screens.STOCK_DIA : screens.STOCK));
            refDiv.current?.focus()
        }, 30_000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        if (finalText) {
            setKanbanScan(finalText)
        }
    }, [finalText])

    useEffect(() => {
        document.title = "Andon Corte"
        refDiv.current?.focus()
    }, [])

    return (
        <div autoFocus ref={refDiv} tabIndex="0" onKeyDown={onKeyDown} className={`flex w-full flex-col items-start justify-start gap-3 ${screen == screens.STOCK ? 'bg-slate-900' : 'bg-slate-900'} h-lvh overflow-hidden`}>
            <ModalChangeStatusKanban setUltimosEscaneos={setUltimosEscaneos} ultimosEscaneos={ultimosEscaneos} clearData={setKanbanScan} kanban={kanbanScan} />

            {screen == screens.TIMELINE && <TimeLine visible={screen == screens.TIMELINE} />}

            {screen == screens.GAP &&
                <Table
                    bordered={false}
                    rootClassName='!bg-black'
                    className='w-full bg-black mb-10'
                    size='large'
                    loading={{
                        indicator: <Loader fontSize={200} />,
                        spinning: query?.isLoading || query?.isFetching
                    }}

                    rowClassName={(r, idx) => {
                        if (idx % 2 == 0) {
                            return "bg-black font-semibold text-xl w-full"
                        } else {
                            return "bg-black font-semibold text-xl w-full"
                        }
                    }}

                    columns={[
                        {
                            title: <span className="font-bold h-30 flex items-center justify-center text-white ">LEC</span>,
                            key: 'lectra',
                            dataIndex: 'lectra',
                            className: 'font-bold flex items-center justify-center text-white text-xl lg:text-[6rem] !py-4 lg:!py-20 !bg-black',
                            align: "center",
                        },
                        {
                            title: <span className="block font-bold text-white">MOD</span>,
                            key: 'modelo',
                            align: "center",
                            dataIndex: 'modelo',
                            className: `font-bold text-xl lg:text-[6rem] !bg-black text-white`,
                            render: (_, record) => {
                                // console.log(record)
                                if (record?.modelo) {

                                    if (estadosParateLectra?.includes(record?.modelo)) {
                                        return ''
                                    }

                                    if (record?.estado != 'EN PROCESO' && record?.estado != 'PREPARACIÓN') {
                                        return ''
                                    }

                                    const modelos = record?.modelo.split("-")
                                    if (modelos?.length == 1) {
                                        return <span className='block h-full'>{record?.modelo}</span>
                                    } else {
                                        if (modelos?.length == 2) {
                                            return <div className='flex gap-9 flex-col'>
                                                <span className='text-[70%] break-words'>{modelos[0]}</span>
                                                <span className='text-[70%] break-words'>{modelos[1]}</span>
                                            </div>
                                        } else if (modelos?.length == 3) {
                                            return <div className='flex gap-9 flex-col'>
                                                <span className='text-[70%] break-words'>{modelos[0]}</span>
                                                <span className='text-[70%] break-words'>{modelos[1]}</span>
                                                <span className='text-[70%] break-words'>{modelos[2]}</span>
                                            </div>
                                        } else {
                                            return <div className='flex gap-9 flex-col'>
                                                <span className='text-[70%] break-words'>{modelos[0]}</span>
                                                <span className='text-[70%] break-words'>{modelos[1]}</span>
                                            </div>
                                        }
                                    }
                                } else {
                                    return "-"
                                }
                            }
                        },
                        {
                            title: <span className="block font-bold text-white">ESTADO</span>,
                            key: 'estado',
                            dataIndex: 'estado',
                            align: "center",
                            render: (text, record) => {

                                const fecha = new Date()

                                //15:10 a 15:40
                                if (isCambioTurno(fecha)) {
                                    return <CartelParpadeante
                                        parpadear={true}
                                        className={`bg-yellow-400 text-white`}
                                        text={"CAM. TURNO"}
                                    />
                                }

                                //00:50 a 06:00
                                if (isParadoNocturno(fecha)) {
                                    return <CartelParpadeante
                                        parpadear={true}
                                        className={`bg-yellow-400 text-white`}
                                        text={"PARADO"}
                                    />
                                }

                                if (record?.estado === STATES.EN_PROCESO) {
                                    return <CartelParpadeante
                                        parpadear={true}
                                        className={`bg-green-600 text-white`}
                                        text={STATES.EN_PROCESO}
                                    />
                                }

                                if (record?.estado == 'PREPARACIÓN') {
                                    return <CartelParpadeante
                                        parpadear={true}
                                        className={`bg-orange-500 text-white`}
                                        text={"PREPARACIÓN"}
                                    />
                                }

                                if (estadosParateLectra?.includes(record?.estado)) {
                                    return <CartelParpadeante
                                        parpadear={true}
                                        className={`bg-red-600  text-white`}
                                        text={record?.estado}
                                    />
                                }

                                return <CartelParpadeante
                                    parpadear={true}
                                    className={`bg-blue-600 text-white`}
                                    text={"SIN PLAN"}
                                />

                                // if (record?.dadosIniciados?.length == 0) {
                                //     return <CartelParpadeante
                                //         parpadear={true}
                                //         className={`bg-orange-500 text-white`}
                                //         text={"PREPARACIÓN"}
                                //     />

                                // } else if (record?.dadosIniciados?.length > 0) {
                                //     return <CartelParpadeante
                                //         parpadear={true}
                                //         className={`bg-green-600 text-white`}
                                //         text={"EN PROCESO"}
                                //     />
                                // } else {
                                //     return <CartelParpadeante
                                //         parpadear={true}
                                //         className={`bg-blue-600 text-white`}
                                //         text={"SIN PLAN"}
                                //     />
                                // }
                            },
                            className: 'font-bold text-xl lg:text-[6rem] !bg-black'
                        },
                        {
                            title: <span className="block font-bold text-white">PLAN</span>,
                            key: 'plan',
                            align: "center",
                            dataIndex: 'plan',
                            className: 'font-bold text-xl lg:text-[6rem] !bg-black text-white',
                            // render: (_, record) => record?.finEstimado
                        },
                        {
                            title: <span className="block font-bold text-white">REAL</span>,
                            key: 'real',
                            align: "center",
                            dataIndex: 'real',
                            className: 'font-bold text-xl lg:text-[6rem] !bg-black text-white'
                        },
                        {
                            title: <span className="block font-bold text-white">GAP</span>,
                            key: 'gap',
                            align: "center",
                            dataIndex: 'gap',
                            className: 'font-bold text-xl lg:text-[6rem] !bg-black',
                            render: (text, record) => {
                                return <span className={`${record?.gap !== '00:00' ? 'text-red-500' : 'text-green-500'} flex items-center gap-1 justify-center`}>{text}</span>
                            }
                        },
                        {
                            title: <span className="block font-bold text-white">PRÓX</span>,
                            key: 'prox',
                            align: "center",
                            dataIndex: 'prox',
                            className: 'font-bold text-xl lg:text-[6rem] !bg-black text-white',
                            render: (_, record) => {
                                if (record?.prox != '-') {
                                    const modelos = record?.prox?.split("-")
                                    if (modelos?.length == 1) {
                                        return <span className='block h-full'>{record?.prox}</span>
                                    } else {
                                        if (modelos?.length == 2) {
                                            return <div className='flex gap-9 flex-col'>
                                                <span className='text-[70%] break-words'>{modelos[0]}</span>
                                                <span className='text-[70%] break-words'>{modelos[1]}</span>
                                            </div>
                                        } else if (modelos?.length >= 3) {
                                            return <div className='flex gap-9 flex-col'>
                                                <span className='text-[60%] break-words'>{modelos[0]}</span>
                                                <span className='text-[60%] break-words'>{modelos[1]}</span>
                                                <span className='text-[60%] break-words'>{modelos[2]}</span>
                                            </div>
                                        }
                                    }
                                } else {
                                    return "-"
                                }
                            }
                        },
                    ]}

                    locale={{
                        emptyText:
                            <div className='!bg-black p-0 w-full text-white h-[50vh] flex items-center justify-center'>
                                <span className='text-9xl font-semibold'>SIN PLAN CARGADO</span>
                            </div>
                    }}

                    pagination={false}
                    rowKey={row => row.lectra}
                    dataSource={query?.data?.planLectra}
                />
            }

            {screen == screens.STOCK &&
                <div className='w-full h-screen'>
                    <StockCostura isLoading={query?.isLoading || query?.isFetching} data={query?.data?.stockBuffer} />
                </div>
            }

            {screen == screens.STOCK_DIA &&
                <div className='w-full h-screen'>
                    <StockCosturaActual isLoading={query?.isLoading || query?.isFetching} data={query?.data?.stockDia} />
                </div>
            }

            <div className={`flex items-start w-full gap-4 mt-1`}>
                <div className='flex text-start flex-col gap-3 items-start w-[74%] px-2'>
                    <span className='text-8xl w-full block text-center font-bold border-black bg-yellow-400 py-4'>ÚLTIMOS ESCANEOS</span>
                    <div className='flex text-start gap-6 items-start w-full px-2'>
                        {ultimosEscaneos?.slice(0, 5)?.map((u, idx) => {
                            return <span key={idx} className='text-9xl text-white font-bold block text-start whitespace-nowrap'>-{u?.cantidad * 10}X {u?.modelo}</span>
                        })}
                    </div>
                </div>

                <div className='border-8 border-white px-4 py-2 flex !w-[26%] h-full flex-col items-center bg-black'>
                    {/* <span className='text-white text-8xl font-bold'>HORA</span> */}
                    <Reloj className='text-white text-[15rem] font-semibold' />
                </div>
            </div>
        </div>
    )
}
