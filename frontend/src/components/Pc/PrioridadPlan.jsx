import KanbanPrint from "@components/KanbanPrint";
import Loader from "@components/Loader";
import usePcImpresiones from "@hooks/usePcImpresiones";
import usePlanificacion from '@hooks/usePlanificacion';
import { Collapse, Tag } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaRegFilePdf } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useReactToPrint } from "react-to-print";
import GenerarKanban from "./GenerarKanban";

const getColorMotivo = (text) => {
    if (text == 'ABASTECIMIENTO BUFFER') {
        return 'blue-inverse'
    } else if (text == 'REPOSICIÓN TIENDA') {
        return 'green-inverse'
    } else if (text == 'ABASTECIMIENTO TIENDA MINIMO') {
        return 'green-inverse'
    } else if (text == 'PRODUCCIÓN') {
        return 'orange'
    }
}


export default function PrioridadPlan() {
    const [isDragging, setIsDragging] = useState(false)
    const [origen, setOrigen] = useState(null)
    const { isLoading: isLoadingPendientesPlan, getData: getPlanificadosPendientes } = usePlanificacion(false)
    const { isLoading: isLoadingPlanificacion, setNotPendiente, fetchPendientes: getPlanificacion, armarPlanificacion } = usePcImpresiones(false)

    const [listItems, setListItems] = useState([])
    const [kanbans, setKanbans] = useState([])
    const [pendientes, setPendientes] = useState([])
    const [reload, setReload] = useState(true)

    const [statusPlanificacion, setStatusPlanificacion] = useState(null)

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const fetchPlanificadosPendientes = async () => {
        setStatusPlanificacion(null)
        const data = await getPlanificadosPendientes(true)
        const response = []

        data?.data?.forEach(k => {
            let index = response.map(e => e.modelo).indexOf(k?.modelo)
            if (index < 0) {
                response.push({
                    modelo: k?.modelo,
                    motivo: '',
                    tipo: '',
                    volumen: k?.setsPorCarro,
                    cantidad: 1,
                    orden: parseInt(k?.orden)
                })
            } else {
                response[index].cantidad = response[index].cantidad + 1
            }
        });

        setListItems(response)

    }

    const setPlanificacion = async () => {
        // console.log(listItems)
        const data = await armarPlanificacion(listItems)

        // console.log(data)
        if (!data?.error) {
            setStatusPlanificacion({ error: false, message: 'Planificación cargada correctamente!' })
        } else {
            setStatusPlanificacion({ error: true, message: data?.message })
        }
    }

    const fetchPendientes = async () => {

        const data = await getPlanificacion(true)

        // console.log(data)
        const response = []
        data?.data?.forEach(k => {
            let kanbans = []

            let index = response.map(e => e.modelo).indexOf(k?.modelo?.nombre)

            if (index < 0) {
                kanbans.push(k)
                response.push({
                    modelo: k.modelo.nombre,
                    motivo: k?.estado_pc?.motivo,
                    tipo: k?.estado_pc?.tipo,
                    volumen: k.modelo?.volumen,
                    cantidad: 1,
                    kanbans: kanbans
                })
            } else {
                response[index].cantidad = response[index].cantidad + 1
                kanbans = response[index].kanbans
                kanbans.push(k)

                response[index].kanbans = kanbans
            }
        });

        setPendientes(response)
    }

    useEffect(() => {
        if (reload) {
            fetchPendientes()
            fetchPlanificadosPendientes()
            setReload(false)
        }
    }, [reload])


    const handleDragOver = (e) => e.preventDefault()

    const handleUpdateList = (destino) => {
        let card = listItems.find(item => item.orden == destino)
        let card2 = listItems.find(item => item.orden == origen)

        card.orden = origen
        card2.orden = destino

        const items = []
        items.push(card)
        items.push(card2)

        let data = [
            ...listItems.filter(item => item.orden != destino && item.orden != origen),
            ...items,
        ]

        data.sort((a, b) => a.orden - b.orden)
        setListItems(data)
    }

    const handleDrop = (e) => {

        let destino = e.target.id

        e.preventDefault();
        handleUpdateList(destino)
        handleDragging(false)
    }

    const handleDragStart = (e) => {
        setOrigen(e.target.id)
        e.dataTransfer.setData('text', '')
        handleDragging(true)
    }

    const handleDragEnd = () => handleDragging(false)
    const handleDragging = (dragging) => setIsDragging(dragging)

    const agregarAPlanificacion = (item) => {

        //Lo quito de los pendientes
        setPendientes(prev => [...prev?.filter(p => p.modelo != item.modelo)])

        //Lo agrego a planificacion
        setListItems(prev => [...prev, { ...item, orden: listItems?.length }])
    }

    const quitarDePlanificacion = (item) => {

        //Lo quito de los pendientes
        setListItems(prev => [...prev?.filter(p => p.modelo != item.modelo)])

        //Lo agrego a planificacion
        setPendientes(prev => [...prev, { ...item, orden: listItems?.length }])
    }

    const DrawKanbans = ({ kanbans }) => {
        return <div className="flex flex-col items-start gap-1">
            {kanbans?.map((k, idxx) => (
                <div key={`kan${idxx}`} className="flex items-center gap-3">
                    <span className="text-sm ml-6 font-semibold w-[150px]" >{k?.codigo}</span>
                    <span className="w-[130px]" >{k?.estado_pc?.fecha_impresion ? <Tag color="blue">Impreso</Tag> : <Tag color="orange-inverse">Pendiente impresión</Tag>}</span>
                    <button
                        className="p-0 px-3 py-1 flex items-center gap-2 text-xs rounded  bg-blue-400 hover:opacity-90"
                        onClick={() => {
                            setKanbans([k])
                            setTimeout(() => handlePrint(), 100)
                            setNotPendiente([k?.codigo])
                            fetchPendientes()
                        }}><FaRegFilePdf /> Imprimir</button>
                </div>
            ))}
        </div>

    }


    return (
        <div className="w-full flex items-start gap-2">

            <div className="w-full flex flex-col items-start gap-2">

                <GenerarKanban setReload={setReload} />

                <span className="text-lg font-semibold block mb-2 mt-4">Pendientes</span>
                {isLoadingPendientesPlan && <div className="flex items-center justify-center"><Loader /></div>}
                <div className="flex flex-col w-full gap-1">
                    <Collapse
                        items={pendientes?.map((item, idx) => (
                            {
                                key: `it${idx}`,
                                label: <div
                                    key={`pend${idx}`}
                                    className="grid grid-cols-5 items-center gap-1 w-full rounded font-semibold"
                                >
                                    <span className="text-sm ">{item.modelo}</span>
                                    <div className="">{item?.motivo && <Tag color={getColorMotivo(item?.motivo)}>{item?.motivo}</Tag>}</div>
                                    <div className="">{item?.kanbans?.filter(k => k?.estado_pc?.fecha_impresion == null)?.length > 0 ? <Tag color="orange-inverse">Pendiente impresión</Tag> : <Tag color="blue">Impreso</Tag>}</div>
                                    <button
                                        onClick={() => {
                                            setKanbans(item?.kanbans)
                                            setTimeout(() => handlePrint(), 100)
                                            setNotPendiente(item?.kanbans?.map(k => k.codigo), true)
                                            fetchPendientes()
                                        }}
                                        className="hover:opacity-90 flex items-center justify-center gap-2 p-0 !px-1 text-xs py-1 text-white bg-blue-500 rounded"><FaRegFilePdf /> Imprimir</button>
                                    <button onClick={() => agregarAPlanificacion(item)} className="hover:opacity-90 p-0 bg-green-600 py-1 text-xs rounded text-white flex items-center justify-center gap-2">Agregar a planificación <IoIosArrowForward /></button>
                                </div>,
                                children: <DrawKanbans kanbans={item?.kanbans} />
                            }
                        ))}
                    />
                </div>
            </div>


            <div className="w-[60%] flex flex-col items-start px-2 gap-2">
                <div className="flex items-center w-full justify-between mb-2">
                    <span className="text-lg font-semibold block">Planificación</span>
                    <button disabled={listItems?.length == 0} onClick={() => setPlanificacion()} className="disabled:opacity-50 disabled:cursor-not-allowed text-xs bg-green-500">Confirmar planificación</button>
                </div>

                {!isLoadingPlanificacion && statusPlanificacion && <span className={`mb-2 block w-full p-2 rounded-md text-lg font-semibold ${statusPlanificacion?.error ? 'bg-red-500' : 'bg-green-500'} text-white`}>{statusPlanificacion?.message}</span>}
                {isLoadingPlanificacion && <div className="flex items-center justify-center"><Loader fontSize={30} /></div>}

                {isLoadingPendientesPlan && <div className="flex items-center justify-center"><Loader /></div>}
                {!isLoadingPendientesPlan &&
                    <div className="flex flex-col w-full gap-1">
                        {listItems.map((item, idx) => (
                            <div
                                key={idx}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                id={item.orden}
                                draggable
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                                className="border-gray-500 border bg-white w-full p-1 rounded font-semibold flex items-center text-start justify-between"
                            >
                                {idx + 1}  - {item.modelo} {item?.motivo && <Tag color={getColorMotivo(item?.motivo)}>{item?.motivo}</Tag>} <button onClick={() => quitarDePlanificacion(item)} className="p-0 px-4 bg-red-500">X</button>
                            </div>
                        ))}
                    </div>
                }
            </div>

            <div className="" ref={componentRef}>
                {kanbans?.map((kanban, idx) => {
                    return <KanbanPrint kanban={kanban} key={idx} />
                })}
            </div>
        </div>


    )
}
