import SelectUseForm from "@components/SelectUseForm";
import { useForm } from "react-hook-form";
import usePlanificacion from "../../hooks/usePlanificacion";
import { useEffect } from "react";

export default function SelectPlanificaciones({ currentPlanificacion, setCurrenPlanificacion }) {
    const { register, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm();
    const { response, isLoading, fetchPlanificacions } = usePlanificacion(false)

    useEffect(() => {
        fetchPlanificacions()
    }, [])

    return (
        <div>

            <SelectUseForm
                onSelect={(data) => {
                    setCurrenPlanificacion(data)
                }}
                label="Consultar planificación"
                name="material"
                size="default"
                loading={isLoading}
                placeholder="Seleccione una planificación"
                // popupClassName="!text-sm"
                register={register}
                errors={errors}
                rules={{ required: "Debe seleccionar el material" }}
                className="w-full mb-4"
                search={true}
                control={control}
                options={response?.map((r) => { return { value: r.operacion, label: `${r.fecha} ${r.hora}` } })}
            />
        </div>
    )
}
