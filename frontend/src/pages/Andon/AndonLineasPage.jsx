import Loader from "@components/Loader";
import Reloj from "@components/Reloj";
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import ChartBarraDefectos from '../../components/Qc/ChartBarraDefectos';
import ChartBarraOperacionesDefectos from '../../components/Qc/ChartBarraOperacionesDefectos';
import { getFmdsLinea, getPlanHoraHora } from "../../services/HoraHoraService";
import { formatDateEn } from '../../utils/Utils';

const getHcTTime = (linea) => {
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

    return { hc: hc, ttime: ttime }
}

const bgColor = (valor) => {

    if (valor < 50) {
        // return '!bg-green-500 text-black'
        return '!bg-red-500 text-black'
    } else if (valor >= 50 && valor < 80) {
        return '!bg-yellow-300 text-black'
    } else if (valor >= 80 && valor < 90) {
        return '!bg-green-300 text-black'
    } else {
        return '!bg-green-500 text-black'
    }
}

function estaEnHorario(cadenaHorario) {
    const [inicioStr, finStr] = cadenaHorario.split(' - ');
    const ahora = new Date();

    // Crear fechas completas usando la fecha actual
    const hoy = ahora.toISOString().split('T')[0]; // YYYY-MM-DD

    const inicio = new Date(`${hoy}T${inicioStr}:00`);
    const fin = new Date(`${hoy}T${finStr}:00`);

    return ahora >= inicio && ahora <= fin;
}

function estaEnRango(cadenaHorario) {
    const [inicioStr, finStr] = cadenaHorario.split(' - ');
    const ahora = new Date();
    let inicio
    // Crear fechas completas usando la fecha actual

    const hoy = ahora.toISOString().split('T')[0]; // YYYY-MM-DD

    if (cadenaHorario.includes("00:00")) {
        const manana = new Date(ahora)
        manana.setDate(ahora.getDate() + 1);
        const mananaStr = manana.toISOString().split('T')[0]; // YYYY-MM-DD
        inicio = new Date(`${mananaStr}T${inicioStr}:00`);
    } else {
        inicio = new Date(`${hoy}T${inicioStr}:00`);
    }

    return (ahora >= inicio);
}

const getTurno = () => {
    let turno = 'M'
    const now = new Date()
    if (now.getHours() >= 15) {
        if (now.getHours() == 15 && now.getMinutes() > 40) {
            turno = 'T'
        } else if (now.getHours() == 15) {
            turno = 'M'
        } else {
            turno = 'T'
        }
    }

    return turno
}

