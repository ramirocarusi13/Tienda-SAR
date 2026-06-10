import Loader from "@components/Loader";
import { useQuery } from '@tanstack/react-query';
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import { getPlanHoraHora } from '../../services/HoraHoraService';
import { aunNoPasoIntervalo, findIntervalIndex } from "../../utils/UtilsAndonHoraHora";


function startMinutes(intervalo) {
    const [start] = splitInterval(intervalo);
    return hmToMinutes(start);
}

function endMinutes(intervalo) {
    const [, end] = splitInterval(intervalo);
    return hmToMinutes(end);
}

function splitInterval(str) {
    // Soporta "06:12 - 07:00", "06:12–07:00", etc.
    const m = String(str).match(/(\d{1,2}:\d{2}).*?(\d{1,2}:\d{2})/);
    return m ? [m[1], m[2]] : ["00:00", "23:59"];
}

function hmToMinutes(hm) {
    const [h, m] = hm.split(":").map(Number);
    return h * 60 + m;
}

const TitleHeader = (text, text2 = null) => {
    return <div className='flex flex-col gap-0 text-xl'>
        <span className='font-bold text-center w-full block'>{text?.toUpperCase()}</span>
        {text2 && <span className='font-bold text-center w-full block'>{text2?.toUpperCase()}</span>}
    </div>
}

const columns = [
    {
        title: TitleHeader("Intervalo"),
        dataIndex: 'intervalo',
        key: 'intervalo',
        className: 'text-2xl text-center !px-0 !mx-0 font-semibold'
    },
    {
        title: TitleHeader("Plan", "Hora"),
        dataIndex: 'plan',
        key: 'plan',
        className: 'text-2xl text-center font-semibold '
    },
    {
        title: TitleHeader("Plan", "Acum."),
        dataIndex: 'plan_acumulado',
        key: 'plan_acumulado',
        className: 'text-2xl text-center font-semibold'
    },
    {
        title: TitleHeader("Modelo"),
        dataIndex: 'modelo',
        key: 'modelo',
        className: 'text-2xl text-center font-semibold'
    },
    {
        title: TitleHeader("Real"),
        dataIndex: 'real',
        key: 'real',
        colSpan: 2,
        className: 'text-2xl text-center font-semibold',
        render: (text, r) => {
            if (parseInt(text) >= 0) {
                return <div className={`${parseInt(text) < r?.plan ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#15803d]'} py-0 text-2xl font-bold w-full block `}>{text}</div>
            }
        }
    },
    {
        title: '',
        dataIndex: 'acumulado',
        key: 'acumulado',
        colSpan: 0,
        className: 'text-2xl text-center font-semibold',
        render: (text, r) => {
            if (parseInt(text) > 0) {
                return <div className={`${parseInt(text) < r?.plan_acumulado ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#15803d]'} py-0 text-2xl font-bold w-full block `}>{text}</div>
            }
        }
    },
    {
        title: TitleHeader("Dif."),
        dataIndex: 'diferencia',
        key: 'diferencia',
        colSpan: 2,
        className: 'text-2xl text-center font-semibold',
        render: (text, r) => {
            if (parseInt(r?.real) >= 0) {
                return <div className={`${parseInt(text) < 0 ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#15803d]'} py-0 text-2xl font-bold w-full block `}>{text}</div>
            }
        }
    },
    {
        title: '',
        dataIndex: 'diferencia_acumulado',
        key: 'diferencia_acumulado',
        colSpan: 0,
        className: 'text-2xl text-center font-semibold',
        render: (text, r) => {
            if (parseInt(r?.real) >= 0) {
                return <div className={`${parseInt(text) < 0 ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#dcfce7] text-[#15803d]'} py-0 text-2xl font-bold w-full block `}>{text}</div>
            }
        }
    },
    {
        title: TitleHeader("OA"),
        dataIndex: 'oa',
        key: 'oa',
        className: 'text-2xl text-center font-semibold',
        render: (text, r) => {
            if (parseInt(r?.oa) >= 0) {
                return <div className={`${parseInt(text) < 90 ? 'bg-[#fee2e2] text-[#b91c1c]' : (parseInt(text) < 95 ? 'bg-[#fef3c7] text-[#92400e]' : 'bg-[#dcfce7] text-[#15803d]')} py-0 text-2xl font-bold w-full block `}>{text}%</div>
            }
        }
    },
    {
        title: TitleHeader("Piezas", "Rep."),
        dataIndex: 'piezas_reparadas',
        key: 'piezas_reparadas',
        className: 'text-2xl text-center font-semibold'
    },
    // {
    //     title: TitleHeader("Piezas", "Scrap"),
    //     dataIndex: 'piezas_scrap',
    //     key: 'piezas_scrap',
    //     className: 'text-2xl text-center font-semibold'
    // },
    {
        title: TitleHeader("Paradas", "(Min.)"),
        dataIndex: 'min_paradas',
        key: 'min_paradas',
        className: 'text-2xl text-center font-semibold',
        render: (_, r) => {

            // console.log(r)
            let total = 0

            total = total + (r?.RRHH ? parseInt(r?.RRHH) : 0)
            total = total + (r?.KZN ? parseInt(r?.KZN) : 0)
            total = total + (r?.QC ? parseInt(r?.QC) : 0)
            total = total + (r?.MH ? parseInt(r?.MH) : 0)
            total = total + (r?.MTTO ? parseInt(r?.MTTO) : 0)

            return total

        }
    }
]

