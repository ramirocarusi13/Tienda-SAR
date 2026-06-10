import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import usePiezas from "@hooks/usePiezas";
import { egresoTienda } from "@services/StockService";
import { depositos } from "@utils/Constants";
import { Collapse, Modal } from 'antd';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function TiendaEgresoPage() {
    const [piezasRetirar, setPiezasRetirar] = useState([])
    const { register, control, handleSubmit, formState: { errors }, setFocus, setValue, getValues } = useForm();
    const { isLoading: isLoadingPiezas, getPiezasByKanban } = usePiezas()
    const [enabled, setEnabled] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [statusResponse, setStatusResponse] = useState(null)
    const [piezas, setPiezas] = useState([])

    const clear = () => {
        setIsModalVisible(false)
        setPiezasRetirar([])
        setValue("kanban", "")
        setEnabled(true)
        setStatusResponse(null)
        setTimeout(() => {
            setFocus("kanban")
        }, 50)
    }

    const keyPressEnter = (e) => {
        if (e.key == 'Enter') {
            if (statusResponse) {
                setStatusResponse(null)
            }
            setPiezasRetirar([])
            handleSubmit(onSubmit)()
        }
    }

    useEffect(() => {
        setFocus("kanban")
    }, [])

    const onSubmit = async (data) => {
        // console.log(data)
        if (data?.kanban) {
            const response = await getPiezasByKanban(data.kanban, true, true)

            // console.log(response)
            // console.log(piezas)
            if (response.error) {
                setStatusResponse({ error: true, message: response.message })
                setValue("kanban", "")
            } else {
                setPiezas(response.data)
                setEnabled(false)
            }
        }
    }

    const quitarPiezaARetirar = (id) => {
        const data = piezasRetirar.filter(pieza => pieza.id != id)
        setPiezasRetirar(data)
    }

    const confirmarEgreso = async () => {
        setIsLoading(true)

        const data = {
            depositoIn: depositos.TIENDA,
            piezas: piezasRetirar,
            kanban: getValues("kanban")
        }

        const response = await egresoTienda(data);
        setStatusResponse({ error: true, message: response.message })

        clear()
        setIsLoading(false)

    }
    return (
        <div>
            <span className="bg-yellow-200 p-2 block w-full rounded-md text-xl">ESCANEE EL CÓDIGO DE KANBAN A EGRESAR</span>

            <div className="flex items-center gap-2 justify-between">
                <InputUseForm
                    name="kanban"
                    className="w-full mt-2"
                    register={register}
                    classNameInput="!text-2xl !py-4"
                    errors={errors}
                    placeholder="Nro Kanban"
                    rules={{ required: "" }}
                    onKeyPress={keyPressEnter}
                    disabled={!enabled}
                />

                <button
                    onClick={() => clear()}
                    disabled={enabled}
                    className="bg-red-500 text-white text-xl disabled:opacity-50">Cancelar</button>
            </div>

            {isLoadingPiezas && <div className="flex items-center justify-center"><Loader /></div>}
            {statusResponse?.error && <span className="text-xl block w-full bg-error px-4 py-2 rounded-md text-white font-semibold text-center">{statusResponse.message}</span>}
            {statusResponse && !statusResponse?.error && <span className="text-xl block w-full bg-success px-4 py-2 rounded-md text-white font-semibold text-center">Kanban aceptado</span>}

            {!isLoadingPiezas && !enabled &&
                <div className="w-full mt-4 flex items-start gap-2">
                    <div className="flex flex-col gap-2 w-full">
                        <Collapse>
                            {piezas?.modelo?.partes?.map((partes, idx) => {
                                return <Collapse.Panel key={`q${idx}`} header={<span className="text-xl underline">{partes.codigo}</span>}> <div className=" " >
                                    <div className="w-full grid grid-cols-5 gap-2 ">
                                        {partes?.piezas?.map((pieza, idxx) => (
                                            <button
                                                disabled={piezasRetirar.find((p) => p.id == pieza.id) || parseInt(pieza.stock || 0) <= 0} onClick={() => setPiezasRetirar([...piezasRetirar, pieza])}
                                                className={`flex flex-col items-center justify-betweenw-full h-30 disabled:opacity-50 p-2 ${parseInt(pieza.stock || 0) <= 0 ? 'bg-red-500' : 'bg-emerald-400'}`}
                                                key={idxx}
                                            >
                                                <img className="object-contain w-full h-full"
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = "/pieza_default.jpg";
                                                    }}
                                                    src={`/${pieza.codigo}.jpg`} />
                                                <span className="block w-full text-xl">{pieza?.codigo}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                </Collapse.Panel>
                            })}
                        </Collapse>

                        {/* {piezas?.modelo?.partes?.map((partes, idx) => {
                            return <div className=" border p-4 bg-gray-200 rounded-md" key={idx}>
                                <span className="block w-full text-2xl py-2 underline">{partes.codigo}</span>

                                <div className="w-full grid grid-cols-4 gap-2 " key={idx}>
                                    {partes?.piezas?.map((pieza, idxx) => (
                                        <button disabled={piezasRetirar.find((p) => p.id == pieza.id) || parseInt(pieza.stock || 0) <= 0} onClick={() => setPiezasRetirar([...piezasRetirar, pieza])} className={`w-full h-20 disabled:opacity-50 p-2 ${parseInt(pieza.stock || 0) <= 0 ? 'bg-red-500' : 'bg-emerald-400'}`} key={idxx}>
                                            <span className="block w-full text-xl">{pieza?.codigo}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        })} */}
                    </div>

                    <div className="w-full rounded-md max-w-[30%] border p-2 sticky top-2 bg-gray-200">
                        <div className="w-full">
                            <span className="text-xl underline mb-2 block">Piezas a egresar</span>

                            {piezasRetirar?.length > 0 && piezasRetirar?.map((p, idx) => {
                                return <div key={idx} className="border-b flex items-center justify-between">{p.codigo} <button onClick={() => quitarPiezaARetirar(p.id)} className="p-0 px-2 bg-transparent">X</button></div>
                            })}

                            {!enabled && piezasRetirar?.length > 0 && <button onClick={() => setIsModalVisible(true)} className="w-full mt-4 text-lg bg-emerald-500 text-white">Confirmar egreso</button>}
                        </div>
                    </div>
                </div>
            }

            <Modal
                title=""
                open={isModalVisible}
                onOk={confirmarEgreso}
                okText="Confirmar"
                okButtonProps={{ className: "bg-success" }}
                cancelButtonProps={{ className: "bg-error text-white" }}
                confirmLoading={isLoading}
                onCancel={() => setIsModalVisible(false)}
            >
                <div>
                    <p className="text-lg mb-4">¿Está seguro que desea confirmar el egreso de las siguientes piezas?</p>

                    {piezasRetirar?.length > 0 && piezasRetirar?.map((p, idx) => {
                        return <div key={idx} className="border-b text-lg">- {p.codigo}</div>
                    })}
                </div>

            </Modal>
        </div>
    )
}
