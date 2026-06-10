import Loader from "@components/Loader"
import { actualizaOrdenPlanYEjecutar, fetchKanbansDia } from "@services/PcService"
import { Modal } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { MdDragIndicator } from 'react-icons/md'
import { useReactToPrint } from 'react-to-print'
import KanbanPrintV2 from "../../components/KanbanPrintV2"


export default function ModalOrdenPlanSemanal({ modalVisible, setModalVisible, planificacion, setStatus }) {

    const [state, setState] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [ocupacion, setOcupacion] = useState([])
    const [kanbans, setKanbans] = useState([])

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        if (modalVisible && planificacion?.plan?.length > 0) {
            setOcupacion(Object.values(planificacion?.ocupacion))

            setState({
                items: planificacion?.plan?.filter(m => m?.modelo),
                draggingItem: null,
                newItemName: '',
                newItemImage: '',
            })
        } else {
            setState([])
        }
    }, [modalVisible])

    const handleDragStart = (e, item) => {
        setState({ ...state, draggingItem: item });
        e.dataTransfer.setData('text/plain', '');
    };

    const handleDragEnd = () => {
        setState({ ...state, draggingItem: null });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetItem) => {
        const { draggingItem, items } = state;

        if (!draggingItem) return;

        const currentIndex = items.indexOf(draggingItem);
        const targetIndex = items.indexOf(targetItem);

        if (currentIndex !== -1 && targetIndex !== -1) {

            items[currentIndex].orden = currentIndex + 1
            items[targetIndex].orden = targetIndex + 1

            items.splice(currentIndex, 1);
            items.splice(targetIndex, 0, draggingItem);
            setState({ ...state, items: items });
        }
    };

    return (
        <Modal
            open={modalVisible}
            footer={[
                <div key={'div1'} className='flex items-center gap-4 justify-end mt-10'>
                    <button
                        key={'btn1'}
                        onClick={async () => {
                            setIsLoading(true)
                            const res = await actualizaOrdenPlanYEjecutar(state.items)

                            // console.log(res)

                            // if (!res?.error) {
                            //     //IMPRIMO LOS KANBANS DEL DIA
                            //     const resKanbans = await fetchKanbansDia()
                            //     // console.log(resKanbans)
                            //     setKanbans(resKanbans?.data)

                            //     setTimeout(() => { handlePrint() }, 500)
                            // }

                            setStatus({
                                error: res.error,
                                message: res?.error ? res.message : 'PLAN EJECUTADO CORRECTAMENTE'
                            })
                            setIsLoading(false)
                            setModalVisible(false)

                        }}
                        disabled={isLoading}
                        className='py-1 px-10 flex disabled:opacity-80 bg-green-500 items-center gap-2'>
                        {isLoading && <Loader fontSize={15} />}
                        <span className='block'>Confirmar</span>
                    </button>
                    <button disabled={isLoading} key={'btn2'} onClick={() => setModalVisible(false)} className='py-1 px-10 bg-red-500'>Cancelar</button>
                </div>
            ]}
            closable={false}
            width="60%"
        >
            <span className="text-2xl font-semibold">Orden de corte</span>
            {/* <div className='bg-yellow-200 w-full my-2 p-2 flex flex-col'>
                <span className='font-semibold'>- El criterio utilizado por defecto es menor días de cobertura y menor tiempo de corte</span>
            </div> */}

            <div className="flex flex-col gap-1 mt-4">
                <div className="flex gap-2 w-full">
                    <div className="sortable-list w-full">
                        {state?.length == 0 && <span className="text-xl font-semibold bg-orange-300">NO HAY CORTES A REALIZAR</span>}
                        <div className='flex flex-col gap-1'>
                            {state?.items?.map((item, idx) => (
                                <div
                                    key={`item${idx}`}
                                    className={` item ${item === state.draggingItem ? 'dragging' : ''}`}
                                    draggable="true"
                                    onDragStart={(e) => handleDragStart(e, item)}
                                    onDragEnd={handleDragEnd}
                                    onDragOver={handleDragOver}
                                    onDrop={(e) => handleDrop(e, item)}
                                >
                                    <div key={idx} className="flex border border-gray-500 px-2 py-1 hover:cursor-move hover:bg-slate-300">
                                        <div className="flex items-center gap-2 w-[330px]">
                                            <MdDragIndicator />
                                            <span className="font-extrabold">{idx + 1}) </span>
                                            <span className="font-bold">{item?.modelo} (VOL {item?.volumenCorte}) M{item?.linea}</span>
                                            {/* <span>Cobertura : <span className={`${item?.cobertura >= 6 ? 'bg-green-500' : (item?.cobertura >= 3 ? 'bg-yellow-400' : 'bg-red-500')} px-1`}>{item?.cobertura} días</span></span> */}
                                        </div>
                                        <div className="flex items-center gap-2 font-semibold">
                                            <span>T. Corte: ≈ {item?.demora}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 w-[300px] bg-gray-200 p-2">
                        <span className="font-bold text-xl">Ocupación de lineas</span>
                        <div className="flex flex-col gap-1">
                            {ocupacion?.map((oc, idx) => {
                                if (idx > 0) {
                                    return <span className="font-semibold block border-white text-lg border-b w-full" key={`oc_${idx}`}>M{idx} - {oc} hs</span>
                                }
                            })}
                        </div>
                    </div>
                </div>
                <div className=" items-center justify-center w-full flex-col gap-0 mt-1 hidden print:flex" ref={componentRef}>
                    {kanbans?.map((kanban, idx) => {
                        return <KanbanPrintV2 kanban={kanban} key={`k_${idx}`} />
                    }
                    )}
                </div>

            </div>
        </Modal>
    )
}