export default function AndonLineasPage() {
    const [searchParams] = useSearchParams();

    const linea = searchParams.get('linea') || 1;

    const fetchData = async () => {
        const now = new Date()
        let turno = getTurno()

        const data = await getPlanHoraHora({
            turno: turno,
            linea: linea,
            fecha: formatDateEn(now),
            nombreTurno: null,
            actualiza: true
        })

        const { hc, ttime } = getHcTTime(linea)

        console.log(data?.data?.data)

        const minParadas = data?.data?.data?.reduce((p, c) => {
            let total = p

            total = total + (c?.RRHH ? parseInt(c?.RRHH) : 0)
            total = total + (c?.KZN ? parseInt(c?.KZN) : 0)
            total = total + (c?.QC ? parseInt(c?.QC) : 0)
            total = total + (c?.MH ? parseInt(c?.MH) : 0)
            total = total + (c?.MTTO ? parseInt(c?.MTTO) : 0)

            return total
        }, 0)


        const volumen = data?.data?.data?.reduce((p, c) => p + parseInt(c.plan), 0)
        const pReparadas = data?.data?.data?.reduce((p, c) => p + parseInt(c.piezas_reparadas), 0)
        const pScrap = data?.data?.data?.reduce((p, c) => p + parseInt(c.piezas_scrap), 0)

        let real = data?.data?.data?.reduce((p, c) => {
            if (c) {
                if (c?.real) {
                    return p + parseInt(c.real)
                }
            }

            return p
        }, 0)

        const volumenHora = data?.data?.data?.reduce((p, c) => {
            if (estaEnRango(c?.intervalo)) {
                return p + parseInt(c.plan)
            } else {
                return p
            }
        }, 0)

        let realHora = data?.data?.data?.reduce((p, c) => {
            if (estaEnRango(c?.intervalo)) {
                if (c?.real) {
                    return p + parseInt(c.real)
                } else {
                    return p
                }
            } else {
                return p
            }
        }, 0)

        if (isNaN(realHora)) {
            realHora = 0
        }

        if (isNaN(real)) {
            real = 0
        }

        let tSoporte = parseInt(data.data.data?.soporte?.soporte)
        if (isNaN(tSoporte)) {
            tSoporte = 0
        }

        const hsReales = ((7.97 * hc) + tSoporte - (minParadas / 60)) / real
        const ef = (((7.97 * hc) / volumen) / hsReales) * 100
        
        const oa = ((realHora * ttime) / (3600 * 7.97)) * 100

        return {
            dataSource: data?.data?.data,
            dataHeader: {
                oa: oa,
                ef: ef,
                plan: volumen,
                real: real,
                difTotal: data?.data?.data?.reduce((prev, cur) => prev + parseInt(cur?.real || 0) - parseInt(cur?.plan || 0), 0),
                piezas_reparadas: pReparadas,
                piezas_scrap: pScrap
            }
        }
    }

    const fetchDefectos = async () => {
        const turno = getTurno()
        const data = await getFmdsLinea(`linea=${linea}&turno=${turno}`)
        return data?.data
    }

    const query = useQuery({ queryKey: [`andon_lineas_${linea}`], queryFn: fetchData, staleTime: 1000, refetchInterval: 50000 })
    const queryDefectos = useQuery({ queryKey: [`defectos_andon_lineas_${linea}`], queryFn: fetchDefectos, staleTime: 1000, refetchInterval: 50000 })

    return (
        <div className='flex flex-col w-full h-screen !bg-black !text-white overflow-hidden'>
            <div className='border-b-2 flex w-full justify-between px-2 py-2'>
                <span className='text-6xl font-bold'>M{linea}</span>

                <div className='flex items-center gap-16 '>
                    <span className={`text-6xl font-bold px-4 ${bgColor(query?.data?.dataHeader.oa)}`}>OA : {query?.data?.dataHeader?.oa?.toFixed(2)}%</span>
                    <span className={`text-6xl font-bold px-4 ${bgColor(query?.data?.dataHeader.ef)}`}>EF : {query?.data?.dataHeader?.ef?.toFixed(2)}%</span>
                    {query?.isFetching && <Loader fontSize={50} />}
                </div>
                <Reloj className="text-6xl font-bold" />
            </div>

            <div className='w-full h-full bg-black flex items-center gap-2'>
                {query?.isLoading ?
                    <div className='w-[55%] flex items-center justify-center h-full'>
                        <Loader fontSize={150} />
                    </div>
                    :
                    <div className='h-full w-[55%]'>
                        <div className='w-full'>
                            <div className='w-full'
                                style={{
                                    display: 'grid', gridTemplateColumns: '3fr repeat(4, 1fr)', gridColumnGap: '0px', gridRowGap: '0px'
                                }}
                            >
                                <span className='!text-3xl  !text-center !font-bold !p-0'>INTERVALO</span>
                                <span className='!text-3xl  !text-center !font-bold !p-0'>PLAN</span>
                                <span className='!text-3xl  !text-center !font-bold !p-0'>REAL</span>
                                <span className='!text-3xl  !text-center !font-bold !p-0'>DIF.</span>
                                <span className='!text-3xl  !text-center !font-bold !p-0'>ACUM.</span>
                            </div>

                            {query?.data?.dataSource?.map((item, idx) => {
                                return <div key={idx} className={`w-full ${estaEnHorario(item?.intervalo) && 'animate-pulse'}`}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '3fr repeat(4, 1fr)', gridColumnGap: '0px', gridRowGap: '0px'
                                    }}>
                                    <span className='block border-r-2 border-b-2 !w-full bg-gray-500 !text-4xl whitespace-nowrap overflow-hidden !text-center !font-bold !py-2 px-10'>{item?.intervalo}</span>
                                    <span className='block border-r-2 border-b-2  !text-4xl whitespace-nowrap !text-center !font-bold !py-2 !px-4'>{item?.plan}</span>
                                    <span className={`block border-r-2 border-b-2  !text-4xl whitespace-nowrap !text-center !font-bold !py-2 !px-4 ${parseInt(item?.real) < parseInt(item?.plan) ? 'bg-[#b91c1c]' : 'bg-green-500'} `}>{item?.real || 0}</span>
                                    <span className={`block border-r-2 border-b-2 !text-4xl whitespace-nowrap !text-center !font-bold !py-2 !px-4 ${parseInt(item?.real) < parseInt(item?.plan) ? 'bg-[#b91c1c]' : 'bg-green-500'} `}>{parseInt(item?.real || 0) - parseInt(item?.plan)}</span>
                                    <span className={`block border-r-2 border-b-2  !text-4xl whitespace-nowrap !text-center !font-bold !py-2 !px-4  `}>{item?.acumulado}</span>
                                </div>
                            })}

                            <div className='w-full'
                                style={{
                                    display: 'grid', gridTemplateColumns: '3fr repeat(4, 1fr)', gridColumnGap: '0px', gridRowGap: '0px'
                                }}
                            >
                                <span className='!text-5xl !text-center !font-bold !p-0'></span>
                                <span className='!text-5xl !text-center !font-bold !p-0 border-2 border-t-0'>{query?.data?.dataHeader?.plan}</span>
                                <span className={`!text-5xl !text-center !font-bold !p-0 border-2 border-t-0 border-l-0 ${query?.data?.dataHeader?.real < query?.data?.dataHeader?.plan ? 'bg-[#b91c1c]' : 'bg-green-500'}`}>{query?.data?.dataHeader?.real}</span>
                                <span className={`!text-5xl !text-center !font-bold !p-0 border-2 border-t-0 border-l-0 ${query?.data?.dataHeader?.difTotal < 0 ? 'bg-[#b91c1c]' : 'bg-green-500'} `}>{query?.data?.dataHeader?.difTotal}</span>
                                <span className='!text-5xl !text-center !font-bold !p-0'></span>
                            </div>
                        </div>

                        <div className="w-full mt-10 text-white text-6xl border-t-2 pt-4 font-bold flex flex-col items-start gap-1">
                            <span>PIEZAS REPARADAS : {query?.data?.dataHeader?.piezas_reparadas}</span>
                            <div className="w-full"></div>
                            <span>PIEZAS SCRAP : {query?.data?.dataHeader?.piezas_scrap}</span>
                        </div>
                    </div>
                }

                <div className='w-[45%] h-full flex flex-col gap-0'>
                    <span className='text-3xl font-bold block w-full text-center bg-orange-600'>TOTAL DEFECTOS TURNO : {queryDefectos?.data?.totalFallas}</span>

                    {queryDefectos?.isLoading && <Loader />}
                    <span className='text-xl font-bold text-center'>TOP 5 DEFECTOS</span>
                    <ChartBarraDefectos dataSource={queryDefectos?.data?.topFallas} />

                    <span className='text-xl font-bold text-center'>TOP 5 DEFECTOS POR OPERACIÓN</span>
                    <ChartBarraOperacionesDefectos dataSource={queryDefectos?.data?.topOperaciones} />

                </div>
            </div>

        </div >
    )

}
