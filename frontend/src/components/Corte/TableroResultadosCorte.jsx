import { actualizaEstadoDadoCorte as actualizaDado } from "@services/LectraService";
import { formatDate, formatTime } from "@utils/Utils";
import { Table } from 'antd';
import { useState } from 'react';
import usePlanificacion from '@hooks/usePlanificacion';
import { useEffect } from "react";

const { Column, ColumnGroup } = Table;

export default function TableroResultadosCorte({ dados, fechaConsulta }) {
    const [selectedLectra, setSelectedLectra] = useState(1)
    const [dadosPlan, setDadosPlan] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [difTotal, setDifTotal] = useState(0)
    const [datosCorte, setDatosCorte] = useState({
        diferenciaTotal: 0,
        tiempoCorte: 0,
        eficiencia: 0
    })
    const { isLoading: isLoadingPendientesPlan, getData: getPlanificacion, setPlanificacion: setPlanCorte, fetchPlanificacion } = usePlanificacion(false)

    useEffect(() => {
        setDadosPlan(dados)
    }, [dados])

    const actualizaEstadoDadoCorte = async (payload) => {
        if (payload.update) {
            await actualizaDado(payload)
        }

        //Obtengo sacando el que modifico
        const data = dadosPlan?.find(p => p.idPapa == payload.id)
        const others = dadosPlan?.filter(p => p.idPapa != payload.id)

        data[payload.campo] = data[payload.valor]
        const newData = others.concat(data)

        newData.sort((a, b) => {
            return a.idPapa - b.idPapa
        })

        // console.log(newData)
        setDadosPlan(newData)
    }

    const consultarPlanificacion = async () => {
        setIsLoading(true)

        const data = {
            fecha: fechaConsulta,
            turno: "TM"
        }

        const fecha = new Date(fechaConsulta)
        // console.log(fecha)

        const response = await fetchPlanificacion({
            fecha: formatDate(fecha),
            turno: data.turno
        }, true)

        const datos = []
        let lDifTotal = 0;
        let lTiempoCorte = 0;

        response?.data?.forEach(r => {
            r?.datos?.forEach(d => {
                let diferencia = 0
                let diffReal = 0
                if (d?.inicio && d?.fin && d?.inicio_plan && d?.fin_plan) {
                    const inicio = new Date(d?.inicio)
                    const fin = new Date(d?.fin)
                    const inicioPlan = new Date(d?.inicio_plan)
                    const finPlan = new Date(d?.fin_plan)

                    diffReal = (fin - inicio) / (1000 * 60)
                    const diffPlan = (finPlan - inicioPlan) / (1000 * 60)

                    const diff = diffReal - diffPlan

                    diferencia = diff
                    lTiempoCorte = lTiempoCorte + ((fin - inicio) / (1000 * 60))
                }

                datos.push({
                    lectra: r.lectra,
                    diferencia: diferencia,
                    ...d
                })

                lDifTotal = lDifTotal + diferencia

            })
        })

        lTiempoCorte = ((lTiempoCorte) - (lDifTotal)) / 60


        setDatosCorte({
            tiempoCorte: lTiempoCorte,
            diferenciaTotal: lDifTotal,
            eficiencia: (lTiempoCorte * 60) / 8.8
        })

        setDadosPlan(datos)
        setIsLoading(false)
    }

    const getTotalTiempoMuerto = () => {
        const total = dadosPlan?.filter(e => e.lectra == selectedLectra)
            ?.reduce((acum, cur) => {
                return acum + (
                    parseInt(cur?.rrhh_ausentismo || 0) +
                    parseInt(cur?.rrhh_rotacion || 0) +
                    parseInt(cur?.pr_piqueo || 0) +
                    parseInt(cur?.pr_habilidad || 0) +
                    parseInt(cur?.pr_reposicion || 0) +
                    parseInt(cur?.pr_retendido_nylon || 0) +
                    parseInt(cur?.pr_falta_tendido || 0) +
                    parseInt(cur?.kz_setup || 0) +
                    parseInt(cur?.qc_defectos_proveedor || 0) +
                    parseInt(cur?.qc_problema_calidad || 0) +
                    parseInt(cur?.pc_falta_carros || 0) +
                    parseInt(cur?.pc_falta_material || 0) +
                    parseInt(cur?.mtto_perdida_destino || 0) +
                    parseInt(cur?.mtto_cambio_cuchilla || 0) +
                    parseInt(cur?.mtto_falla_maquina || 0)
                )
            }, 0)

        return total
    }

    return (
        <div className='w-full'>
            <div className="flex items-center gap-4 justify-center mb-2">

                <select
                    value={selectedLectra}
                    onChange={(e) => {
                        setSelectedLectra(e.target.value)
                    }}
                    className='p-2 rounded-lg px-4 border'
                >
                    <option value={1}>LECTRA 1</option>
                    <option value={2}>LECTRA 2</option>
                    <option value={3}>LECTRA 3</option>
                    <option value={4}>LECTRA 4</option>
                </select>



                <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold">Tiempo Muerto Total (min): {getTotalTiempoMuerto() || 0}</span>
                    <span className="text-lg font-semibold">|</span>
                    <span className="text-lg font-semibold">Tiempo Dif. Total: {datosCorte.diferenciaTotal.toFixed(2)}</span>
                    <span className="text-lg font-semibold">|</span>
                    <span className="text-lg font-semibold">TIEMPO DE CORTE: {datosCorte.tiempoCorte.toFixed(2)} hs</span>
                    <span className="text-lg font-semibold">|</span>
                    <span className="text-lg font-semibold">EF%: {datosCorte.eficiencia?.toFixed(2)} %</span>

                </div>

                <button onClick={() => consultarPlanificacion()} className='bg-green-500 text-white px-4 py-1 rounded-lg'>Actualizar</button>
            </div>

            <Table
                className='w-full !text-sm'
                size='small'
                dataSource={dadosPlan?.filter(e => e.lectra == selectedLectra)}
                rowKey={r => r.id}
                loading={isLoading}
                pagination={false}
                bordered
                rowClassName={(r, idx) => {
                    return (idx % 2 == 0) ? 'bg-white' : 'bg-gray-200'
                }}
            >
                <Column className='text-sm min-w-[100px]' title='Mod.' dataIndex='modelo' align='center' />

                <Column className='text-sm' title='Dado' dataIndex='dado' align='center'
                    render={(_, record) => {
                        // console.log(record)
                        return record?.material?.codigo_interno
                    }}
                />

                <ColumnGroup align='center' title={<span className='-rotate-90 block'>Intervalo PLAN</span>} >
                    <Column className='text-sm' title='Inicio' dataIndex="inicio_plan" align='center' render={(_, record) => formatTime(record?.inicio_plan)} />
                    <Column className='text-sm' title='Fin' dataIndex="fin_plan" align='center' render={(_, record) => formatTime(record?.fin_plan)} />
                </ColumnGroup>

                <ColumnGroup align='center' title={<span className='-rotate-90 block'>Intervalo REAL</span>}  >
                    <Column render={(_, record) => formatTime(record?.inicio)} className='text-sm' title='Inicio' dataIndex="inicio_real" align='center' />
                    <Column render={(_, record) => formatTime(record?.fin)} className='text-sm' title='Fin' dataIndex="fin_real" align='center' />
                </ColumnGroup>

                <Column
                    className='text-sm'
                    title='Dif.(min)'
                    dataIndex='diferencia'
                    align='center'
                    render={(_, record) => {
                        return <span className={`font-semibold ${record?.diferencia > 0 ? 'text-red-500' : 'text-green-500'}`}>{parseFloat(record?.diferencia).toFixed(2)}</span>
                    }}
                />

                <ColumnGroup align='center' className='!bg-red-200' title="RRHH" >
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.rrhh_ausentismo || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'rrhh_ausentismo', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                        }}
                        className='text-sm'
                        title={<span className='-rotate-90 block my-10 text-[90%]'>Ausentismo</span>}
                        dataIndex="fin_real"
                        align='center'
                    />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='number'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.rrhh_rotacion || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'rrhh_rotacion', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                        }}
                        className='text-sm' title={<span className='text-[90%] -rotate-90 block my-10'>Rotación</span>} dataIndex="fin_real" align='center'
                    />
                </ColumnGroup>

                <ColumnGroup align='center' className='!bg-red-200' title="PR" >
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.pr_piqueo || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_piqueo', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Piqueo</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.pr_habilidad || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_habilidad', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_habilidad' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Habilidad</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.pr_reposicion || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_reposicion', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_reposicion' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Reposiciones</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.pr_retendido_nylon || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_retendido_nylon', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_retendido_nylon' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Retendido nylon</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.pr_falta_tendido || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_falta_tendido', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'pr_falta_tendido' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Falta tendido</span>} dataIndex="fin_real" align='center' />
                </ColumnGroup>

                <ColumnGroup align='center' className='!bg-red-200' title="KZN" >
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.kz_setup || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'kz_setup', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'kz_setup' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Set up de corte</span>} dataIndex="fin_real" align='center' />
                </ColumnGroup>

                <ColumnGroup align='center' className='!bg-red-200' title="QC" >
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.qc_defectos_proveedor || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_defectos_proveedor', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_defectos_proveedor' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Defectos de proveedor</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.qc_problema_calidad || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_problema_calidad', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_problema_calidad' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Problemas de calidad</span>} dataIndex="fin_real" align='center' />
                </ColumnGroup>

                <ColumnGroup align='center' className='!bg-red-200' title="PC" >
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.qc_falta_carros || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_falta_carros', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_falta_carros' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Falta de carros</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.qc_falta_material || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_falta_material', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'qc_falta_material' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Falta de material</span>} dataIndex="fin_real" align='center' />
                </ColumnGroup>

                <ColumnGroup align='center' className='!bg-red-200' title="MTTO" >
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.mtto_perdida_destino || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'mtto_perdida_destino', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'mtto_perdida_destino' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Perdida de destino</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.mtto_cambio_cuchilla || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'mtto_cambio_cuchilla', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'mtto_cambio_cuchilla' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Cambio de cuchhilla</span>} dataIndex="fin_real" align='center' />
                    <Column
                        render={(_, record) => {
                            return <input
                                onChange={() => { }}
                                type='text'
                                // defaultValue={0}
                                value={dadosPlan?.find(p => p.idPapa == record.idPapa)?.mtto_falla_maquina || 0}
                                className='border border-black w-[50px] text-center'
                                onKeyDown={(e) => {
                                    actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'mtto_falla_maquina', valor: e?.target?.value, update: (e?.key == 'Enter') })
                                }}
                            />
                            // return <button onClick={() => actualizaEstadoDadoCorte({ id: record?.idPapa, campo: 'mtto_falla_maquina' })} className='text-sm py-1 px-4'>X</button>
                        }}
                        title={<span className='text-[90%] -rotate-90 block my-10'>Falla en maquina.</span>} dataIndex="fin_real" align='center' />
                </ColumnGroup>

            </Table>

            {/* <DadosPendientesPrint planificacion={planificacion} /> */}
        </div>
    )
}
