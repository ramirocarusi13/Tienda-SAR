import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import useKanban from "@hooks/useKanban";
import { TIPO_KANBAN, estados } from "@utils/Constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { routesNames } from "@utils/Constants";

// const bufferPermitidos = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11']

export default function BufferInPage({ status }) {
    const { register, control, handleSubmit, formState: { errors }, setFocus, setValue, getValues } = useForm({
        defaultValues: {
            kanban: null
        }
    });

    const { isLoading, changeStatus, existenciaKanbanByEstado } = useKanban(false)
    const [statusResponse, setStatusResponse] = useState(null)
    // const [procesando, setProcesando] = useState(true)
    // const [estadoPosicion, setEstadoPosicion] = useState(null)
    // const [kanbansEscaneados, setKanbanEscaneados] = useState(0)
    const navigate = useNavigate()
    let location = useLocation();

    const onSubmit = async (data) => {

        // console.log(data)
        // console.log("PASO")

        setStatusResponse(null)

        if (data?.kanban.substr(0, 1) == TIPO_KANBAN.REEMPLAZO) {
            setStatusResponse({
                error: true,
                message: "El kanban indicado no se puede ingresar a esta zona"
            })
            setValue("kanban", "")
            return
        }

        //Verifico existencia Kanban
        const response = await existenciaKanbanByEstado({ kanban: data.kanban.replaceAll("'", "-"), estado: status }, true)

        // console.log(response)

        if (!response.error) {

            //valido el estado actual
            if (parseInt(response?.data?.estado?.estado_id) == status) {
                setStatusResponse({
                    error: true,
                    message: "El kanban ingresado ya se encuentra en esté depósito"
                })
                // setEstadoPosicion(null)
                setValue("kanban", null)
                // setValue("posicion", null)
                setTimeout(() => setFocus("kanban"), 50)
                return
            }

            if (status == estados.EN_BUFFER) {

                // cambiarEstadoKanban(parseInt(data?.posicion.replace("M", "")))

                // console.log(response?.data)
                //SI YA TRAE LINEA, ES UN KANBAN DE REPOSICION, NO PIDO LINEAS
                // if (response?.data?.estado?.linea_id == "" || !response?.data?.estado?.linea_id) {
                //     cambiarEstadoKanban(response.data.modelo.lineas[0])

                //     if (response?.data?.modelo?.lineas?.length == 0) {
                //         setLineasDisponibles(lineas)
                //         setIsModalVisible(true)

                //     } else if (response?.data?.modelo?.lineas?.length == 1) {
                //         //mando linea automáticamente
                //         cambiarEstadoKanban(response.data.modelo.lineas[0])
                //     } else {
                //         setLineasDisponibles(response.data.modelo.lineas)
                //         setIsModalVisible(true)
                //     }
                // } else {
                //mando linea automáticamente, respetando la que tiene
                // console.log(response?.data?.estado?.linea_id)
                if (!response?.data?.estado?.linea_id) {
                    await cambiarEstadoKanban(1)
                } else {
                    await cambiarEstadoKanban(response?.data?.estado?.linea_id)
                }
                // }
                // } else {
                //     cambiarEstadoKanban()
            }


        } else {
            setStatusResponse({
                error: response.error,
                message: response.message
            })
            // setEstadoPosicion(null)
            setValue("kanban", null)
            setTimeout(() => setFocus("kanban"), 50)
            // setValue("posicion", null)
        }
    }

    const cambiarEstadoKanban = async (linea = null) => {
        console.log("PASO 1", linea)
        setStatusResponse(null)

        const response = await changeStatus({
            status: status,
            linea: linea,
            kanban: getValues("kanban").replaceAll("'", "-")
        })

        // console.log("R", response)

        setStatusResponse({
            error: response.error,
            message: response.message
        })

        // setEstadoPosicion(null)
        setValue("kanban", "")
        // setValue("posicion", null)
        // setTimeout(() => setFocus("posicion"), 50)
        setTimeout(() => setFocus("kanban"), 50)

    }

    const keyPressEnter = (e) => {
        if (e.key == 'Enter') {

            if (e.target.value == 'CANCELAR') {
                navigate(routesNames.CORTE.STATUS)
                // setEstadoPosicion(null)
                // setValue("kanban", null)
                // setTimeout(() => setFocus("kanban"), 50)
                return
            }

            //Verifico si escaneo posicion
            // if (bufferPermitidos.find(b => b == e.target.value.toUpperCase())) {
            //     validatePosicionBuffer(e.target.value)
            //     setValue("kanban", null)
            //     return
            // }

            handleSubmit(onSubmit)()
        }
    }

    const validatePosicionBuffer = (value) => {

        // if (e.key != 'Enter') {
        //     return
        // }

        if (value == 'CANCELAR') {
            navigate(routesNames.CORTE.STATUS)

            // setValue("posicion", null)
            // setValue("kanban", null)
            // setStatusResponse(null)
            // setTimeout(() => setFocus("kanban"), 50)
            // setEstadoPosicion(null)
            return
        }

        // setEstadoPosicion(null)
        setStatusResponse(null)

        const posicion = value.toUpperCase()

        // if (!bufferPermitidos.includes(posicion)) {
        //     setEstadoPosicion({
        //         error: true,
        //         message: 'El código de posición escaneado no es válido'
        //     })

        //     setValue("posicion", null)
        //     // setTimeout(() => setFocus("posicion"), 50)

        //     return
        // }

        // setEstadoPosicion({
        //     error: false,
        //     message: `BUFFER : ${posicion}`
        // })
        // setValue("posicion", posicion)

        setTimeout(() => setFocus("kanban"), 50)

    }

    useEffect(() => {
        // console.log("ENTRO 3", location?.state)
        console.log("PASO USE EFFECT", location?.state)
        if (location?.state?.kanban) {
            setValue("kanban", location?.state?.kanban)
            // handleSubmit(onSubmit)()
            keyPressEnter({
                key: 'Enter',
                target: {
                    value: location?.state?.kanban
                }
            })

            // window.history.replaceState({}, '')

            // setValue("posicion", location?.state?.position)
            // validatePosicionBuffer(location?.state?.position)

        } else {
            setTimeout(() => setFocus("kanban"), 50)
        }

        // console.log(location.state)
    }, [])


    useEffect(() => {
        const interval = setInterval(() => {
            navigate(routesNames.CORTE.STATUS)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="p-2">
            {/* {status == estados.EN_BUFFER &&
                <InputUseForm
                    name="posicion"
                    className="w-full mt-2"
                    register={register}
                    classNameInput="!text-2xl !py-4"
                    errors={errors}
                    placeholder="Posición Buffer"
                    rules={{ required: "Debe escanear el código de posición" }}
                    onKeyPress={(e) => {
                        if (e.key != 'Enter') {
                            return
                        }
                        validatePosicionBuffer(e.target.value)
                    }}
                />
            } */}

            <InputUseForm
                name="kanban"
                className="w-full mt-2"
                register={register}
                classNameInput="!text-2xl !py-4"
                errors={errors}
                placeholder="Nro Kanban"
                rules={{ required: "Ingrese el número de Kanban" }}
                onKeyPress={keyPressEnter}
            />



            {/* <div className="w-full flex items-center justify-center">
                {estadoPosicion ?
                    <div className={`${estadoPosicion?.error ? 'bg-error text-white' : 'bg-cyan-500 text-black'} w-[60%] mt-5 h-full flex items-center justify-center`}>
                        <span className="text-9xl font-semibold">{estadoPosicion?.message?.toUpperCase()}</span>
                    </div>
                    :
                    <div className={`bg-orange-300 w-full mt-5 min-h-[60vh] flex items-center justify-center`}>
                        <span className="text-9xl font-semibold">ESCANEE LA POSICIÓN</span>
                    </div>
                }
            </div> */}

            {isLoading && <div className="flex items-center justify-center mt-14"><Loader fontSize={220} /></div>}
            {statusResponse?.error && <span className="text-8xl block w-full bg-error mt-6 px-4 py-14 rounded-md text-white font-semibold text-center">{statusResponse.message.toUpperCase()}</span>}
            {statusResponse && !statusResponse?.error && <span className="text-9xl block w-full bg-success px-4 py-14 mt-6 rounded-md text-white font-semibold text-center">KANBAN ACEPTADO</span>}
        </div>
    )
}

