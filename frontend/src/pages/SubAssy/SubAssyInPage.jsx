import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import TableKanbansStatus from "@components/TableKanbansStatus";
import useKanban from "@hooks/useKanban";
import { TIPO_KANBAN, estados } from "@utils/Constants";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function SubAssyInPage({ isAssy = false }) {
    const { register, control, handleSubmit, formState: { errors }, setFocus, setValue } = useForm();
    const { isLoading, changeStatus } = useKanban(false)
    const [statusResponse, setStatusResponse] = useState(null)
    const [reloadTableBuffer, setReloadTableBuffer] = useState(true)

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

        data.status = isAssy ? estados.COSTURA : estados.SUB_ASSY
        data.kanban = data.kanban.replaceAll("'", "-")

        const response = await changeStatus(data)

        setStatusResponse({
            error: response.error,
            message: response.message
        })

        if (!response.error) {
            setReloadTableBuffer(true)
        }

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

    useEffect(() => {

        setStatusResponse(null)
        setFocus("kanban")
        setTimeout(() => {
            setReloadTableBuffer(false)
        }, 200)
    }, [])

    return (
        <div>
            <span className="bg-yellow-200 p-2 block w-full rounded-md text-xl">ESCANEE EL CÓDIGO DE KANBAN PARA DAR INGRESO A {isAssy ? "ENSAMBLE" : "PRE-ENSAMBLE"}</span>

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
            {statusResponse?.error && <span className="text-2xl block w-full bg-error px-4 py-4 rounded-md text-white font-semibold text-center">{statusResponse.message}</span>}
            {statusResponse && !statusResponse?.error && <span className="text-2xl block w-full bg-success px-4 py-4 rounded-md text-white font-semibold text-center">Kanban aceptado</span>}

            <div className="mt-4">
                <TableKanbansStatus status={isAssy ? estados.COSTURA : estados.SUB_ASSY} reload={reloadTableBuffer} />
            </div>
        </div>
    )
}
