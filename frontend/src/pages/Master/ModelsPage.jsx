import InputUseForm from "@components/InputUseForm";
import KanbanPapaItems from "@components/KanbanPapaItems";
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import TablePartes from "@components/TablePartes";
import useModels from "@hooks/useModels";
import useTables from "@hooks/useTables";
import { Collapse, message } from 'antd';
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const lineasBuffer = [
    { name: '', value: null },
    { name: 'M1', value: 1 },
    { name: 'M2', value: 2 },
    { name: 'M3', value: 3 },
    { name: 'M4', value: 4 },
    { name: 'M5', value: 5 },
    { name: 'M6', value: 6 },
    { name: 'M7', value: 7 },
    { name: 'M8', value: 8 },
    { name: 'M9', value: 9 },
    { name: 'M10', value: 10 },
    { name: 'M11', value: 11 },
]

export default function ModelsPage() {
    const { register, control, handleSubmit, formState: { errors }, watch, setValue, getValues } = useForm();
    const { isLoading: isLoadingColores, response: colores } = useTables("colores", true)
    const { isLoading: isLoadingMateriales, response: materiales } = useTables("materiales", true)
    const { isLoading: isLoadingLineas, response: lineas } = useTables("lineas", true)
    const { isLoading: isLoadingFilas, response: filas } = useTables("filas", true)
    const { isLoading: isLoadingModels, response: models, getData, update, updateLines } = useModels()
    const [messageApi, contextHolder] = message.useMessage();

    const watchModelo = watch("modelo", '')

    const fetchModelo = async () => {
        const data = await getData(watchModelo, true)

        if (!data?.error) {

            setValue("hr", data?.data?.hr)
            setValue("descripcion", data?.data?.descripcion)
            setValue("ar", data?.data?.ar)
            setValue("codigo", data?.data?.codigo)
            setValue("nombre", data?.data?.nombre)
            setValue("ctrhr", data?.data?.ctrhr)
            setValue("cantidad", data?.data?.cantidad)
            setValue("color_id", parseInt(data?.data?.color_id))
            setValue("material_id", parseInt(data?.data?.material_id))
            setValue("minimo_buffer", parseInt(data?.data?.minimo_buffer || 0))
            setValue("maximo_buffer", parseInt(data?.data?.maximo_buffer || 0))
            setValue("volumen", parseInt(data?.data?.volumen || 0))
            setValue("revision", data?.data?.revision || "")
            setValue("fila_id", parseInt(data?.data?.fila_id))
            setValue("activo", parseInt(data?.data?.activo) == 1 ? true : false)
            setValue("linea_buffer", data?.data?.linea_buffer)

            data?.data?.lineas?.map(l => {
                setValue(`linea${l.id}`, true)
            })
        }
    }

    useEffect(() => {
        if (watchModelo) {
            fetchModelo()
        }
    }, [watchModelo])

    const onSubmit = async (data) => {
        update(data.modelo, data, (res) => {
            if (res.error) {
                message.error(res.message)
            } else {
                message.success("Actualizado correctamente")
            }
        })
    }

    const ItemCheckbox = ({ name, label }) => {
        return <div className="text-xs gap-1 items-center flex">
            <input className="p-2 w-4" {...register(name)} type="checkbox" id={name} value="" />
            <label htmlFor={name} className='text-base'>{label}</label>
        </div>
    }

    const setLinesModel = () => {

        const lines = []

        lineas.map(l => {
            lines.push({ id: l.id, value: getValues(`linea${l.id}`) })
        })

        updateLines(watchModelo, lines, (res) => {
            if (res.error) {
                message.error(res.message)
            } else {
                message.success("Actualizado correctamente")
            }
        })
    }

    return (
        <div className="">
            {contextHolder}

            <div className="flex items-center gap-2">
                <SelectUseForm
                    label="Modelo"
                    name="modelo"
                    placeholder="Seleccione un modelo"
                    classNameInput="dark:bg-white dark:text-black"
                    register={register}
                    classNameLabel="dark:text-black"
                    errors={errors}
                    rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full "
                    loading={isLoadingModels}
                    search={true}
                    control={control}
                    onSelect={() => {

                    }}
                    options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                />

                <button className="bg-red-500 mt-11" onClick={() => setValue("modelo", null)}>Cancelar</button>
            </div>


            {!watchModelo && <div className="flex items-center justify-center py-4"><span className="text-xl font-semibold">Seleccione un modelo para comenzar</span></div>}
            <div className={`flex w-full flex-col ${!watchModelo && 'hidden'}`}>

                <Collapse className="mb-2 mt-4 flex flex-col gap-1">
                    <Collapse.Panel className="bg-slate-200" header="Datos del modelo">
                        {isLoadingModels && watchModelo && <div className="flex items-center justify-center"><Loader /></div>}
                        {!isLoadingModels && watchModelo &&
                            <>
                                <div>
                                    <div className="text-xs gap-1 items-center flex">
                                        <input className="p-2 w-4" {...register("activo")} type="checkbox" id="activo" value="" />
                                        <label htmlFor="activo" className='text-base'>Activo</label>
                                    </div>
                                </div>

                                <div className="flex gap-2 items-center">

                                    <InputUseForm
                                        name="codigo"
                                        label="Código"
                                        className="w-[400px]"
                                        register={register}
                                        classNameInput='!bg-white'
                                        errors={errors}
                                        placeholder="Código"
                                        rules={{ required: "" }}
                                    />

                                    <InputUseForm
                                        name="nombre"
                                        label="Nombre"
                                        className="w-[200px]"
                                        register={register}
                                        classNameInput='!bg-white'
                                        errors={errors}
                                        placeholder="Nombre"
                                        rules={{ required: "" }}
                                    />

                                    <InputUseForm
                                        name="descripcion"
                                        label="Descripción"
                                        className="w-full"
                                        classNameInput='!bg-white'
                                        register={register}
                                        errors={errors}
                                        placeholder="Descripción"
                                        rules={{ required: "" }}
                                    />

                                    <button
                                        onClick={handleSubmit(onSubmit)}
                                        className="text-xs bg-success mt-7 text-white">Actualizar</button>
                                </div>

                                <div className="flex items-center gap-2">

                                    <InputUseForm
                                        name="hr"
                                        label="HR"
                                        className="w-full"
                                        classNameInput='!bg-white'
                                        register={register}
                                        errors={errors}
                                        placeholder="HR"
                                    />

                                    <InputUseForm
                                        name="ctrhr"
                                        label="CTRHR"
                                        className="w-full"
                                        classNameInput='!bg-white'
                                        register={register}
                                        errors={errors}
                                        placeholder="CTRHR"
                                    />

                                    <InputUseForm
                                        name="ar"
                                        label="AR"
                                        className="w-full"
                                        register={register}
                                        classNameInput='!bg-white'
                                        errors={errors}
                                        placeholder="AR"
                                    />

                                    <InputUseForm
                                        name="cantidad"
                                        label="Cantidad Sets"
                                        className="w-full"
                                        register={register}
                                        classNameInput='!bg-white'
                                        errors={errors}
                                        type="number"
                                        placeholder="Cantidad Sets"
                                    />
                                </div>

                                <div className="flex gap-2 items-center">

                                    <SelectUseForm
                                        label="Color"
                                        name="color_id"
                                        placeholder="Seleccione un color"
                                        register={register}
                                        errors={errors}
                                        className="w-full "
                                        size="small"
                                        loading={isLoadingColores}
                                        search={true}
                                        control={control}
                                        options={colores.map(color => { return { value: color.id, label: color.color } })}
                                    />

                                    <SelectUseForm
                                        label="Material"
                                        name="material_id"
                                        placeholder="Seleccione un material"
                                        register={register}
                                        errors={errors}
                                        className="w-full "
                                        loading={isLoadingMateriales}
                                        size="small"
                                        search={true}
                                        control={control}
                                        options={materiales.map(mat => { return { value: mat.id, label: mat.material } })}
                                    />

                                    <SelectUseForm
                                        label="Fila"
                                        name="fila_id"
                                        placeholder="Seleccione una fila"
                                        register={register}
                                        errors={errors}
                                        size="small"
                                        className="w-full"
                                        loading={isLoadingFilas}
                                        search={true}
                                        control={control}
                                        options={filas.map(fila => { return { value: fila.id, label: fila.fila } })}
                                    />
                                </div>

                                <span className="text-lg pb-2 font-semibold block w-full border-b mt-3">Datos de corte</span>

                                <div className="flex gap-2 items-center">

                                    <InputUseForm
                                        name="revision"
                                        label="Revisión Nro"
                                        className="w-full"
                                        classNameInput='!bg-white'
                                        register={register}
                                        errors={errors}
                                        placeholder="Revisión"
                                        type="number"
                                    />

                                    <InputUseForm
                                        type="number"
                                        name="volumen"
                                        label="Volumen"
                                        className="w-full"
                                        classNameInput='!bg-white'
                                        register={register}
                                        errors={errors}
                                        placeholder="Volumen"
                                    />
                                </div>

                                <SelectUseForm
                                    label="Linea Buffer"
                                    name="linea_buffer"
                                    placeholder="Seleccione una línea"
                                    classNameInput="dark:bg-white dark:text-black"
                                    register={register}
                                    classNameLabel="dark:text-black"
                                    errors={errors}
                                    rules={{ required: "Debe seleccionar la línea" }}
                                    className="w-full "
                                    loading={isLoadingModels}
                                    search={true}
                                    control={control}
                                    onSelect={() => {

                                    }}
                                    options={lineasBuffer.map((linea) => { return { value: linea.value, label: linea.name } })}
                                />

                                {/* <span className="text-lg pb-2 font-semibold block w-full border-b mt-3">Datos buffer</span>

                                <div className="flex gap-2 items-center">

                                    <InputUseForm
                                        name="minimo_buffer"
                                        label="Minimo"
                                        className="w-full"
                                        register={register}
                                        errors={errors}
                                        placeholder="Minimo"
                                        type="number"
                                    />

                                    <InputUseForm
                                        name="maximo_buffer"
                                        label="Máximo"
                                        className="w-full"
                                        register={register}
                                        errors={errors}
                                        placeholder="Máximo"
                                        type="number"
                                    />
                                </div> */}
                            </>
                        }
                    </Collapse.Panel>

                    <Collapse.Panel className="bg-slate-200" header="Fundas y piezas">
                        {watchModelo && <TablePartes modelId={watchModelo} />}
                    </Collapse.Panel>

                    <Collapse.Panel className="bg-slate-200" header="Lineas de producción">
                        {isLoadingLineas && watchModelo && <Loader />}
                        {!isLoadingLineas && watchModelo &&
                            <div>
                                <span className="bg-yellow-300 p-2 mb-2 block">Lineas en donde se ensambla el modelo</span>
                                <div className="w-1/2 grid grid-cols-3">
                                    {lineas?.map((l, idx) => (
                                        <ItemCheckbox name={`linea${l.id}`} label={l.codigo} key={idx} />
                                    ))}
                                </div>

                                <button onClick={() => setLinesModel()} className="bg-green-500 mt-4 px-4 py-1 text-xs text-white">Actualizar</button>
                            </div>
                        }
                    </Collapse.Panel>

                    <Collapse.Panel className="bg-slate-200" header="Dados corte">
                        {watchModelo && <KanbanPapaItems modelId={watchModelo} />}
                    </Collapse.Panel>
                </Collapse>


            </div>

        </div >
    )
}
