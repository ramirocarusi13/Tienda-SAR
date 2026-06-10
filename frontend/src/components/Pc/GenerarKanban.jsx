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
import { Collapse } from "antd";

export default function GenerarKanban({ setReload }) {
    const { register, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ defaultValues: { cantidad_reverso: "1", hojas: "1" } });
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
                    setReload(true)
                    handlePrint()
                }, [200])
            }
        }, true)
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
    }, [])

    return (
        <Collapse
            className="w-full bg-orange-300 hover:opacity-90"
            items={
                [{
                    key: '1',
                    label: <span className="font-semibold">GENERAR KANBAN</span>,
                    children:

                        <div className="">
                            <div className="">
                                {/* <span className="underline text-lg">Kanban productivo</span> */}
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

                                    {/* <InputUseForm
                                        label="Cant. de hojas"
                                        name="hojas"
                                        className="w-full"
                                        register={register}
                                        errors={errors}
                                        placeholder="Cant. de hojas"
                                        rules={{ required: "Ingrese la cantidad de hojas" }}
                                    /> */}


                                </div>

                                <button
                                    className="w-full bg-slate-600 text-white hover:opacity-90 mt-1 flex items-center justify-center gap-2"
                                    onClick={handleSubmit(onSubmit)}>
                                    {isLoading ? <>Generando <Loader /></> : "Generar Kanban"}
                                </button>
                            </div>

                            <div className="border p-2 mt-5 rounded-lg">
                                <span className="underline text-lg ">Imprimir reverso</span>

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
                                        className="w-full bg-slate-600 hover:opacity-90 text-white mt-7 h-[30px] flex items-center justify-center gap-2"
                                        onClick={() => printReverso()}>
                                        Imprimi reverso
                                    </button>
                                </div>


                            </div>

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
                }]
            }
        // defaultActiveKey={['1']}
        />

    )

}