export default function HoraHoraTurno({ turno, linea, pos = 0, subtitulo = '' }) {
    // const [paradas, setParadas] = useState([])
    const [paradasDetalle, setParadasDetalle] = useState([])
    const [dataSource, setDataSource] = useState([])
    const [datos, setDatos] = useState({
        volumen: 0,
        volumenReal: 0,
        ef: 0,
        oa: 0,
        paradas: 0
    })

    const fectchPlan = async () => {
        const now = new Date();
        const minutesNow = (now.getHours() * 60) + now.getMinutes();
        // No consultar entre las 01:00 y las 06:10
        if (minutesNow >= 60 && minutesNow <= 370) {
            return { fechaActualizacion: now, saltado: true };
        }

        const response = await getPlanHoraHora({
            linea: linea,
            turno: '',
            fecha: pos > 0 ? 'CHECK' : '',
            nombreTurno: turno,
            actualiza: true
        })

        if (!response.error) {
            let hc = 0, ttime = 0
            if (linea == 1) {
                hc = 21
                ttime = 159.4
            } else if (linea == 2) {
                hc = 16
                ttime = 169
            } else if (linea == 3) {
                hc = 10
                ttime = 229
            } else if (linea == 4) {
                hc = 7
                ttime = 239
            } else if (linea == 5) {
                hc = 8
                ttime = 382
            } else if (linea == 6) {
                hc = 4
                ttime = 399
            } else if (linea == 9) {
                hc = 1
                ttime = 111
            } else if (linea == 10) {
                hc = 7
                ttime = 334
            } else if (linea == 10) {
                hc = 5
                ttime = 0
            }

            let volumen = response?.data?.data?.reduce((p, c) => p + parseInt(c.plan), 0)
            let real = response?.data?.data?.reduce((p, c) => {
                if (c) {
                    if (c?.real) {
                        return p + parseInt(c.real)
                    }
                }

                return p
            }, 0)

            // console.log(volumen)
            // console.log(response?.data?.data)

            const intervalos = response.data?.data
            const now = new Date();
            const manana = new Date();
            manana.setDate(manana.getDate() + 1)

            if (pos == 0) {
                const currentIndex = intervalos.findIndex((intervalo) => findIntervalIndex(intervalo, now));
                const activeIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;

                intervalos.forEach((intervalo, iIndex) => {
                    const isActive = iIndex === activeIndex;
                    const isCurrent = iIndex === currentIndex;

                    intervalo.oa = ((parseInt(intervalo.acumulado) * 100) / parseInt(intervalo.plan_acumulado))?.toFixed(0)

                    if (isActive) {
                        volumen = intervalo.plan_acumulado
                        real = intervalo.acumulado

                        intervalo.actual = true
                        intervalo.bg = 'bg-green-100 animate-pulse'
                    } else {
                        if (isCurrent) {
                            intervalo.bg = 'bg-white'
                        } else if (aunNoPasoIntervalo(intervalo, now)) {
                            intervalo.bg = 'bg-white'
                        } else {
                            if (parseInt(intervalo?.real) <= 0 || intervalo.real == null) {
                                intervalo.bg = 'bg-red-200 animate-pulse'
                            } else {
                                intervalo.bg = ''
                            }
                        }
                        intervalo.actual = false
                    }
                });
            } else {
                intervalos.forEach((intervalo, iIndex) => {
                    intervalo.oa = ((parseInt(intervalo.acumulado) * 100) / parseInt(intervalo.plan_acumulado))?.toFixed(0)
                });
            }

            const minParadas = response?.data?.data?.reduce((p, c) => {
                let total = p

                total = total + (c?.RRHH ? parseInt(c?.RRHH) : 0)
                total = total + (c?.KZN ? parseInt(c?.KZN) : 0)
                total = total + (c?.QC ? parseInt(c?.QC) : 0)
                total = total + (c?.MH ? parseInt(c?.MH) : 0)
                total = total + (c?.MTTO ? parseInt(c?.MTTO) : 0)

                return total
            }, 0)




            if (isNaN(real)) {
                real = 0
            }

            let tSoporte = parseInt(response.data?.soporte?.soporte)
            if (isNaN(tSoporte)) {
                tSoporte = 0
            }

            let ef = 0, oa = 0, hsReales = 0

            if (real > 0) {
                hsReales = ((7.97 * hc) + tSoporte - minParadas) / real
            } else {
                hsReales = 1
            }

            // console.log("VOLUMEN", volumen)

            if (volumen > 0) {
                if (real == 0) {
                    ef = 0
                    oa = 0
                } else {
                    ef = (((7.97 * hc) / volumen) / hsReales) * 100
                    // oa = ((real * ttime) / (3600 * 7.97)) * 100
                    oa = (real / volumen) * 100
                }
            } else {
                ef = 0;
                oa = 0
            }

            setDatos({
                volumen: volumen,
                volumenReal: real,
                ef: ef?.toFixed(2),
                oa: oa?.toFixed(0),
                paradas: minParadas
            })

            // console.log(response?.data?.paradasDetalle)

            setDataSource(intervalos)

            const sorted = response?.data?.paradasDetalle?.filter(p => p?.causa != '' && p?.causa != null).slice().sort((a, b) => {
                const sa = startMinutes(a.intervalo);
                const sb = startMinutes(b.intervalo);
                if (sa !== sb) return sa - sb;

                // desempate por fin del intervalo
                const ea = endMinutes(a.intervalo);
                const eb = endMinutes(b.intervalo);
                if (ea !== eb) return ea - eb;

                // último desempate estable
                return new Date(a.created_at) - new Date(b.created_at);
            });

            setParadasDetalle(sorted)
            // setParadasDetalle(response?.data?.paradasDetalle)

            return { fechaActualizacion: new Date() }
        }

        return []
    }

    const query = useQuery({ queryKey: [`hora_hora_${linea}`], queryFn: fectchPlan, staleTime: 30000, refetchInterval: 120000, refetchIntervalInBackground: true })

    useEffect(() => {
        if (turno) {
            fectchPlan()
        }
    }, [turno])

    return (
        <div className='relative flex flex-col gap-1 w-full'>

            {(query?.isFetching || query?.isLoading) &&
                <div className='absolute w-full h-full flex items-center justify-center z-10 bg-[#f5f5f5a1]'>
                    <Loader fontSize={250} />
                </div>
            }

            <div className="flex flex-col gap-1 w-full">
                {/* {(!query?.isFetching && pos == 0) && <span className='text-xs text-gray-600 font-semibold w-full text-center'>Actualizado {formatDateTime(query?.data?.fechaActualizacion, true)}</span>} */}
                <span className={`${turno == 'B' ? 'bg-blue-300 text-white' : 'bg-yellow-300 text-black'} text-4xl py-2  block text-center font-bold`}>TURNO {turno == "B" ? "BLANCO" : "AMARILLO"} {subtitulo && `(${subtitulo})`}</span>
            </div>

            <div className='flex items-center gap-10 py-0 justify-center'>
                <span className={`font-bold text-5xl ${datos?.oa < 90 ? 'bg-red-500' : ((datos?.oa >= 90 && datos?.oa < 95) ? 'bg-yellow-500' : 'bg-green-500')} p-2`}>OA: {datos?.oa}%</span>
                {/* <span className={`font-bold text-5xl ${datos?.ef < 90 ? 'bg-red-500' : 'bg-green-400'} p-2`}>EF: {datos?.ef}%</span> */}
                <span className='font-bold text-5xl p-2'>VOL: {datos?.volumenReal}/{datos?.volumen}</span>
            </div>

            <Table
                pagination={false}
                bordered
                size='small'
                columns={columns}
                dataSource={dataSource}
                rowKey={r => r.id}
                rowClassName={(r, idx) => {
                    if (r?.bg) {
                        return r.bg
                    } else {
                        if (idx % 2 != 0) {
                            return 'bg-gray-100'
                        }
                    }
                }}
                summary={pageData => {
                    let piezasReparadas = 0;
                    let piezasScrap = 0;
                    let paradas = 0;

                    pageData.forEach((r) => {
                        piezasReparadas += parseInt(r?.piezas_reparadas);
                        piezasScrap += parseInt(r?.piezas_scrap);

                        paradas = paradas + (r?.RRHH ? parseInt(r?.RRHH) : 0)
                        paradas = paradas + (r?.KZN ? parseInt(r?.KZN) : 0)
                        paradas = paradas + (r?.QC ? parseInt(r?.QC) : 0)
                        paradas = paradas + (r?.MH ? parseInt(r?.MH) : 0)
                        paradas = paradas + (r?.MTTO ? parseInt(r?.MTTO) : 0)
                    });
                    return (
                        // <>
                        <Table.Summary.Row className="!py-0">
                            <Table.Summary.Cell colSpan={9} index={0}></Table.Summary.Cell>
                            <Table.Summary.Cell className="text-xl text-center font-bold" index={1}>{piezasReparadas}</Table.Summary.Cell>
                            {/* <Table.Summary.Cell className="text-xl text-center font-bold" index={2}>{piezasScrap}</Table.Summary.Cell> */}
                            <Table.Summary.Cell className="text-xl text-center font-bold" index={3}>{paradas}</Table.Summary.Cell>
                        </Table.Summary.Row>

                        // </>
                    );
                }}
            />

            <div className='flex items-center justify-center w-full gap-2'>

                <Table
                    className="w-full px-4"
                    // pagination={{
                    //     pageSize: 3
                    // }}
                    rowKey={r => r.id}
                    pagination={false}
                    size="small"
                    dataSource={paradasDetalle}
                    // dataSource={paradasDetalle?.filter(p => p?.causa != '' && p?.causa != null)}
                    columns={[
                        {
                            dataIndex: 'intervalo',
                            title: 'Int.',
                            // render: (_, r) => `${r?.grupo}`,
                            className: '!text-xs '
                        },
                        {
                            dataIndex: 'minutos',
                            title: 'Minutos',
                            key: 'minutos',
                            className: '!text-xs'
                        },
                        {
                            dataIndex: 'causa',
                            title: 'Causa',
                            key: 'causa',
                            className: '!text-xs'
                        },
                        {
                            dataIndex: 'contramedida',
                            title: 'Contramedida',
                            key: 'contramedida',
                            className: '!text-xs'
                        }
                    ]}
                />

                {/* <div className='w-full  flex items-center justify-center'>
                    <ChartTiemposMuertos
                        title={"Tiempos muertos por motivo"}
                        dataSource={paradas?.filter(p => parseInt(p?.cantidad) > 0)?.map(p => {
                            return {
                                nombre: p?.grupo + '-' + p?.categoria,
                                cantidad: parseInt(p?.cantidad)
                            }
                        })}

                    />
                </div> */}
            </div>
        </div>
    )
}
