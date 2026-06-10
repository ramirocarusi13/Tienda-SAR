import SelectUseForm from "@components/SelectUseForm";
import { useForm } from "react-hook-form";
import { vaciaBufferLinea, getContenidoBuffer, quitarDeBuffer } from "../../services/ConfigService";
import { corrijeBuffer } from "@services/KanbanService"
import { useState } from "react";
import Loader from "@components/Loader"
import { Popconfirm } from "antd";
import { message } from "antd";

const lineas = [
    { label: 'M1', value: 1 },
    { label: 'M2', value: 2 },
    { label: 'M3', value: 3 },
    { label: 'M4', value: 4 },
    { label: 'M5', value: 5 },
    { label: 'M6', value: 6 },
    { label: 'M11', value: 11 },
]

export default function BufferConfigPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState(null)
    const { register, control, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm();
    const [kanbans, setKanbans] = useState([])
    const [kanbansBuffer, setKanbansBuffer] = useState([])

    const onSubmit = async (data) => {
        setIsLoading(true)
        const response = await vaciaBufferLinea(data?.linea)

        setStatus({
            error: response?.error,
            message: response.error ? response.message : 'Vaciado correctamente'
        })
        setIsLoading(false)

    }

    const quitar = async (kanban) => {
        const linea = getValues('linea')
        const data = await quitarDeBuffer(kanban)
        if (!data.error) {
            getKanbansBuffer(linea)
        }
    }

    const getKanbansBuffer = async (linea) => {
        setIsLoading(true)
        const data = await getContenidoBuffer(linea)
        if (!data.error) {
            setKanbans(data?.data)
        }
        setIsLoading(false)

    }

    const enviarKanbansBuffer = async () => {
        const linea = getValues("linea_c")

        if (linea == null || kanbansBuffer?.length == 0) {
            return
        }
        // console.log({ items: kanbansBuffer, linea: linea })
        const response = await corrijeBuffer({ items: kanbansBuffer, linea: linea })

        setStatus({
            error: response.error,
            message: response.message
        })

        setKanbansBuffer([])
    }

    return (
        <div>
            <div className='flex flex-col pb-10 border-b border-black'>
                <span className='text-xl font-semibold'>Corrección Buffer</span>

                <div className="flex items-center justify-start gap-4">
                    <SelectUseForm
                        label="Linea"
                        name="linea_c"
                        size="default"
                        placeholder="Seleccione una linea"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar una linea" }}
                        className="w-[150px]"
                        search={true}
                        control={control}
                        options={lineas}
                    />

                    <input
                        onKeyDown={(e) => {
                            if (e.key == 'Enter') {
                                if (!kanbansBuffer?.includes(e.target.value)) {
                                    setKanbansBuffer([...kanbansBuffer, e.target.value])
                                }
                                e.target.value = ''
                            }
                        }}
                        type="text"
                        placeholder="Escanear kanban"
                        className="mt-5 p-2 w-full rounded-md"
                    />

                    <button onClick={() => enviarKanbansBuffer()} className="mt-6 bg-green-500">Guardar</button>
                    <button onClick={() => setKanbansBuffer([])} className="mt-6 bg-red-500">Borrar</button>
                </div>

                <div className="flex flex-col gap-0">
                    <span className="font-bold text-2xl block border-b border-gray-600">{kanbansBuffer?.length} SETS</span>
                    {kanbansBuffer?.map((k, idx) => (
                        <span className="text-xl font-semibold" key={idx}>{k} <button
                            onClick={() => {
                                let temp = kanbansBuffer.filter(d => d != k)
                                setKanbansBuffer(temp)
                            }}
                            className="p-0 text-red-500 font-semibold">X</button></span>
                    ))}
                </div>
            </div>

            <div className='flex flex-col pt-2'>
                <span className='text-xl font-semibold'>Vaciado de buffer</span>

                <div className='flex items-start gap-2'>
                    <SelectUseForm
                        label="Linea"
                        name="linea"
                        size="default"
                        // loading={isLoadingMats}
                        placeholder="Seleccione una linea"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar una linea" }}
                        className="w-[100px]"
                        search={true}
                        control={control}
                        options={lineas}
                        onSelect={(val) => getKanbansBuffer(val)}
                    />

                    <button onClick={handleSubmit(onSubmit)} className="bg-green-500 mt-8 py-1 px-4">Vaciar</button>
                    {(!isLoading && status) && <span className={`mt-8 text-lg ml-5 font-semibold ${status.error ? 'text-red-500' : 'text-green-500'}`}>{status.message}</span>}
                </div>

                {isLoading && <Loader />}

                {!isLoading &&
                    <div className="flex flex-col items-start gap-2 mt-4">
                        {kanbans?.map((k, idx) => (
                            <div key={idx} className="flex items-center gap-5 border-b">
                                <span className="font-semibold text-lg">{k?.kanban?.modelo?.nombre} - {k?.kanban?.codigo}</span>
                                <Popconfirm
                                    title="Quitar de buffer"
                                    onConfirm={() => quitar(k?.kanban?.codigo)}
                                    description="¿Está seguro que desea quitar de buffer el kanban?"
                                    okText="Si"
                                    okButtonProps={{ className: 'bg-green-500' }}
                                    cancelText="No"
                                >
                                    <button className="text-red-500 p-0 bg-transparent border-none text-lg">Quitar</button>
                                </Popconfirm>
                            </div>
                        ))}
                    </div>
                }

                {!isLoading && kanbans?.length == 0 && <span className="font-semibold w-full block text-center">No hay kanbans en el buffer indicado</span>}
            </div>
        </div>
    )
}
