import ModalSelectLectra from "@components/Corte/ModalSelectLectra"
import InputUseForm from "@components/InputUseForm"
import Loader from "@components/Loader"
import useLectraUpdates from "@hooks/useLectraUpdates"
import { getKanbanPapa } from '@services/ModelService'
import { getItemLocalStorage } from "@storage/UserAsyncStorage"
import { Table, Tag, message } from 'antd'
import { useEffect, useRef, useState } from 'react'
import { useForm } from "react-hook-form"

export default function CorteIndexPage() {
    const refDiv = useRef()
    // const { onKeyDown, finalText } = useCaptureScan()
    const [isLoading, setIsLoading] = useState(false)
    const [isVisibleLectraModal, setIsVisibleLectraModal] = useState(false)
    const { initDado, isLoading: isLoadingDado, endDado } = useLectraUpdates()
    const [messageDado, setMessageDado] = useState(null)
    const [kanbanLeido, setKanbanLeido] = useState(null)
    const [dataKanban, setDataKanban] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [error, setError] = useState(null)
    const [lectra, setLectra] = useState(null)
    const { register, formState: { errors }, setFocus, setValue } = useForm();

    // const finalText = "P240215143923039"

    const fetchData = async (kanbanScan) => {
        setError(null)

        const hasLectra = await verificarLectraActiva()
        if (!hasLectra) {
            return
        }

        setIsLoading(true)

        const data = await getKanbanPapa(kanbanScan.replaceAll("'", "-"), lectra?.value)

        if (data?.data?.length == 0 || data?.error) {
            setError(data?.message)
            setDataKanban([])
        } else {
            setKanbanLeido(kanbanScan)
            setDataKanban(data?.data)
            setTimeout(() => setFocus("kanban_corte"), [50])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [])

    const verificarLectraActiva = async () => {
        const data = await getItemLocalStorage("lectra")

        if (!data) {
            setIsVisibleLectraModal(true)
            return false
        } else {
            setLectra(JSON.parse(data))
            return true
        }
    }

    useEffect(() => {
        //Verifico si esta seleccionada la lectra
        verificarLectraActiva()
    }, [isVisibleLectraModal])


    return (
        <div
            // tabIndex="0"
            // onKeyDown={onKeyDown}
            className='  focus:outline-yellow-600 focus:outline-dotted p-2 focus:outline-2 w-full min-h-[100vh]'
        >
            {contextHolder}

            <ModalSelectLectra isVisible={isVisibleLectraModal} setIsVisible={setIsVisibleLectraModal} />

            <div className=" flex flex-col items-center gap-2 justify-between">
                <div className="p-0 w-full flex items-center gap-1 justify-end">

                    <span className="bg-slate-400 text-3xl font-bold p-2 text-center w-full">LECTRA {lectra?.value}</span>
                    <button onClick={() => {
                        setValue("kanban", null)
                        setDataKanban([])
                        setTimeout(() => {
                            setFocus("kanban")
                        }, 50)
                    }} className="text-red-500 p-0">CANCELAR</button>
                </div>
                {!isLoading && dataKanban?.length > 0 &&
                    <InputUseForm
                        name="kanban_corte"
                        label=""
                        className="w-full"
                        register={register}
                        errors={errors}
                        placeholder="Kanban de corte"
                        classNameInput="!text-xl !py-2 !border-2 !border-black"
                        onKeyPress={async (e) => {
                            if (e.key == 'Enter') {
                                setMessageDado(null)
                                const dado = e.target.value.replaceAll("'", "-").replaceAll('?', '_')
                                const response = await initDado(dado, lectra?.value, true)
                                setMessageDado({ error: response.error, message: response.message })
                                setValue("kanban_corte", null)

                                setTimeout(() =>
                                    setFocus("kanban_corte")
                                    , [50])
                            }
                        }}
                    />
                }
            </div>

            {messageDado && !isLoadingDado && <span className={`text-2xl block w-full p-1 mb-1 font-semibold text-center rounded-md text-white ${messageDado.error ? 'bg-red-500' : 'bg-green-500'}`}>{messageDado.message.toUpperCase()}</span>}
            {isLoadingDado && <div className="flex items-center justify-center"><Loader /></div>}
            <div className='flex flex-col'>
                {dataKanban?.length == 0 &&
                    <div className='flex flex-col items-center justify-center'>

                        <span className='text-5xl block w-full text-center py-4'>ESCANEE EL KANBAN</span>
                        <InputUseForm
                            name="kanban"
                            label=""
                            className="w-full"
                            register={register}
                            // type="text"
                            errors={errors}
                            placeholder="Kanban"
                            classNameInput="!text-xl !py-2 !border-2 !border-black"
                            onKeyPress={(e) => {
                                if (e.key == 'Enter') {
                                    fetchData(e.target.value)
                                }
                            }}
                        />
                    </div>
                }
                {isLoading && <Loader fontSize={100} />}

                {error && <div className='bg-red-500 flex items-center justify-center text-center text-white min-h-40 mt-10'><span className='text-6xl'>{error.toUpperCase()}</span></div>}

                {!isLoading && dataKanban?.length > 0 &&
                    <div className='flex flex-col items-center gap-4'>

                        <div className='flex justify-between items-center gap-4 w-full'>
                            <div className='border border-black w-full text-center'>
                                <span className='text-7xl p-2 block'>{dataKanban[0]?.modelo.fila?.fila}</span>
                                <div className='flex w-full px-2 items-center justify-between bg-yellow-300'>
                                    <span className='text-lg font-bold block'>COLOR: {dataKanban[0]?.modelo?.color?.color}</span>
                                    <span className='text-lg font-bold block'>MODELO: {dataKanban[0]?.modelo?.material?.material}</span>

                                </div>
                            </div>

                            <div className='bg-yellow-300 border border-black w-full  text-center flex flex-col'>
                                <span className='text-7xl font-bold p-2'>{dataKanban[0]?.modelo.nombre}</span>
                                <span className='text-lg font-bold block bg-orange-300'>REV-{dataKanban[0]?.modelo?.revision}</span>

                            </div>

                            <div className='border border-black w-full text-center'>
                                <span className='text-7xl font-bold p-2 block'>{dataKanban[0]?.modelo?.volumen}</span>
                                <span className='text-lg font-bold block bg-yellow-300'>VOLUMEN CAR SETS</span>
                            </div>
                        </div>


                        <Table
                            bordered={true}
                            loading={isLoading}
                            className='w-full'
                            size='small'
                            rowClassName={(r, idx) => {
                                if (idx % 2 == 0) {
                                    return "bg-slate-300 font-semibold text-xl w-full px-2"
                                } else {
                                    return "bg-white font-semibold text-xl w-full px-2"
                                }
                            }}
                            columns={[
                                {
                                    title: 'CONSUMO',
                                    key: 'consumo',
                                    dataIndex: 'consumo',
                                    className: 'font-semibold text-xl',
                                    align: "center",
                                    render: (text) => parseFloat(text).toFixed(1)
                                },
                                {
                                    title: 'No. TELA',
                                    key: 'material',
                                    dataIndex: 'material',
                                    render: (_, record) => record.material?.codigo_interno,
                                    className: 'font-semibold text-xl'
                                },
                                {
                                    title: 'DESCRIPCIÓN',
                                    key: 'material',
                                    dataIndex: 'material',
                                    render: (_, record) => record.material?.nombre,
                                    className: 'font-semibold text-xl'
                                },
                                {
                                    title: 'DADO // USO',
                                    key: 'dado',
                                    dataIndex: 'dado',
                                    className: 'font-semibold text-xl'
                                },
                                {
                                    title: 'CANTIDAD DE VECES',
                                    key: 'corte',
                                    dataIndex: 'corte',
                                    className: 'font-semibold text-xl',
                                },
                                {
                                    title: 'ESTADO',
                                    key: 'accion',
                                    dataIndex: 'accion',
                                    className: 'font-semibold text-xl',
                                    render: (_, record) => {
                                        if (record?.inicio == null) {
                                            return <button
                                                onClick={async () => {
                                                    await initDado(record?.dado, lectra?.value)
                                                    fetchData(kanbanLeido)
                                                }}
                                                className="text-sm bg-green-400 px-5 py-1">INICIAR</button>
                                        }

                                        if (record?.fin != null) {
                                            return <Tag color="geekblue-inverse">CORTADO</Tag>
                                        }

                                        return <div className="flex flex-row gap-1 items-center justify-start">
                                            <Tag color="green-inverse">EN CORTE</Tag>
                                            <button
                                                onClick={async () => {
                                                    await endDado(record?.dado, lectra?.value)
                                                    fetchData(kanbanLeido)
                                                }}
                                                className="text-sm bg-red-500 px-5 py-1">TERMINAR</button>
                                        </div>

                                    }
                                }
                            ]}
                            pagination={false}
                            rowKey={row => row.id}
                            dataSource={dataKanban}
                        />
                    </div>
                }
            </div>
        </div >
    )
}
