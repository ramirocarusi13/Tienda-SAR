import InputUseForm from "@components/InputUseForm"
import Loader from "@components/Loader"
import { cambiarEstadoCuarentena, getCuarentena } from "@services/StockService"
import { formatDate } from "@utils/Utils"
import { Modal, Table, message } from "antd"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const columns = [
    {
        title: "Modelo",
        key: "modelo",
        dataIndex: "modelo"
    },
    {
        title: "Fecha Kanban",
        key: "fecha",
        dataIndex: "fecha",
        render: (text) => formatDate(text)
    },
    {
        title: "Kanban",
        key: "codigo_kanban",
        dataIndex: "codigo_kanban"
    },
    {
        title: "Run",
        key: "run",
        dataIndex: "run"
    }
]

export default function CuarentenaPage() {

    const [cuarentena, setCuarentena] = useState([])
    const { register, control, handleSubmit, formState: { errors }, setFocus, getValues, setValue } = useForm();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalFifoOpen, setIsModalFifoOpen] = useState(false)
    const [enable, setEnable] = useState(false)
    const [text, setText] = useState(null)


    const fetchCuarentena = async () => {
        const data = await getCuarentena()
        setCuarentena(data.data)
    }

    const keyPressEnter = (e) => {
        if (e.key == 'Enter') {
            // handleSubmit(onSubmit)()
            //OBTENGO EL MES DEL KANBAN
            const mesKanban = e.target?.value?.slice(3, 5)
            const anoKanban = `20${e.target?.value?.slice(1, 3)}`

            const hoy = new Date()
            const mes = hoy.getMonth() + 1
            const ano = hoy.getFullYear()

            let dif = 0

            if (parseInt(ano) == parseInt(anoKanban)) {
                //SI SON DEL MISMO AÑO, VERIFICO QUE NO TENG MAS DE 3 MESES DE ANTIGUEDAD
                dif = Math.abs(parseInt(mesKanban) - mes)
            } else {
                //SI SON DE DISTINTO AÑO CHEQUEO
                dif = Math.abs(parseInt(ano) - parseInt(anoKanban))
                if (dif > 1) {
                    //SI HAY MÁS DE UN AÑO LO FRENO
                    dif = 12
                } else {
                    // SI HAY MENOS DE UN AÑO, CHEQUEO LOS MESES
                    if ((mesKanban >= 11 && mes <= 1) || (mesKanban >= 12 && mes <= 2)) {
                        dif = 0
                    } else {
                        dif = 12
                    }
                }
            }

            if (dif > 3) {
                setIsModalFifoOpen(true)
                return
            }

            setIsModalOpen(true)
        }
    }

    const changeStatusCuarentena = async (aprobado = true) => {
        setIsLoading(true)
        const data = await cambiarEstadoCuarentena(getValues("kanban"), {
            rechazado: aprobado ? 0 : 1
        })

        if (data.error) {
            message.error(data.message)
        } else {
            message.success("Actualizado correctamente")
        }

        setText("")
        setValue("kanban", null)
        setIsModalOpen(false)
        setIsModalFifoOpen(false)
        setIsLoading(false)
        fetchCuarentena()

        setTimeout(() => {
            setFocus("kanban")
        }, 50)
    }

    useEffect(() => {
        fetchCuarentena()
        setTimeout(() => {
            setFocus("kanban")
        }, [50])
    }, [])

    return (
        <div>
            {contextHolder}

            <div>
                <InputUseForm
                    label="Escanee el kanban a egresar de cuarentena"
                    name="kanban"
                    className="w-full"
                    register={register}
                    classNameInput="!text-2xl !py-4"
                    errors={errors}
                    placeholder="Nro Kanban"
                    rules={{ required: "Ingrese el número de Kanban" }}
                    onKeyPress={keyPressEnter}
                />
                <Table
                    dataSource={cuarentena}
                    columns={columns}
                    rowKey={item => item.id}
                    size="small"
                    pagination={false}
                />
            </div>

            <Modal
                onCancel={() => {
                    setIsModalOpen(false)
                }}
                open={isModalOpen}
                footer={[]}
            >
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-2xl w-full block text-center">Aprobación/Rechazo de Kanban</span>

                    <div className="flex items-center justify-center mt-6 gap-3">
                        <button
                            onClick={() => changeStatusCuarentena(true)}
                            disabled={isLoading}
                            className="text-xl bg-green-500">{isLoading ? <Loader /> : "APROBAR"}
                        </button>

                        <button
                            onClick={() => changeStatusCuarentena(false)}
                            // onClick={() => {
                            //     setIsModalOpen(false)
                            //     setValue("kanban", null)
                            //     setTimeout(() => {
                            //         setFocus("kanban")
                            //     }, 50)
                            // }}
                            disabled={isLoading}
                            className="text-xl bg-red-500">{isLoading ? <Loader /> : "RECHAZAR"}</button>
                    </div>
                </div>
            </Modal>

            <Modal
                onCancel={() => {
                    setIsModalFifoOpen(false)
                }}
                open={isModalFifoOpen}
                width={"90%"}
                footer={[]}
            >
                <div className="flex flex-col gap-2 w-full">
                    <span className="text-9xl font-bold w-full block text-center text-orange-600">ATENCIÓN!</span>
                    <span className="text-6xl font-bold w-full block text-center">EL KANBAN ESCANEADO NO RESPETA EL FIFO.</span>
                    <span className="text-6xl font-bold w-full block text-center">CONSULTE CON GERENCIA PC PARA AUTORIZARLO.</span>

                    <div className="w-full border-b-2 py-2 my-8 border-gray-400"></div>
                    <span className="block w-full text-center mt-4 text-2xl font-semibold">ESCRIBA <span className="font-bold text-orange-800">CONFIRMAR</span> PARA PODER APROBAR O RECHAZAR</span>

                    <input
                        value={text}
                        onInput={(e) => setText(e.target.value)}
                        type="text"
                        className="w-full border border-gray-600 text-xl rounded-xl p-2"
                        placeholder="CONFIRMAR"
                    />

                    <div className="flex items-center justify-center mt-6 gap-3">
                        <button
                            onClick={() => changeStatusCuarentena(true)}
                            disabled={isLoading || (text != "CONFIRMAR")}
                            className="disabled:opacity-70 disabled:cursor-not-allowed text-xl bg-green-500">{isLoading ? <Loader /> : "APROBAR"}
                        </button>

                        <button
                            onClick={() => changeStatusCuarentena(false)}
                            disabled={isLoading || (text != "CONFIRMAR")}
                            className="disabled:opacity-70 disabled:cursor-not-allowed text-xl bg-red-500">{isLoading ? <Loader /> : "RECHAZAR"}</button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
