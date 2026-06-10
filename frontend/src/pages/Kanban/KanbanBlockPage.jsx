import InputUseForm from "@components/InputUseForm";
import { changeStatusKanban } from "@services/KanbanService";
import { estados } from "@utils/Constants";
import { Popconfirm } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function KanbanBlockPage() {

    const { register, watch, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
    const [response, setResponse] = useState({ error: false, message: null })
    const watchKanban = watch('kanban', null)

    const setBajaKanban = async () => {
        setResponse({ error: false, message: null })
        const data = await changeStatusKanban({
            status: estados.ANULADO,
            linea: null,
            kanban: watchKanban?.replaceAll("'", "-"),
            fuerza: true
        })

        setResponse(data)

        if (!data?.error) {
            setValue("kanban", null)
        }
    }

    return (
        <div>
            <div className="flex flex-col items-start gap-2">
                <InputUseForm
                    size="large"
                    label="Kanban"
                    name="kanban"
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Kanban"
                    rules={{ required: "Ingrese el código de kanban" }}
                />

                <Popconfirm
                    okButtonProps={{ className: 'bg-red-400' }}
                    okText="Dar de baja"
                    onConfirm={() => setBajaKanban()}
                    title='¿Está seguro que desea dar de baja el kanban? NO SE PODRÁ RECUPERAR'
                >
                    <button disabled={watchKanban == null || watchKanban == '' || watchKanban?.length < 10} className="bg-red-500 text-white py-1 disabled:opacity-60 disabled:cursor-not-allowed">DAR DE BAJA</button>
                </Popconfirm>

                {response?.message &&
                    <div className={` w-full p-2 rounded-md ${response?.error ? 'bg-red-500' : 'bg-green-400'} mt-4`}>
                        <span className="text-white text-center font-semibold text-xl">{response?.message?.toUpperCase()}</span>
                    </div>
                }
            </div>
        </div>
    )
}
