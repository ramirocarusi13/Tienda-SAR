import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import TableKanbansStatus from "@components/TableKanbansStatus";
import useKanban from "@hooks/useKanban";
import { TIPO_KANBAN, estados } from "@utils/Constants";
import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function KanbanMovimientoPage({ status }) {
    const { register, control, handleSubmit, formState: { errors }, setFocus, setValue, getValues } = useForm();
    const { isLoading, changeStatus, existenciaKanbanByEstado } = useKanban(false)
    const [statusResponse, setStatusResponse] = useState(null)
    const [reloadTableBuffer, setReloadTableBuffer] = useState(true)
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [countKanban, setCountKanban] = useState(0)

    const onSubmit = async (data) => {

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

        if (!response.error) {

            // if (countKanban + 1 >= 2) {
            //     setCountKanban(0)
            //     setTimeout(() => setFocus("posicion"), 50)
            //     setValue("posicion", null)

            // }

            //valido el estado actual
            if (parseInt(response?.data?.estado?.estado_id) == status) {
                setStatusResponse({
                    error: true,
                    message: "El kanban ingresado ya se encuentra en esté depósito"
                })
                setValue("kanban", null)
                return
            }

            if (status == estados.EN_BUFFER) {

                setValue("posicion", null)
                setTimeout(() => setFocus("posicion"), 50)

                //SI YA TRAE LINEA, ES UN KANBAN DE REPOSICION, NO PIDO LINEAS
                if (response?.data?.estado?.linea_id == "" || !response?.data?.estado?.linea_id) {
                    cambiarEstadoKanban(response.data.modelo.lineas[0])

                    // if (response?.data?.modelo?.lineas?.length == 0) {
                    //     setLineasDisponibles(lineas)
                    //     setIsModalVisible(true)

                    // } else if (response?.data?.modelo?.lineas?.length == 1) {
                    //     //mando linea automáticamente
                    //     cambiarEstadoKanban(response.data.modelo.lineas[0])
                    // } else {
                    //     setLineasDisponibles(response.data.modelo.lineas)
                    //     setIsModalVisible(true)
                    // }
                } else {
                    //mando linea automáticamente, respetando la que tiene
                    cambiarEstadoKanban(response?.data?.estado?.linea_id)
                }
            } else {
                cambiarEstadoKanban()
            }


        } else {
            setStatusResponse({
                error: response.error,
                message: response.message
            })

            setValue("kanban", null)
        }
    }

    const cambiarEstadoKanban = async (linea = { id: null }) => {
        setStatusResponse(null)

        const response = await changeStatus({
            status: status,
            linea: linea.id,
            kanban: getValues("kanban").replaceAll("'", "-")
        })

        setStatusResponse({
            error: response.error,
            message: response.message
        })

        if (!response.error) {
            setReloadTableBuffer(true)
        }

        setIsModalVisible(false)

        setValue("kanban", "")

        setTimeout(() => {
            setReloadTableBuffer(false)
        }, [200])
    }

    const keyPressEnter = (e) => {
        if (e.key == 'Enter') {
            handleSubmit(onSubmit)()
        }
    }

    const validatePosicionBuffer = (e) => {
        if (e.key != 'Enter') {
            return
        }

        setTimeout(() => setFocus("kanban"), 50)

        console.log(e.target.value)
    }

    useEffect(() => {
        setStatusResponse(null)
        if (status == estados.EN_BUFFER) {
            setTimeout(() => setFocus("posicion"), 50)
        } else {
            setTimeout(() => setFocus("kanban"), 50)
        }
    }, [status])

    useEffect(() => {
        if (status == estados.EN_BUFFER) {
            setTimeout(() => setFocus("posicion"), 50)
        } else {
            setTimeout(() => setFocus("kanban"), 50)
        }

        setTimeout(() => {
            setReloadTableBuffer(false)
        }, 200)
    }, [])

    return (
        <div className="p-2">
            {status == estados.EN_BUFFER &&
                <InputUseForm
                    name="posicion"
                    className="w-full mt-2"
                    register={register}
                    classNameInput="!text-2xl !py-4"
                    errors={errors}
                    placeholder="Posición Buffer"
                    rules={{ required: "Ingrese el número de Kanban" }}
                    onKeyPress={validatePosicionBuffer}
                />
            }

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

            {isLoading && <div className="flex items-center justify-center"><Loader /></div>}
            {statusResponse?.error && <span className="text-5xl block w-full bg-error px-4 py-6 rounded-md text-white font-semibold text-center">{statusResponse.message.toUpperCase()}</span>}
            {statusResponse && !statusResponse?.error && <span className="text-5xl block w-full bg-success px-4 py-6 rounded-md text-white font-semibold text-center">KANBAN ACEPTADO</span>}

            <div className="mt-4">
                <TableKanbansStatus status={status} reload={reloadTableBuffer} />
            </div>

            <Modal
                title=""
                open={isModalVisible}
                width={600}
                centered={true}
                closable={false}
                // onOk={confirmarEgreso}
                okText="Confirmar"
                footer={[]}
                okButtonProps={{ className: "bg-success" }}
                cancelButtonProps={{ className: "bg-error text-white" }}
                // confirmLoading={isLoading}
                onCancel={() => setIsModalVisible(false)}
            >
                {/* {isLoadingLineas && <div className="w-full flex items-center justify-center"><Loader /></div>} */}

                {/* {!isLoading &&
                    <div className="w-full">
                        <span className="text-3xl font-semibold block text-center">Seleccione la línea de ingreso</span>
                        <div className=" w-full grid gap-2 grid-cols-4 my-10">
                            {lineasDisponibles?.map((linea, idx) => (
                                <button onClick={() => cambiarEstadoKanban(linea)} className="text-2xl bg-orange-300 h-28 w-32" key={idx}>{linea.codigo}</button>
                            ))}
                        </div>
                    </div>
                } */}

                {isLoading &&
                    <div className="flex items-center justify-center flex-col gap-2">
                        <Loader />
                        <span className="block text-xl font-semibold">Cargando kanban en buffer</span>
                    </div>
                }



            </Modal>
        </div>
    )
}

