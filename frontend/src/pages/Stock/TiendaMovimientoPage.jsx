import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import usePiezas from "@hooks/usePiezas";
import { egresoTienda, ingresoTienda } from "@services/StockService";
import { TIPO_KANBAN, depositos, estados } from "@utils/Constants";
import { Modal } from 'antd';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


export default function TiendaMovimientoPage({ esEgreso = false }) {
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
        // setFocus("kanban")
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
        clear()

        document.addEventListener('keydown', (e) => {
            if (e.key == "Escape") {
                clear()
            }
        })

    }, [esEgreso])

    const onSubmit = async (data) => {
        const pPiezas = []

        if (data?.kanban) {

            if (esEgreso && data.kanban.substring(0, 1) == TIPO_KANBAN.REEMPLAZO) {
                setStatusResponse({ error: true, message: "El kanban ingresado no se puede egresar" })
                setValue("kanban", "")
                return
            }

            const response = await getPiezasByKanban(data.kanban.replaceAll("'", "-"), esEgreso, true)

            // console.log(response)

            const tipo = data.kanban.substring(0, 1);
            // console.log(response)

            if (response.error) {
                setStatusResponse({ error: true, message: response.message })
                setValue("kanban", "")
            } else {
                if (parseInt(response?.data?.estado?.estado_id) == estados.FINALIZADO) {
                    setStatusResponse({ error: true, message: "El kanban ingresado se encuentra FINALIZADO" })
                    setValue("kanban", "")
                    return
                }

                if (tipo == TIPO_KANBAN.PRODUCTIVO) {
                    setPiezas(response.data)
                } else if (tipo == TIPO_KANBAN.REEMPLAZO) {
                    const optimo = parseInt(response?.data?.reemplazo?.pieza?.pto_optimo)
                    const capas = parseInt(response?.data?.reemplazo?.capas)

                    for (let i = 0; i < capas; i++) {
                        for (let x = 0; x < optimo; x++) {
                            pPiezas.push({ ...response?.data?.reemplazo?.pieza, cantidad: 1, secuencia: `${i}-${x}` })
                        }
                    }

                    setPiezasRetirar(pPiezas)
                }

                setEnabled(false)

                if (!esEgreso && tipo == TIPO_KANBAN.PRODUCTIVO) {
                    const cantidad = parseInt(response?.data?.modelo?.cantidad)

                    response.data?.modelo?.partes?.map(partes => {
                        partes?.piezas?.map((pieza, idx) => {
                            pPiezas.push({ ...pieza, cantidad: cantidad, secuencia: idx + 1 })
                        })
                    })

                    setPiezasRetirar(pPiezas)
                }
            }
        }
    }

    const quitarPiezaARetirar = (id) => {

        // console.log(piezasRetirar)
        const data = piezasRetirar.filter(pieza => pieza.secuencia != id)
        setPiezasRetirar(data)
    }

    const confirmar = async () => {
        setIsLoading(true)
        let data, response;

        if (esEgreso) {
            data = {
                depositoIn: depositos.TIENDA,
                piezas: piezasRetirar,
                kanban: getValues("kanban").replaceAll("'", "-")
            }

            response = await egresoTienda(data);

        } else {

            data = {
                piezas: piezasRetirar,
                kanban: getValues("kanban").replaceAll("'", "-")
            }
            response = await ingresoTienda(data);
        }

        // console.log(response)}

        clear()
        setStatusResponse({ error: response.error, message: response.message })
        setIsLoading(false)
    }

    return (
        <div>
            <span className={`${esEgreso ? 'bg-yellow-200' : 'bg-emerald-200'} p-2 block w-full rounded-md text-xl`}>ESCANEE EL CÓDIGO DE KANBAN A {esEgreso ? "EGRESAR" : "INGRESAR"}</span>

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
                    className="bg-red-500 text-white text-xl disabled:opacity-50 min-w-[210px]">CANCELAR [ESC]</button>
            </div>

            {isLoadingPiezas && <div className="flex items-center justify-center mt-10"><Loader fontSize={100} /></div>}
            {statusResponse?.error && <span className="text-3xl block w-full bg-error px-4 py-2 rounded-md text-white font-semibold text-center">{statusResponse.message?.toUpperCase()}</span>}
            {statusResponse && !statusResponse?.error && <span className="text-3xl block w-full bg-success px-4 py-2 rounded-md text-white font-semibold text-center">{statusResponse.message?.toUpperCase()}</span>}

            {!isLoadingPiezas && !enabled &&
                <div className="w-full mt-4 flex items-start gap-2">
                    {/* <div className="flex flex-col gap-2 w-full">
                        <Collapse>
                            {piezas?.modelo?.partes?.map((partes, idx) => {
                                return <Collapse.Panel key={`k${idx}`} header={<span className="text-xl underline">{partes.codigo}</span>}> <div className=" " >
                                    <div className="w-full grid grid-cols-5 gap-2 ">
                                        {partes?.piezas?.map((pieza, idxx) => (
                                            <button

                                                // disabled={piezasRetirar.find((p) => p.id == pieza.id)} onClick={() => setPiezasRetirar([...piezasRetirar, pieza])}
                                                disabled={piezasRetirar.find((p) => p.id == pieza.id) || (esEgreso && parseInt(pieza.stock || 0) <= 0)} onClick={() => setPiezasRetirar([...piezasRetirar, pieza])}

                                                className={`flex flex-col items-center justify-betweenw-full h-32 disabled:opacity-50 p-2 ${(parseInt(pieza.stock || 0) <= 0 && esEgreso) ? 'bg-red-500' : 'bg-white border border-slate-500'}`}
                                                key={idxx}
                                            >
                                                <img className="object-contain w-full h-[80%]"
                                                    onError={({ currentTarget }) => {
                                                        currentTarget.onerror = null; // prevents looping
                                                        currentTarget.src = "/pieza_default.jpg";
                                                    }}
                                                    src={`/piezas/${pieza.codigo}.jpg`} />
                                                <span className="block w-full text-xl">{pieza?.codigo}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                </Collapse.Panel>
                            })}
                        </Collapse>
                    </div> */}
                    {/* R251006143332070 */}
                    <div className={`w-full rounded-md border p-2 sticky top-2 bg-gray-200`}>
                        <div className="w-full">
                            {!enabled && piezasRetirar?.length > 0 && <button onClick={() => setIsModalVisible(true)} className="hover:opacity-80 w-full mb-4 text-lg bg-emerald-500 text-white">CONFIRMAR {esEgreso ? "EGRESO" : "INGRESO"}</button>}

                            <span className="text-xl underline mb-2 block font-semibold">PIEZAS A {esEgreso ? "EGRESAR" : "INGRESAR"} ({piezasRetirar?.length})</span>

                            <div className="grid grid-cols-5 items-center gap-2">
                                {piezasRetirar?.length > 0 && piezasRetirar?.map((p, idx) => {
                                    return <div key={idx} className="border-b font-semibold text-xl flex items-center justify-between bg-orange-300 p-4 rounded-md">{p.codigo} <button onClick={() => quitarPiezaARetirar(p.secuencia)} className="p-0 px-2 bg-transparent font-bold">X</button></div>
                                })}
                            </div>

                            {!enabled && piezasRetirar?.length > 0 && <button onClick={() => setIsModalVisible(true)} className="hover:opacity-80 w-full mt-4 text-lg bg-emerald-500 text-white">CONFIRMAR {esEgreso ? "EGRESO" : "INGRESO"}</button>}
                        </div>
                    </div>
                </div>
            }

            <Modal
                title=""
                open={isModalVisible}
                onOk={confirmar}
                okText="Confirmar"
                okButtonProps={{ className: "bg-success" }}
                cancelButtonProps={{ className: "bg-error text-white" }}
                confirmLoading={isLoading}
                onCancel={() => setIsModalVisible(false)}
            >
                <div>
                    <p className="text-lg mb-4">¿Está seguro que desea confirmar el {esEgreso ? "egreso" : "ingreso"} de las siguientes piezas?</p>

                    <div className="max-h-[300px] overflow-y-scroll">
                        {piezasRetirar?.length > 0 && piezasRetirar?.map((p, idx) => {
                            return <div key={idx} className="border-b text-lg">- {p.codigo}</div>
                        })}
                    </div>
                </div>

            </Modal>
        </div>
    )
}
