import { Modal } from 'antd'
import { useEffect } from 'react'
import { useState } from 'react'
import useKanban from "@hooks/useKanban";
import Loader from "@components/Loader";
import useTables from "@hooks/useTables";

import { TIPO_KANBAN, estados } from "@utils/Constants";

const status = estados.EN_BUFFER

export default function ModalChangeStatusKanban({ kanban, clearData, setUltimosEscaneos, ultimosEscaneos }) {
    const { isLoading, changeStatus, existenciaKanbanByEstado } = useKanban(false)
    const [statusResponse, setStatusResponse] = useState(null)
    const { isLoading: isLoadingBuffer, response: buffer, getData: getDataBuffer } = useTables("buffer/ultimos_ingresos", true)
    const [isVisible, setIsVisible] = useState(false)

    const onSubmit = async () => {
        const data = {
            kanban: kanban
        }
        setStatusResponse(null)

        if (data?.kanban.substr(0, 1) == TIPO_KANBAN.REEMPLAZO) {
            setStatusResponse({
                error: true,
                message: "El kanban indicado no se puede ingresar a esta zona"
            })
            return
        }

        //Verifico existencia Kanban
        const response = await existenciaKanbanByEstado({ kanban: data.kanban.replaceAll("'", "-"), estado: status }, true)
        if (!response.error) {

            //valido el estado actual
            if (parseInt(response?.data?.estado?.estado_id) == status) {
                setStatusResponse({
                    error: true,
                    message: "El kanban ingresado ya se encuentra en buffer"
                })
                return
            }

            if (response?.data?.modelo?.lineas?.length == 0) {
                await cambiarEstadoKanban(1)
            } else {
                await cambiarEstadoKanban(response?.data?.modelo?.lineas[0]?.id)
            }

            // let cantidad;
            // cantidad = parseInt(ultimosEscaneos?.find(m => m.modelo == response?.data?.modelo?.nombre)?.cantidad)
            // const temp = ultimosEscaneos?.filter(m => m.modelo != response?.data?.modelo?.nombre)

            // const payload = {
            //     modelo: response?.data?.modelo?.nombre,
            //     cantidad: cantidad ? cantidad + 1 : 1
            // }

            const res = await getDataBuffer(null, true)
            // console.log(res)
            setUltimosEscaneos(res?.data)
            // setUltimosEscaneos([...temp, payload])

        } else {
            setStatusResponse({
                error: response.error,
                message: response.message
            })


            // setEstadoPosicion(null)
            // setValue("kanban", null)
            // setTimeout(() => setFocus("kanban"), 50)
            // setValue("posicion", null)
        }
    }

    const cambiarEstadoKanban = async (linea = null) => {

        setStatusResponse(null)

        const response = await changeStatus({
            status: status,
            linea: linea,
            kanban: kanban.replaceAll("'", "-")
        })

        setStatusResponse({
            error: response.error,
            message: response.message
        })

        // setEstadoPosicion(null)
        // setValue("kanban", "")
        // setValue("posicion", null)
        // setTimeout(() => setFocus("posicion"), 50)
        // setTimeout(() => setFocus("kanban"), 50)

    }

    useEffect(() => {

        if (kanban) {
            setIsVisible(true)
            onSubmit()

            const interval = setInterval(() => {
                clearData(null)
                setIsVisible(false)
            }, 8000)

            return () => clearInterval(interval)
        }


    }, [kanban])

    return (
        <Modal
            width={"80%"}
            // wrapClassName='!bg-cyan-500'
            // className='!bg-green-400 !p-0'

            open={isVisible}
            // rootClassName='!bg-black'
            closable={false}
            footer={[]}

        >
            {isLoading && <div className="flex items-center justify-center mt-14"><Loader fontSize={220} /></div>}
            {statusResponse?.error && <span className="text-9xl block w-full bg-error  px-4 py-14 rounded-md text-white font-semibold text-center">{statusResponse.message.toUpperCase()}</span>}
            {statusResponse && !statusResponse?.error && <span className="text-9xl block w-full bg-success px-4 py-14 mt-6 rounded-md text-white font-semibold text-center">KANBAN ACEPTADO</span>}
        </Modal>
    )
}
