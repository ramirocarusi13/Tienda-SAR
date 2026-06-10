import BtnWithLoader from "@components/Corte/BtnWithLoader"
import ModalSelectLectra from "@components/Corte/ModalSelectLectra"
import useLectraUpdates from "@hooks/useLectraUpdates"
import { getItemLocalStorage } from "@storage/UserAsyncStorage"
import { Table, Tag, notification } from 'antd'
import { useRef } from "react"
import { useEffect, useState } from 'react'
import { FaPlay, FaStop } from "react-icons/fa"
import useCaptureScan from '@hooks/useCaptureScan';
import { formatDateTime } from "@utils/Utils"

export default function GestionDadosPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isVisibleLectraModal, setIsVisibleLectraModal] = useState(false)
    const { initDadoById, isLoading: isLoadingDado, endDadoById, getPlanLectra, initDado } = useLectraUpdates()

    const [dataKanban, setDataKanban] = useState([])
    // const [messageApi, contextHolder] = message.useMessage();
    const [api, contextHolder] = notification.useNotification();

    const [error, setError] = useState(null)
    const [lectra, setLectra] = useState(null)
    const { onKeyDown, finalText, setFinalText } = useCaptureScan()

    const refDiv = useRef()

    const fetchData = async () => {
        setError(null)

        const lectra = await verificarLectraActiva()
        if (!lectra) {
            refDiv.current.focus()
            return
        }

        const res = []

        setIsLoading(true)
        const data = await getPlanLectra(lectra, true)

        // console.table(data?.data)

        setLectra(lectra)

        if (data?.data?.length == 0 || data?.error) {
            setError(data?.message)
            setDataKanban([])
        } else {

            data?.data?.forEach((d, idx) => {
                // d?.dados?.forEach((p, idx) => {
                if (d?.fin == null) {
                    res.push({
                        key: `${d?.modelo}-${idx}`,
                        modelo: d?.modelo,
                        ...d
                    })

                }
                // })
            });

            // console.log(res)
            setDataKanban(res)
        }
        setIsLoading(false)
        refDiv.current.focus()

    }

    const openNotification = (error = false, message = '', placement) => {
        if (error) {
            api.error({
                message: `Dados`,
                description: <span className="text-xl font-bold">{message}</span>,
                placement,
            });
        } else {
            api.success({
                message: `Dados`,
                description: <span className="text-xl font-bold">{message}</span>,
                placement,
            });
        }
    };

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        const interval = setInterval(() => {
            fetchData()
        }, 40000)

        return () => clearInterval(interval)
    }, [])

    const onFocus = () => {
        refDiv.current.focus()
    }

    useEffect(() => {

        document.title = "Gestión de dados"

        window.addEventListener("focus", onFocus)
        window.addEventListener("blur", onFocus)

        return () => {
            window.removeEventListener("focus", onFocus)
            window.removeEventListener("blur", onFocus)
        }
    }, [])


    const verificarLectraActiva = async () => {
        const data = await getItemLocalStorage("lectra")

        if (!data) {
            setIsVisibleLectraModal(true)
            return false
        } else {
            setLectra(JSON.parse(data)?.value)
            return JSON.parse(data)?.value
        }
    }

    const iniciarDado = async (dado) => {
        const response = await initDado(dado, lectra, true)
        // console.log(response)

        if (response?.error) {
            openNotification(true, response?.message)
        } else {
            fetchData()
        }
    }

    useEffect(() => {
        if (finalText) {
            // console.log(finalText)
            iniciarDado(finalText)
        }
    }, [finalText])

    useEffect(() => {
        fetchData()
    }, [isVisibleLectraModal])

    // console.log(dataKanban)
    return (
        <div autoFocus ref={refDiv} tabIndex="0" onKeyDown={onKeyDown} className='  focus:outline-yellow-600 focus:outline-dotted p-2 focus:outline-2 w-full min-h-[100vh]'>
            {contextHolder}

            <ModalSelectLectra isVisible={isVisibleLectraModal} setIsVisible={setIsVisibleLectraModal} />

            <div className=" flex flex-col items-center gap-2 justify-between">
                <div className="p-0 w-full flex items-center gap-1 justify-end">

                    <span className="bg-slate-400 text-6xl font-bold p-2 text-center w-full">LECTRA {lectra}</span>
                    <button
                        onClick={() => {
                            setDataKanban([])
                            setLectra(null)
                            setIsVisibleLectraModal(true)
                        }}
                        className="text-red-500 p-0 text-xl font-bold bg-transparent border-2 border-red-500">CAMBIAR LECTRA</button>
                </div>

            </div>

            <div className='flex flex-col'>
                {error && <div className='bg-red-500 flex items-center justify-center text-center text-white min-h-40 mt-10'><span className='text-6xl'>{error.toUpperCase()}</span></div>}
                <div className='flex flex-col items-center gap-4'>

                    <Table
                        bordered={true}
                        loading={isLoading}
                        className='w-full mt-3'
                        size='small'
                        rowClassName={(r, idx) => {
                            let className = ""

                            // console.log(r)

                            if (r?.inicio != null && r?.fin == null) {
                                className = "animate-pulse"
                            }

                            if (idx % 2 == 0) {
                                return `bg-slate-300 font-semibold text-xl w-full px-2 ${className}`
                            } else {
                                return `bg-white font-semibold text-xl w-full px-2 ${className}`
                            }
                        }}
                        columns={[
                            {
                                title: 'MODELO',
                                key: 'modelo',
                                dataIndex: 'modelo',
                                className: 'font-semibold text-2xl',
                                align: "center",
                            },
                            {
                                title: 'No. TELA',
                                key: 'material',
                                dataIndex: 'material',
                                render: (_, record) => record?.dados?.dado?.material?.codigo_interno,
                                className: 'font-semibold text-2xl'
                            },
                            {
                                title: 'DESCRIPCIÓN',
                                key: 'material',
                                dataIndex: 'material',
                                render: (_, record) => record?.dados?.dado?.material?.nombre,
                                className: 'font-semibold text-2xl'
                            },
                            {
                                title: 'DADO // USO',
                                key: 'dado',
                                dataIndex: 'dado',
                                className: 'font-semibold text-2xl',
                                render: (_, record) => record?.dados?.dado?.dado
                            },
                            {
                                title: 'DURACIÓN',
                                key: 'duracion',
                                dataIndex: 'duracion',
                                className: 'font-semibold text-2xl',
                                render: (_, record) => record?.duracion
                            },
                            {
                                title: 'FIN EST.',
                                key: 'fin_estimado',
                                dataIndex: 'fin_estimado',
                                className: 'font-semibold text-2xl',
                                render: (_, record) => record?.dados?.fin_estimado ? formatDateTime(record?.dados?.fin_estimado) : ''
                            },
                            {
                                title: 'ESTADO',
                                key: 'estado',
                                dataIndex: 'estado',
                                className: 'font-semibold text-2xl',
                                render: (_, record) => {
                                    if (record?.inicio == null) {
                                        return <div className="flex w-full items-center justify-center"><Tag className="text-xl" color="orange-inverse">PENDIENTE</Tag></div>
                                    }

                                    if (record?.fin != null) {
                                        return <div className="flex w-full items-center justify-center"><Tag className="text-xl" color="geekblue-inverse">CORTADO</Tag></div>
                                    }

                                    return <div className="flex w-full items-center justify-center"><Tag className="text-xl" color="green-inverse">EN CORTE</Tag></div>

                                }
                            },
                            {
                                title: 'ACCIONES',
                                key: 'accion',
                                dataIndex: 'accion',
                                className: 'font-semibold text-xl',
                                render: (_, record) => {
                                    // console.log(record?.dado)
                                    if (record?.inicio == null) {
                                        return <BtnWithLoader
                                            fn={async () => {
                                                // console.log(record?.dados?.id)
                                                // await initDadoById(record?.dados?.dado?.idLectraEstado, lectra)
                                                await initDadoById(record?.dados?.id, lectra)
                                                fetchData()
                                            }}
                                            text="INICIAR"
                                            icon={<FaPlay />}
                                            className="text-lg bg-green-400 px-5 py-3 my-2 flex items-center gap-2"
                                        />

                                    }

                                    if (record?.fin != null) {
                                        return null
                                    }

                                    return <BtnWithLoader
                                        fn={async () => {
                                            // console.log(record?.dados?.dado?.id)
                                            // await endDadoById(record?.dados?.dado?.idLectraEstado, lectra)
                                            await endDadoById(record?.dados?.id, lectra)
                                            fetchData()
                                        }}
                                        text="TERMINAR"
                                        icon={<FaStop />}
                                        className="text-lg bg-red-500 px-5 py-3 my-2 flex items-center gap-2"
                                    />
                                }
                            },
                        ]}
                        pagination={false}
                        rowKey={row => row.key}
                        dataSource={dataKanban}
                    />
                </div>
            </div>
        </div >
    )
}
