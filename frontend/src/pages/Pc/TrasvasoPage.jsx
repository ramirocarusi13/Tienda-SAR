import Loader from "@components/Loader";
import useCaptureScan from '@hooks/useCaptureScan';
import { almacenarEnDeposito, consultarKanbanPosicionLibre, fetchPendientes, verificaYPickea } from "@services/DepositoService";
import { depositos } from '@utils/Constants';
import { normalizePositionText } from "@utils/positionFormat";
import { useEffect, useRef, useState } from 'react';

const normalizeScannedText = (value) => String(value || '')
    .trim()
    .toUpperCase()
    .replace(/'/g, '-')

const toCanonicalRackPosition = (value) => {
    const n = normalizeScannedText(value)
    const m = n.match(/^([A-H])-(\d+)-([0-4])$/)
    if (!m) return n
    return `${m[1]}-${String(m[2]).padStart(2, '0')}-${m[3]}`
}

const toRackDisplayPosition = (value) => toCanonicalRackPosition(value)

const areEquivalentRackPositions = (left, right) =>
    toCanonicalRackPosition(left) === toCanonicalRackPosition(right)

export default function TrasvasoPage() {
    const { onKeyDown, finalText } = useCaptureScan()
    const [kanbanData, setKanbanData] = useState(null)
    const [esIngreso, setEsIngreso] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingPendientes, setIsLoadingPendientes] = useState(false)
    const [dataPendiente, setDataPendiente] = useState(null)
    const refDiv = useRef()

    const fetchDataKanban = async () => {
        setIsLoading(true)
        const data = await consultarKanbanPosicionLibre({ kanban: finalText })
        // console.log(data.data)
        if (!data?.error) {
            const posicionNombre = toCanonicalRackPosition(data?.data?.posicion?.nombre) || data?.data?.posicion?.nombre
            setKanbanData({
                ...data.data,
                posicion: {
                    ...data?.data?.posicion,
                    nombre: posicionNombre
                }
            })
        } else {
            setError(data?.message?.toUpperCase())
            // setTimeout(() => { setError(null) }, [4000])
        }

        setIsLoading(false)
    }

    const almacenar = async () => {
        const payload = {
            automatico: false,
            producto: kanbanData?.kanban?.codigo,
            tipoProducto: 'KANBAN',
            deposito: kanbanData?.deposito,
            posicion: kanbanData?.posicion?.id
        }
        const data = await almacenarEnDeposito(payload)

        if (!data?.error) {
            setSuccess("CORRECTO")
            setKanbanData(null)
            // setTimeout(() => { setSuccess(null) }, [60000])
        } else {
            setError(data?.message?.toUpperCase())
            // setTimeout(() => { setError(null) }, [4000])
        }


    }

    const fetchDespachoPendiente = async () => {
        setIsLoadingPendientes(true)
        const data = await fetchPendientes()
        setDataPendiente(data?.data)
        // console.log(data?.data)
        setIsLoadingPendientes(false)

    }

    const verifica = async () => {
        setError(null)
        setSuccess(null)
        setIsLoading(true)
        // console.log(finalText)
        let scan = normalizePositionText(finalText)
        const payload = {
            despachoId: dataPendiente?.id,
            scan: scan
        }

        // console.log(payload)
        const data = await verificaYPickea(payload)
        // console.log(data)
        if (data?.error) {
            setError(data?.message)
        } else {
            setSuccess(data?.message)
            fetchDespachoPendiente()

        }
        setIsLoading(false)

    }

    useEffect(() => {
        refDiv?.current?.focus()
        if (!esIngreso) {
            fetchDespachoPendiente()
        }
    }, [esIngreso])

    useEffect(() => {
        // console.log(finalText)
        if (finalText) {
            if (finalText.indexOf('INGRESO') >= 0) {
                // console.log("ENTRO ING")
                setError(null)
                setSuccess(null)
                setEsIngreso(true)
                setDataPendiente(null)
                setKanbanData(null)
            } else if (finalText.indexOf('DESPACHO') >= 0) {
                setKanbanData(null)
                setError(null)
                setSuccess(null)
                setEsIngreso(false)
                fetchDespachoPendiente()
            } else if (finalText.indexOf('CANCELAR') >= 0) {
                setKanbanData(null)
                setError(null)
                setSuccess(null)
                fetchDespachoPendiente()

            } else if (esIngreso) {
                setError(null)
                setSuccess(null)
                if (!kanbanData) {
                    fetchDataKanban()
                } else {
                    //Esperando posicion para validar
                    setError(null)
                    let posicion = finalText.replaceAll("'", '-')
                    if (!areEquivalentRackPositions(posicion, kanbanData?.posicion?.nombre)) {
                        setError(`POSICIÓN INVÁLIDA ${toRackDisplayPosition(posicion)}`)
                    } else {
                        //Posicion correcta, confirmo operación
                        almacenar()
                    }
                }
            } else if (!esIngreso) {
                //PARA EGRESO
                verifica()
            }
        }

    }, [finalText])

    return (
        <div tabIndex="0" onKeyDown={onKeyDown} ref={refDiv} className='w-full h-screen flex flex-col'>
            {/* <button onClick={() => {
                refDiv.current.focus()
                setEsIngreso(!esIngreso)
            }}>CHANGE</button> */}

            <div className='w-full h-full flex flex-col overflow-hidden'>
                <div className={`w-full flex ${esIngreso ? 'h-full' : 'h-[85vh]'}`}>
                    <div className={`h-full flex flex-col gap-2 bg-green-300 ${esIngreso ? ' w-full' : 'opacity-50 w-[0%]'}`}>
                        <span className={`w-full block text-center font-bold text-7xl mb-2 bg-yellow-300 py-2 ${!esIngreso && 'hidden'}`}>INGRESO</span>

                        <div className={`relative w-full h-full flex flex-col items-center justify-between ${!esIngreso && 'hidden'}`}>
                            {kanbanData ?
                                <>
                                    {/* {error && <div className='absolute flex items-center justify-center z-10 top-10 w-full h-full bg-red-500 '> */}
                                    <div className='gap-1 flex flex-col w-full bg-yellow-200'>
                                        <span className='w-full block text-9xl text-center font-bold bg-yellow-200'>{kanbanData?.kanban?.modelo?.nombre}</span>
                                        <span className='w-full block text-7xl mb-1 text-center font-bold bg-yellow-200'>{kanbanData?.kanban?.codigo}</span>
                                    </div>
                                    {/* {error && <div className='flex items-center justify-center w-full bg-red-500 '> */}
                                    {error && <span className='text-6xl py-2 font-bold text-white text-center bg-red-500 w-full'>{error}</span>}
                                    {/* </div>} */}

                                    {isLoading && <Loader fontSize={45} />}


                                    <div className='flex flex-col mt-2'>
                                        <span className='w-full block text-8xl font-bold text-center'>ALMACENAR EN:</span>
                                        <span className='w-full  block !text-[10rem] text-[18rem] font-bold text-center'>{toRackDisplayPosition(kanbanData?.posicion?.nombre)}</span>
                                    </div>
                                    <span className={`text-6xl block bg-orange-500 w-full font-bold text-white py-4 text-center animate-pulse`}>ESPERANDO CONFIRMACIÓN POSICIÓN</span>
                                </>
                                :
                                <div className='flex items-center justify-center w-full h-full flex-col'>
                                    {success && <div className=' flex items-center justify-center w-full bg-green-500 '>
                                        <span className='text-9xl font-bold text-white text-center'>{success}</span>
                                    </div>}
                                    {error && <div className='flex items-center justify-center w-full bg-red-500 '>
                                        <span className='text-8xl font-bold text-white text-center'>{error}</span>
                                    </div>}

                                    <span className={`text-6xl !text-4xl block !my-2 my-4 bg-orange-300 w-full font-bold text-black py-4 text-center animate-pulse`}>ESPERANDO ESCANEO KANBAN</span>

                                    {isLoading && <Loader fontSize={150} />}
                                </div>
                            }

                        </div>
                    </div>

                    <div className={`overflow-y-auto h-full bg-white ${!esIngreso ? ' w-full ' : 'opacity-50  w-[0%]'}`}>
                        <span className={`w-full block text-center font-bold text-7xl mb-2 bg-yellow-300 py-2 ${esIngreso && 'hidden'}`}>DESPACHOS</span>

                        {isLoadingPendientes ? <div className='flex items-center justify-center w-full  h-full'><Loader fontSize={70} /></div>
                            :
                            <div className={`flex items-start w-full h-full ${esIngreso && 'hidden'}`}>
                                <div className='flex flex-col items-start w-full h-full px-2 border-r-2 border-black'>
                                    <span className='w-full block text-center font-bold mb-4 text-5xl'>DOLLY ({dataPendiente?.items?.filter((d) => d.deposito_id == depositos.DOLLYS && d.pickeado == "1")?.length}/{dataPendiente?.items?.filter(d => d.deposito_id == depositos.DOLLYS)?.length})</span>

                                    <div className='flex items-center flex-col w-full gap-1'>
                                        {/* <span className='text-center bg-green-400 block w-full p-1 text-7xl border-black border font-bold'>SFLE</span>
                                    <span className='text-center bg-red-400 block w-full p-1 text-7xl border-black border font-bold'>SFLE</span> */}
                                        {dataPendiente?.items?.filter(d => d.deposito_id == depositos.DOLLYS && d.pickeado == "0")?.map((i, idx) => (
                                            <span key={idx} className={`text-center ${i.pickeado == "1" ? 'bg-green-400' : 'bg-orange-400'} block w-full p-1 text-4xl border-black border font-bold`}>{i.modelo} {i.kanban}</span>
                                            // <button className="text-xs p-1">X</button>
                                        ))}
                                    </div>
                                </div>

                                <div className='flex items-start w-full h-full  flex-col px-2 border-r-2 border-black'>
                                    <span className='w-full block text-center font-bold text-5xl mb-4'>RACKS ({dataPendiente?.items?.filter((d) => d.deposito_id == depositos.RACKS && d.pickeado == "1")?.length}/{dataPendiente?.items?.filter(d => d.deposito_id == depositos.RACKS)?.length})</span>

                                    <div className='flex items-center flex-col w-full gap-1'>
                                        {dataPendiente?.items?.filter(d => d.deposito_id == depositos.RACKS && d.pickeado == "0")?.map((i, idx) => (
                                            <div key={idx} className={`text-center ${i.pickeado == "1" ? 'bg-yellow-300' : 'bg-orange-400'} w-full p-1 text-7xl border-black border font-bold flex items-center justify-between`}>
                                                <span>{i.modelo}</span>
                                                <span>-</span>
                                                <span>{toRackDisplayPosition(i.posicion)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div className='flex items-start w-full h-full  flex-col px-2 border-r-2 border-black'>
                                    <span className='w-full block text-center font-bold text-5xl mb-4'>CAJAS TEMP ({dataPendiente?.items?.filter((d) => (d.deposito_id == depositos.TEMPORAL_A || d.deposito_id == depositos.TEMPORAL_B) && d.pickeado == "1")?.length}/{dataPendiente?.items?.filter(d => (d.deposito_id == depositos.TEMPORAL_A || d.deposito_id == depositos.TEMPORAL_B))?.length})</span>

                                    <div className='flex items-center flex-col w-full gap-1'>
                                        {dataPendiente?.items?.filter(d => (d.deposito_id == depositos.TEMPORAL_A || d.deposito_id == depositos.TEMPORAL_B) && d.pickeado == "0")?.map((i, idx) => (
                                            <span key={idx} className={`text-center ${i.pickeado == "1" ? 'bg-green-400' : 'bg-orange-400'} block w-full p-1 text-4xl border-black border font-bold`}>{i.modelo} {i.kanban}<button className="text-xs p-1">X</button></span>
                                        ))}
                                    </div>
                                </div>

                                {/* <div className='flex items-start w-full h-full  flex-col px-2'>
                                    <span className='w-full block text-center font-bold text-5xl mb-4'>PRÓXIMA ENTREGA</span>

                                    <div className='flex items-center flex-col w-full gap-1'>
                                        {dataPendiente?.items?.filter(d => d.pickeado == "1")?.map((i, idx) => (
                                            <span key={idx} className={`text-center ${i.deposito_id == depositos.RACKS ? 'bg-yellow-300' : 'bg-green-400'} w-full p-1 text-7xl border-black border font-bold flex items-center justify-center gap-2`}>{i.modelo} {i.deposito_id == depositos.RACKS ? ' - ' + i.posicion : <span className='text-3xl'>{i.kanban}</span>}</span>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        }
                    </div>
                </div>
                {!esIngreso && <div className={`flex items-center justify-center h-[15vh] w-full ${success ? 'bg-green-400' : (error ? 'bg-red-400' : 'bg-orange-300')} border-t-2 border-black`}>
                    {isLoading && <Loader fontSize={45} />}
                    {success && <span className='text-white w-full block !text-6xl text-8xl font-semibold text-center'>{success?.toUpperCase()}</span>}
                    {error && <span className='text-white w-full block !text-6xl text-8xl font-semibold text-center'>{error?.toUpperCase()}</span>}
                </div>}
            </div>
        </div >
    )
}
