import Loader from "@components/Loader";
import useCaptureScan from '@hooks/useCaptureScan';
import useKanban from "@hooks/useKanban";
import useTables from "@hooks/useTables";
import { useQuery } from '@tanstack/react-query';
import { estados } from "@utils/Constants";
import { useEffect, useRef, useState } from "react";

export default function BufferCortePage() {
    const { response: lineas, getData, error } = useTables("lineas/ocupacion", false)
    const { isLoading: isLoadingBuffer, response: buffer, getData: getDataBuffer } = useTables("buffer/ultimos_egresos", true)
    const { isLoading: isLoadingEgreso, changeStatus } = useKanban(false)
    // const [isVisible, setIsVisible] = useState(false)
    const { onKeyDown, finalText, setFinalText, enabledText } = useCaptureScan()
    const [statusResponse, setStatusResponse] = useState(null)
    // const [bufferVaciar, setBufferVaciar] = useState(null)

    const refDiv = useRef()
    // const inputRef = useRef()

    // const refetch = () => {
    //     setStatusResponse(null)
    //     getData()
    // }

    // console.log(lineas)

    useEffect(() => {
        refDiv?.current?.focus()
        // const interval = setInterval(() => {
        //     refetch()
        // }, 220000)


        // return () => clearInterval(interval)
    }, [])

    const query = useQuery({
        queryKey: 'buffer_corte', queryFn: async () => {
            await getData(null, true)
        }, staleTime: 100000, refetchInterval: 50000
    })
    // console.log(query?.data)

    const cambiarEstadoKanban = async () => {
        setStatusResponse(null)

        // const index = finalText.indexOf("VACIAR")

        // if (index >= 0) {
        //     setBufferVaciar(finalText.slice(-1))
        //     setIsVisible(true)
        //     return
        // }

        const response = await changeStatus({
            status: estados.SUB_ASSY,
            kanban: finalText.replaceAll("'", "-").replaceAll("F11", "")
        })

        setStatusResponse({
            error: response.error || response?.exception,
            message: response.message
        })

        if (!response.error && !response?.exception) {
            // getData()
            getDataBuffer()
            query?.refetch()
        }

        setTimeout(() => {
            setStatusResponse(null)
        }, [10000])
    }

    // useEffect(() => {
    //     if (isVisible) {
    //         inputRef.current.value = ''
    //         setTimeout(() => {
    //             inputRef.current.focus()

    //         }, [50])
    //     }
    // }, [isVisible])

    useEffect(() => {
        if (finalText) {
            // if (!isVisible) {
            //     cambiarEstadoKanban()
            // } else {

            // }
            cambiarEstadoKanban()
        }
    }, [finalText])

    useEffect(() => {
        document.title = "Buffer costura"
    }, [])

    return (
        <div tabIndex="0" onKeyDown={onKeyDown} ref={refDiv} className="flex flex-col w-full h-screen items-start gap-0">
            {/* <Modal
                open={isVisible}
                footer={[]}
                closable={false}
                width={"90%"}
            >
                <span className="text-9xl font-bold block text-center mb-4 text-red-500">ATENCIÓN!</span>
                <span className="text-8xl font-bold block text-center mb-4">VACIAR BUFFER LINEA {finalText?.slice(-1)}</span>
                <span className="text-6xl font-bold block text-center mb-4">ESCANEAR NUEVAMENTE PARA CONFIRMAR</span>

                <input
                    ref={inputRef}
                    onKeyDown={async (e) => {
                        if (e.key == 'Enter') {
                            const etiqueta = e.target.value
                            const index = etiqueta.indexOf("VACIAR")

                            if (etiqueta.substr(index + 6) != bufferVaciar) {
                                setFinalText(null)
                                setBufferVaciar(null)
                                setStatusResponse({
                                    error: true,
                                    message: 'CÓDIGO ESCANEADO INVÁLIDO'
                                })
                                setTimeout(() => { setIsVisible(false) }, [1000])
                                setTimeout(() => { setStatusResponse(null) }, [7000])
                                return
                            }

                            const res = await vaciaBufferLinea(etiqueta.substr(index + 6))

                            setStatusResponse({
                                error: res.error,
                                message: res.error ? res.message : 'VACIADO CORRECTAMENTE'
                            })

                            getData()
                            setIsVisible(false)
                            setBufferVaciar(null)

                            setTimeout(() => {
                                setStatusResponse(null)
                            }, [7000])
                        }
                    }}
                    className="w-full p-10 border rounded-md mt-5"
                />

            </Modal> */}

            <div className="w-full flex items-start gap-1 py-1 h-[120rem] ">
                <div className=" w-[35%] py-0 bg-blue-300 h-full flex items-center justify-center font-bold text-black text-2xl lg:text-9xl text-center">{lineas?.reduce((acum, cur) => {
                    const m = cur?.modelos?.reduce((a, c) => { return a + c.cantidad }, 0)
                    return acum + m
                }, 0)} SETS</div>

                <div className="w-full h-full flex flex-col overflow-hidden">
                    <span className="font-bold !mx-0 bg-orange-500 block py-2 px-2 text-8xl">ÚLTIMOS SETS DESCONTADOS</span>

                    <div className="flex items-start gap-6 bg-gray-700 h-full w-full overflow-hidden px-2">
                        {!isLoadingBuffer && buffer?.slice(0, 1)?.map((b, idx) => (
                            <span className="font-bold !px-0 !mx-0 !py-0 text-base lg:text-8xl text-white whitespace-nowrap" key={idx}> {b?.modelo} x{b?.cantidad * 10} </span>
                        ))}

                        {isLoadingBuffer && <div className="mt-2 ml-4"><Loader fontSize={60} /></div>}
                    </div>
                    {error && <div className="bg-red-500 text-white font-semibold text-center w-full text-6xl">CONEXIÓN PERDIDA</div>}

                </div>

                {/* <Table
                    bordered={true}
                    loading={isLoadingBuffer}
                    className='w-full hidden overflow-hidden !mx-0 !px-0 rounded-none'
                    size='small'
                    rowClassName={(r, idx) => {
                        if (idx % 2 == 0) {
                            return "bg-slate-300 font-semibold text-sm lg:text-xl w-full"
                        } else {
                            return "bg-white font-semibold text-sm lg:text-xl w-full"
                        }
                    }}
                    columns={[
                        {
                            title: <span className="font-bold !mx-0 bg-orange-500 block py-2 px-2">ÚLTIMOS EGRESOS</span>,
                            key: 'modelo',
                            dataIndex: 'modelo',
                            className: 'font-semibold w-full !px-0 !mx-0 !py-0 text-base lg:text-4xl',
                            align: "center",
                            render: (_, record) => record?.kanban?.modelo?.nombre
                        },
                    ]}
                    pagination={false}
                    rowKey={row => row.id}
                    dataSource={buffer.slice(0, 8)}
                /> */}


            </div>

            {lineas?.length > 0 &&
                <div className="w-full p-1 bg-black">
                    {/* {!query?.isLoading ? */}
                    <div className="w-full grid gap-1 grid-cols-7 justify-between h-[calc(100vh-25rem)]">
                        {lineas?.map((linea, idx) => (
                            <div key={idx} className="border-r relative">
                                <div className={`flex flex-col gap-1 pb-4 items-center justify-center bg-slate-500 text-white`}>
                                    <span className={`text-center block font-bold text-2xl lg:text-7xl pb-0 `}>{linea.codigo}</span>
                                    <span className={`text-center block font-bold text-2xl lg:text-4xl pb-1  w-full`}>REQ: {linea?.requerido} TURNO</span>
                                    <span className={`font-bold text-lg lg:text-7xl block w-full text-center text-black pb-1 ${linea?.turnos_cubiertos == 2 && 'bg-green-500'} ${linea?.turnos_cubiertos == 1 && 'bg-yellow-300'} ${linea?.turnos_cubiertos == 0 && 'animate-pulse bg-red-500'}`}>{linea.total} SETS</span>
                                </div>

                                {linea?.modelos?.map((k, idxx) => (
                                    <div key={`k${idxx}`} className={` py-3 border-b border-white`}>
                                        <span className={`${linea.codigo == 'M11' ? 'text-5xl' : 'text-6xl'} font-bold block text-center w-full ${query?.data?.data?.slice(0, 1)[0]?.modelo == k?.nombre ? '!text-blue-300 animate-pulse ' : 'text-white'}`}>{k.cantidad} X {k?.nombre}</span>
                                    </div>
                                ))}

                                {/* <div className="w-full bg-cyan-500 absolute bottom-0 flex flex-col items-center">
                                        <span className="text-5xl font-bold text-white ">PROX. A INGRESAR</span>
                                        <span className="text-7xl font-bold text-white ">STHS X 120</span>
                                    </div> */}
                            </div>
                        ))}
                    </div>
                    {/* :
                        <div className="h-[calc(100vh-8rem)] w-full ">
                            <div className="flex items-center justify-center h-screen w-full"><Loader fontSize={150} /></div>
                        </div>
                    } */}

                    <div className={`w-full h-40 flex items-center justify-center ${statusResponse ? (statusResponse?.error ? 'bg-red-500' : 'bg-green-500') : 'bg-orange-300 border-2'}`}>
                        {isLoadingEgreso && <Loader fontSize={80} />}
                        {!statusResponse && !isLoadingEgreso && <span className="text-8xl font-semibold">ESCANEE KANBAN A EGRESAR</span>}
                        {statusResponse && <span className="text-white text-8xl font-semibold">{statusResponse.message.toUpperCase()}</span>}
                    </div>

                </div>
            }
        </div >
    )
}