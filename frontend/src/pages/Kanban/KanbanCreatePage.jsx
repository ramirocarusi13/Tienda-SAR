import InputUseForm from "@components/InputUseForm";
import KanbanPrint from "@components/KanbanPrint";
import KanbanReversoPrint from "@components/KanbanReversoPrint";
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import useKanban from "@hooks/useKanban";
import useModels from "@hooks/useModels";
import { meses } from "@utils/Constants";
import { getFullMonth } from "@utils/Utils";
import { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useReactToPrint } from 'react-to-print';

export default function KanbanCreatePage() {
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: 4 }, (_, index) => {
        const year = String(currentYear - index)
        return { value: year, label: year }
    })
    const { register, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ defaultValues: { cantidad_reverso: "1", hojas: "1", ano: String(currentYear) } });
    const { isLoading: isLoadingModels, response: models } = useModels()
    const { isLoading, store: createkanban } = useKanban(false)
    const [kanbans, setKanbans] = useState([])
    const [pages, setPages] = useState(1)

    const componentRef = useRef();
    const componentRevRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const handlePrintReverso = useReactToPrint({
        content: () => componentRevRef.current,
    });

    const onSubmit = async (data) => {
        setKanbans(null)

        await createkanban(data, (response) => {
            if (!response.error) {
                setKanbans(response.data)
                setPages(parseInt(data.hojas) * 4)

                setTimeout(() => {
                    handlePrint()
                }, [200])
            }
        })
    }

    const printReverso = () => {
        setPages(parseInt(getValues("cantidad_reverso")))

        setTimeout(() => {
            handlePrintReverso()
        }, [200])
    }

    useEffect(() => {
        const now = new Date();

        setValue("mes", getFullMonth(now))
        setValue("ano", String(now.getFullYear()))
    }, [])

    return (
        <div>
            <div className="border p-2 rounded-lg">
                <span className="underline text-xl">Kanban productivo</span>
                <div className='flex gap-2 w-[100%] items-center'>
                    <SelectUseForm
                        label="Modelo"
                        name="modelo"
                        placeholder="Seleccione un modelo"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar el modelo" }}
                        className="w-full "
                        search={true}
                        loading={isLoadingModels}
                        control={control}
                        options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                    />

                    <SelectUseForm
                        label="Mes"
                        name="mes"
                        placeholder="Seleccione un mes"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar el mes" }}
                        className="w-full "
                        search={true}
                        control={control}
                        options={meses}
                    />

                    <SelectUseForm
                        label="Año"
                        name="ano"
                        placeholder="Seleccione un año"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar el año" }}
                        className="w-full "
                        search={true}
                        control={control}
                        options={years}
                    />

                    <InputUseForm
                        label="Cant. de hojas"
                        name="hojas"
                        className="w-full mt-3"
                        classNameInput="h-10"
                        register={register}
                        errors={errors}
                        placeholder="Cant. de hojas"
                        rules={{ required: "Ingrese la cantidad de hojas" }}
                    />
                </div>

                <button
                    className="w-full  bg-slate-600 text-white mt-1 flex items-center justify-center gap-2"
                    onClick={handleSubmit(onSubmit)}>
                    {isLoading ? <>Generando <Loader /></> : "Generar Kanban"}
                </button>
            </div>

            <div className="border p-2 mt-5 rounded-lg">
                <span className="underline text-xl">Imprimir reverso</span>

                <div className='flex gap-2 w-[100%] items-center justify-center'>

                    <InputUseForm
                        label="Cant. de hojas"
                        name="cantidad_reverso"
                        className="w-full"
                        register={register}
                        errors={errors}
                        placeholder="Cant. de hojas"
                        rules={{ required: "Ingrese la cantidad de hojas" }}
                    />

                    <button
                        className="w-full bg-slate-600 text-white mt-10 flex items-center justify-center gap-2"
                        onClick={() => printReverso()}>
                        Imprimi reverso
                    </button>
                </div>


            </div>

            {/* <KanbanPrint kanban={{
                codigo: "M240221203825818"
            }} /> */}

            <div className="" ref={componentRef}>
                {/* {Array.from(Array(pages).keys()).map((item, idx) => { */}
                {kanbans?.map((kanban, idx) => {
                    return <KanbanPrint kanban={kanban} key={idx} />
                    {/* } */ }
                }
                )}
            </div>

            <div className="" ref={componentRevRef}>
                {Array.from(Array(pages).keys()).map((item, idx) => {
                    return <KanbanReversoPrint key={idx} />
                })}
            </div>


        </div>

    )
}
