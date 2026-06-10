import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import useStrap from "@hooks/useStrap";
import { verificaUsuarioValidoStrap, verificarCantidadReposicion, verificarEventoPendiente } from "@services/StrapService";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";


const TIPO_STRAP = {
    STRAP: 'S',
    REPOSICION: 'R'
}

const LINEAS = [
    'M1',
    'M2',
    'M10',
    'S1',
    'S2',
    'S10'
]

export default function EgresoStrap({ userVigente, setUserVigente }) {
    const { register, control, formState: { errors }, setFocus, watch, setValue, getValues } = useForm();
    const { verificaExistenciaRemoto, verificaModeloStrapKanban, isLoadingAlt, isLoading, validaCodigoAutorizacion, verificaExistenciaModeloStrap } = useStrap()
    const [kanbanActivo, setKanbanActivo] = useState("")

    const [isModalVisible, setIsModalVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const [statusResponse, setStatusResponse] = useState(null)
    const [errorValidation, setErrorValidation] = useState(null)
    const [dataValidation, setDataValidation] = useState(null)
    const [errorReposicion, setErrorReposicion] = useState(null)
    const [dataKanban, setDataKanban] = useState(null)
    const [visibleCantidad, setVisibleCantidad] = useState(false)
    const [dataReposicion, setDataReposicion] = useState([])
    const [modalReposicionVisible, setModalReposicionVisible] = useState(false)
    const [lineaSeleccionada, setLineaSeleccionada] = useState(null)
    const [userSeleccionado, setUserSeleccionado] = useState(null)
    const [modeloSeleccionado, setModeloSeleccionado] = useState(null)
    const [strapIngresado, setStrapIngresado] = useState(null)

    const watchCantidad = watch("cantidad", 0)
    const watchStrap = watch("strap", '')


    const verifica = async (kanban) => {
        const data = await verificaExistenciaRemoto(kanban)

        if (data.error) {
            setValue("kanban", "")
            setKanbanActivo("")
            setStatusResponse({
                error: true,
                message: data.message
            })
            setDisabled(false)
            return
        }

        if (data?.data?.length == 0) {
            setKanbanActivo("")
            setValue("kanban", "")
            setStatusResponse({
                error: true,
                message: "El kanban ingresado no existe o no es válido"
            })
            setDisabled(false)
            return
        }

        setDataKanban(data?.data)
        setStatusResponse(null)
        setKanbanActivo(kanban)
        setTimeout(() => {
            setFocus("strap")
        }, [50])

    }

    const verificaStrap = async (barcode, forzar = false) => {

        setStrapIngresado(barcode)
        // console.log(barcode, forzar)
        setModalReposicionVisible(false)

        const esReposicion = barcode?.length < 16;

        if (esReposicion && watchCantidad == 0) {

            // console.log(barcode, kanbanActivo)

            const tmpBarcode = barcode.substring(0, barcode.length - 3).replaceAll("'", "-")
            const tmpKanban = kanbanActivo.substring(2).replaceAll("'", "-")

            // console.log(tmpBarcode, tmpKanban)

            if (tmpBarcode != tmpKanban) {
                setDataValidation({
                    message: "El box escaneado no corresponde con el de la planilla"
                })
                setIsModalVisible(true)
                setValue("strap", null)
                setTimeout(() => { setFocus("cod_autorizacion") }, [50])
                return
            }

            setVisibleCantidad(true)
            setDisabled(true)
            setTimeout(() => setFocus("cantidad"), [50])
            return
        }

        // console.log("PASO")

        const data = await verificaModeloStrapKanban({
            kanban: kanbanActivo,
            barcode: barcode.replaceAll("]", "|").replaceAll("'", "-"),
            forzar: forzar,
            cantidad: getValues("cantidad"),
            reposicion: { items: dataReposicion },
            usuarioSolicitante: userSeleccionado?.data?.id,
            linea: lineaSeleccionada,
            modelo: modeloSeleccionado
        })

        // console.log(data)

        if (data.error) {
            setDataValidation(data)
            setIsModalVisible(true)
            setValue("strap", null)
            setTimeout(() => { setFocus("cod_autorizacion") }, [50])
            return
        }

        setValue("strap", null)
        setStatusResponse({
            error: false,
            message: "Egresado correctamente"
        })

        reset(false)

        setTimeout(() => { setFocus("kanban") }, [50])
        setTimeout(() => { setUserVigente(null) }, [1000])
    }

    const reset = (withStatus = true, tipoStrap = null) => {
        setValue("strap", null)
        setValue("kanban", null)
        setDataReposicion([])
        setValue("cantidad", 0)
        setValue("tipo_strap", tipoStrap ? tipoStrap : TIPO_STRAP.STRAP)
        setVisibleCantidad(false)
        setErrorReposicion(null)
        setLineaSeleccionada(null)
        setUserSeleccionado(null)
        setModeloSeleccionado(null)

        setDataKanban(null)
        if (withStatus) {
            setStatusResponse(null)
        }
        setDisabled(false)

        setTimeout(() => {
            setFocus("kanban")
        }, [50])
    }

    const verificarEvento = async () => {
        const data = await verificarEventoPendiente()
        // console.log(data)
        if (data?.data?.id > 0) {
            setDataValidation({
                message: data?.data?.evento,
                data: {
                    id_evento: data?.data?.id
                }
            })
            setIsModalVisible(true)
            setTimeout(() => { setFocus("cod_autorizacion") }, [50])
        }
    }

    const verificarCantidadEnReposicion = async () => {
        let barcode = watchStrap//getValues("strap")
        barcode = barcode.replaceAll("]", "|").replaceAll("'", "-")

        const payload = {
            cantidad: getValues("cantidad"),
            barcode: barcode// getValues("strap"),
        }

        const data = await verificarCantidadReposicion(payload)

        if (data?.error) {
            setDataReposicion([])
            setModalReposicionVisible(true)
            setErrorReposicion(data?.message)
        } else {
            setLineaSeleccionada(null)
            setUserSeleccionado(null)
            setValue("firma_materialista", null)
            setDataReposicion(data?.data)
            setModalReposicionVisible(true)
        }
    }

    useEffect(() => {
        setValue("tipo_strap", TIPO_STRAP.STRAP)
        verificarEvento()
    }, [])


    return (
        <div className="w-full pb-10 px-4 border-2 border-red-500 rounded-md bg-slate-100">

            <div className="flex items-center">
                <span className="block mt-4 text-2xl font-semibold">Egreso</span>
            </div>

            <Modal
                width={"50%"}
                open={modalReposicionVisible}
                footer={[
                    <button
                        className="bg-red-500 font-semibold mr-4 px-10" key={'btn2'}
                        onClick={() => {
                            setModalReposicionVisible(false)
                            reset()
                        }}>Cancelar</button>,
                    <button

                        onClick={() => {
                            if (!errorReposicion && !userSeleccionado?.error && lineaSeleccionada && userSeleccionado) {
                                verificaStrap(getValues("strap"))
                            }
                        }}
                        disabled={userSeleccionado?.error || !userSeleccionado}
                        className="bg-success font-semibold px-6 disabled:opacity-80" key={'btn1'}>Confirmar retiro</button>
                ]}
                closable={false}
            >
                <div className="w-full">
                    <div className={`w-full bg-yellow-300 p-4 text-xl mt-4 rounded-md text-black font-semibold`}>
                        <span>RETIRO STRAP REPOSICIÓN</span>
                    </div>

                    {errorReposicion && <span className="block font-semibold text-xl w-full text-red-500 p-2 my-2">{errorReposicion}</span>}

                    <div className="flex flex-col items-start mt-4">
                        {dataReposicion.map((r, idx) => (
                            <span key={idx} className="text-2xl font-semibold"> {r.cantidad} x LOTE {r.lote} - {r.posicion}</span>
                        ))}
                    </div>

                    {!errorReposicion &&
                        <>
                            <span className="block mt-4 text-xl font-semibold border-t-2 pt-2">SELECCIONE UNA LÍNEA</span>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {LINEAS.map((l, idx) => (
                                    <button
                                        onClick={() => {
                                            setLineaSeleccionada(l)
                                            setTimeout(() => {
                                                setFocus("firma_materialista")
                                            }, [50])
                                        }}
                                        className={` ${lineaSeleccionada == l ? 'bg-green-500' : 'bg-cyan-500'} text-2xl`} key={idx}
                                    >{l}</button>
                                ))}
                            </div>

                            <InputUseForm
                                name="firma_materialista"
                                label="Firma del solicitante"
                                className="w-full mt-6"
                                register={register}
                                type="password"
                                errors={errors}
                                placeholder="Código de autorización solicitante"
                                classNameInput="!text-3xl !py-4 !border-2 !border-black"
                                onKeyPress={async (e) => {
                                    if (e.key == 'Enter') {
                                        // console.log(dataValidation)
                                        const res = await verificaUsuarioValidoStrap(e.target.value)

                                        if (res.error) {
                                            e.target.value = ""
                                        }
                                        setUserSeleccionado(res)
                                    }
                                }}
                            />
                        </>
                    }

                    {userSeleccionado && <span className={`block font-semibold mt-2 text-xl ${userSeleccionado?.error ? "text-red-500" : "text-green-500"}`}>{userSeleccionado?.error ? userSeleccionado.message : "Usuario solicitante : " + userSeleccionado?.data?.email?.toUpperCase()}</span>}
                </div>
            </Modal>

            <Modal
                width={"60%"}
                open={isModalVisible}
                footer={[]}
                closable={false}
            >
                <div className="w-full">
                    <div className={`w-full bg-error p-4 text-xl mt-4 rounded-md text-white font-semibold`}>
                        <span>{dataValidation?.message.toUpperCase()}</span>
                    </div>

                    <InputUseForm
                        name="cod_autorizacion"
                        label="Ingrese el código de autorización"
                        className="w-full"
                        register={register}
                        type="password"
                        errors={errors}
                        placeholder="Código de autorización"
                        classNameInput="!text-3xl !py-4 !border-2 !border-black"
                        onKeyPress={async (e) => {
                            if (e.key == 'Enter') {
                                // console.log(dataValidation)
                                const res = await validaCodigoAutorizacion({ eventoId: dataValidation?.data?.id_evento, codAutorizacion: e.target.value.replaceAll("'", "-") })

                                if (res.error) {
                                    e.target.value = ""
                                    setErrorValidation(res.message)
                                } else {
                                    e.target.value = ""
                                    setErrorValidation(null)
                                    setIsModalVisible(false)
                                    setTimeout(() => { setFocus("kanban") }, [50])
                                }
                            }
                        }}
                    />

                    <button onClick={async () => {

                        const clave = getValues("cod_autorizacion")

                        if (!clave || clave == '') {
                            return
                        }

                        const res = await validaCodigoAutorizacion({ eventoId: dataValidation?.data?.id_evento, codAutorizacion: clave.replaceAll("'", "-") })
                        if (res.error) {
                            setErrorValidation(res.message)
                        } else {
                            setErrorValidation(null)

                            verificaStrap(strapIngresado, true)
                            setIsModalVisible(false)
                            setTimeout(() => { setFocus("kanban") }, [50])
                        }

                    }} className="bg-success">EGRESAR DE TODAS FORMAS</button>

                    {isLoadingAlt && <Loader />}
                    {errorValidation && !isLoadingAlt && <span className="text-sm font-semibold text-error">{errorValidation}</span>}
                </div>
            </Modal>

            <div className="flex items-start gap-4">
                <div className="flex flex-col items-center gap-1 w-full">

                    <InputUseForm
                        name="kanban"
                        label={"Escanee el kanban/Planilla"}
                        className="w-full"
                        register={register}
                        disabled={disabled}
                        // disabled={disabled || watchTipoStrap == TIPO_STRAP.REPOSICION}
                        errors={errors}
                        placeholder={"Escanear Kanban/Planilla"}
                        classNameInput="!text-3xl !py-4"
                        onKeyPress={(e) => {
                            if (e.key == 'Enter') {
                                setDisabled(true)
                                // if (watchTipoStrap == TIPO_STRAP.STRAP) {
                                verifica(e.target.value)
                                // } else {
                                // verificaModeloPartNumber(e.target.value)
                                // }
                            }
                        }}
                    />

                    <InputUseForm
                        name="strap"
                        label="Escanee Strap"
                        className="w-full"
                        disabled={!disabled}
                        // disabled={!disabled && watchTipoStrap == TIPO_STRAP.STRAP}
                        register={register}
                        errors={errors}
                        placeholder="Escanear strap"
                        classNameInput="!text-3xl !py-4"
                        onKeyPress={(e) => {
                            if (e.key == 'Enter') {
                                verificaStrap(e.target.value)
                            }
                        }}
                    />

                    {visibleCantidad &&
                        <InputUseForm
                            name="cantidad"
                            label="Ingrese la cantidad"
                            className="w-full"
                            disabled={!disabled}
                            type="number"
                            register={register}
                            errors={errors}
                            placeholder="Cantidad"
                            classNameInput="!text-3xl !py-4"
                            onKeyPress={(e) => {
                                if (e.key == 'Enter') {
                                    // verificaStrap(getValues("strap"))

                                    verificarCantidadEnReposicion()
                                }
                            }}
                        />
                    }
                </div>

                <div className="flex flex-col items-start justify-between w-full gap-2">
                    <div className="w-full h-[200px] pb-4">
                        {isLoading &&
                            <div className="flex items-center gap-4 w-full h-full justify-center">
                                <span className="text-xl font-semibold">Procesando</span>
                                <Loader />
                            </div>
                        }
                        {dataKanban && !isLoading &&
                            <div className="w-full border-2 p-2 ">
                                <span className="text-xl font-bold block mb-10">RETIRAR DE: </span>
                                <div className="flex flex-col items-start gap-2">
                                    {dataKanban?.posiciones?.map((d, idx) => {
                                        return <span className="text-2xl font-semibold flex items-center gap-2" key={idx}>{d.part_number} - BOX {d.posicion} - LOTE <span className={`px-2 ${(d.lote == 'SIN STOCK' || d.lote == 'EGRESADO PARA KANBAN') ? 'bg-red-500' : 'bg-green-400'}`}>{d.lote}</span></span>
                                    })}
                                </div>
                            </div>
                        }
                    </div>

                    <div className="w-full ">
                        <button onClick={() => reset()} className="bg-red-500 px-2 text-sm text-white mt-4">Cancelar</button>
                    </div>

                </div>
            </div>

            {statusResponse &&
                <div className={`w-full ${statusResponse?.error ? 'bg-error' : 'bg-success'} p-4 text-xl mt-4 rounded-md text-white`}>
                    <span>{statusResponse?.message}</span>
                </div>
            }

        </div>
    )
}
