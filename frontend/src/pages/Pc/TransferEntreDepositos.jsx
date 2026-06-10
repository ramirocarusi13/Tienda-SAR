import SelectUseForm from "@components/SelectUseForm";
import { useForm } from 'react-hook-form';
import { depositos } from "@utils/Constants";
import InputUseForm from "@components/InputUseForm";
import { useState } from "react";
import { getPosicionesDeposito, transferirEntrePosiciones } from "@services/DepositoService";
import { useEffect } from "react";
import Loader from "@components/Loader"

const deps = [{ value: 8, label: 'RACKS' }, { value: 9, label: 'DOLLYS' }, { value: 10, label: 'TEMPO A' }, { value: 11, label: 'TEMPO B' }]

export default function TransferEntreDepositos() {
    const { register, control, handleSubmit, formState: { errors }, getValues, setFocus, setValue, watch, reset } = useForm();

    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    // const [statusResponse, setStatusResponse] = useState(null)

    const [posicionesOrigen, setPosicionesOrigen] = useState([])
    const [posicionesDestino, setPosicionesDestino] = useState([])

    const [contenido, setContenido] = useState(null)
    const [contenidoDest, setContenidoDest] = useState(null)

    const [habilitado, setHabilitado] = useState(false)

    const fetchPosiciones = async (depositoId, origen = true) => {
        const data = await getPosicionesDeposito(depositoId)

        // console.log(data?.data.ubicaciones)
        if (!data.error) {
            const posiciones = []

            data?.data?.ubicaciones?.map(i => {
                posiciones.push({
                    label: i.nombre,
                    value: i.id,
                    contenido: i?.ocupacion?.contenido
                })
            })

            if (origen) {
                setPosicionesOrigen(posiciones)
            } else {
                setPosicionesDestino(posiciones)
            }
        }
    }

    const watchPosOr = watch("pos_or")
    const watchPosDest = watch("pos_dest")
    const watchKanban = watch("kanban")

    useEffect(() => {

        if ((!watchPosOr && !watchKanban) && !watchPosDest) {
            setHabilitado(false)

            if (!watchPosOr) {
                setContenido(null)
            }

            if (!watchPosDest) {
                setContenidoDest(null)
            }
            return
        }

        if (contenido && (!contenidoDest || contenidoDest == 'EMPTY') && getValues("pos_dest")) {
            setHabilitado(true)
        } else {
            setHabilitado(false)
        }
    }, [contenido, contenidoDest, watchPosOr, watchPosDest])

    const onSubmit = async (data) => {
        // console.log("ENTRO")
        setIsLoading(true)
        const response = await transferirEntrePosiciones(data)

        setStatus({
            error: response.error,
            message: response.error ? response?.message : 'Transferencia correcta'
        })
        // console.log(response)

        if (!response.error) {
            reset({
                'pos_or': null,
                'pos_dest': null,
                'deposito_or': null,
                'deposito_dest': null
            })

            setPosicionesDestino([])
            setPosicionesOrigen([])
            setContenido(null)
            setContenidoDest(null)
            setHabilitado(false)
        }

        setIsLoading(false)

    }

    return (
        <div>
            <div className="flex items-center gap-2">
                <SelectUseForm
                    label="Deposito origen"
                    name="deposito_or"
                    placeholder="Seleccione un deposito"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el deposito" }}
                    className="w-full"
                    search={true}
                    control={control}
                    options={deps}
                    onSelect={(val) => {
                        fetchPosiciones(val)
                        setValue("pos_or", null)
                    }}
                />

                <SelectUseForm
                    label="Deposito destino"
                    name="deposito_dest"
                    placeholder="Seleccione un deposito"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el deposito" }}
                    className="w-full"
                    search={true}
                    control={control}
                    options={deps}
                    onSelect={(val) => {
                        fetchPosiciones(val, false)
                        setValue("pos_dest", null)
                    }}
                />
            </div>

            <div className="flex items-start gap-2">
                <div className="flex flex-col items-start w-full gap-2">
                    <SelectUseForm
                        label="Posición origen"
                        name="pos_or"
                        placeholder="Seleccione una posición"
                        register={register}
                        errors={errors}
                        // rules={{ required: "Debe seleccionar la posición origen" }}
                        className={`w-full ${getValues("deposito_or") != depositos.RACKS && 'hidden'}`}
                        // className="w-full"
                        search={true}
                        control={control}
                        options={posicionesOrigen}
                        onSelect={(val) => {
                            const dep = getValues("deposito_or")

                            if (dep == depositos.RACKS) {
                                const cont = posicionesOrigen?.find(p => p.value == val)

                                if (cont) {
                                    if (cont?.contenido) {
                                        setContenido(cont?.contenido[0])
                                    } else {
                                        setContenido('EMPTY')
                                    }
                                } else {
                                    setContenido('EMPTY')
                                }
                            }
                        }}
                    />

                    <InputUseForm
                        control={control}
                        label="Kanban"
                        name="kanban"
                        className={`w-full mt-3 ${getValues("deposito_or") == depositos.RACKS && 'hidden'}`}
                        register={register}
                        size="large"
                        errors={errors}
                        placeholder="Kanban"
                        onKeyPress={(e) => {
                            if (e.key == 'Enter') {
                                setContenido({
                                    detalle: 'KANBAN',
                                    contenido: e.target.value
                                })
                            }
                        }}
                    />

                    {contenido == 'EMPTY'
                        ?
                        <span className="bg-red-500 w-full block p-2 font-semibold">POSICIÓN SIN CONTENIDO</span>
                        :
                        contenido ? <div className="flex w-full border flex-col p-2 bg-green-500">
                            <span className="font-semibold">CONTENIDO : {contenido.detalle} - {contenido.contenido}</span>
                        </div> : <></>
                    }

                </div>

                <div className="flex flex-col items-start w-full gap-2">

                    <SelectUseForm
                        label="Posición destino"
                        name="pos_dest"
                        placeholder="Seleccione una posición"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar la posición destino" }}
                        // className={`w-full ${getValues("deposito_or") != depositos.RACKS && 'hidden'}`}
                        className="w-full"
                        search={true}
                        control={control}
                        options={posicionesDestino}
                        onSelect={(val) => {

                            const dep = getValues("deposito_dest")

                            if (dep == depositos.RACKS) {

                                const cont = posicionesDestino?.find(p => p.value == val)

                                // console.log(posicionesOrigen)
                                // console.log(cont)
                                if (cont) {
                                    if (cont?.contenido) {
                                        setContenidoDest(cont?.contenido[0])
                                    } else {
                                        setContenidoDest('EMPTY')
                                    }
                                } else {
                                    setContenidoDest('EMPTY')
                                }
                            }
                        }}
                    />

                    {contenidoDest == 'EMPTY'
                        ?
                        <span className="bg-green-500 w-full block p-2 font-semibold">POSICIÓN LIBRE</span>
                        :
                        contenidoDest ? <div className="flex w-full border flex-col p-2 bg-red-500">
                            <span className="font-semibold ">POSICIÓN OCUPADA</span>
                            <span className="font-semibold ">CONTENIDO : {contenidoDest.detalle} - {contenidoDest.contenido}</span>
                        </div> : <></>
                    }
                </div>

            </div>
            <button onClick={handleSubmit(onSubmit)} disabled={!habilitado} className="disabled:opacity-60 disabled:cursor-not-allowed w-full bg-green-500 mt-4">Confirmar transferencia</button>



            {/* <InputUseForm
                control={control}
                label="Posición origen"
                rules={{ required: "Debe ingresar la posición" }}
                name="posicion or"
                className="w-full "
                register={register}
                size="large"
                errors={errors}
                placeholder="Posición"
                onKeyPress={(e) => {
                    if (e.key == 'Enter') {
                        setTimeout(() => {
                            setFocus("kanban")
                        }, 50)
                    }
                }}
            />

            <InputUseForm
                control={control}
                label="Kanban"
                rules={{ required: "Debe ingresar el kanban" }}
                name="kanban"
                className="w-full "
                register={register}
                size="large"
                errors={errors}
                placeholder="Kanban"
                onKeyPress={(e) => {
                    if (e.key == 'Enter') {
                        handleSubmit(onSubmit)()
                    }
                }}
            /> */}

            {isLoading && <div className="w-full flex items-center justify-center mt-10"><Loader fontSize={50} /></div>}

            {status &&
                <div className="mt-10">
                    {status.error && <span className="bg-red-500 text-white font-bold  p-2 text-6xl text-center block">{status.message?.toUpperCase()}</span>}
                    {!status.error && <span className="bg-green-500 text-white font-bold p-2  text-6xl text-center block">GUARDADO CORRECTAMENTE</span>}
                </div>
            }
        </div>
    )
}
