import useTables from "@hooks/useTables"
import { Table } from "antd"
import InputUseForm from "@components/InputUseForm";
import { useForm } from "react-hook-form";

export default function LineasPage() {

    const { response, isLoading, saveTable, getData } = useTables("lineas", true)
    const { register, control, handleSubmit, formState: { errors }, setValue, reset } = useForm({ defaultValues: { codigo: '', id: null, capacidad: '', posicion: '', columnas: '' } });


    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo'
        },
        {
            title: 'Capacidad',
            dataIndex: 'capacidad'
        },
        {
            title: 'Posición en Lay-Out',
            dataIndex: 'posicion'
        },
        {
            title: 'Columnas Lay-Out',
            dataIndex: 'columnas'
        },
        {
            title: 'Acciones',
            render: (_, record) => {
                return <button
                    onClick={() => {
                        setValue("codigo", record.codigo)
                        setValue("id", record.id)
                        setValue("capacidad", record.capacidad)
                        setValue("posicion", record.posicion)
                        setValue("columnas", record.columnas)
                    }}
                    className="text-xs bg-blue-500 text-white">Editar</button>
            }
        }
    ]

    const onSubmit = async (data) => {

        saveTable(data, (res) => {
            if (!res.error) {
                reset()
                getData()
            }
        })
    }

    return (
        <div className="flex items-start gap-4">
            <div className="w-full">
                <Table
                    dataSource={response}
                    columns={columns}
                    loading={isLoading}
                    rowKey={(row) => row.id}
                    size="small"
                    pagination={false}
                />
            </div>

            <div className="flex flex-col items-start justify-start w-full max-w-[30%] px-2">
                <InputUseForm
                    name="codigo"
                    className="w-full"
                    register={register}
                    errors={errors}
                    label="Código"
                    placeholder="Código"
                    rules={{ required: "El código es requerido" }}
                />

                <InputUseForm
                    label="Capacidad"
                    name="capacidad"
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Capacidad de carros"
                    rules={{ required: "La capacidad de carros es requerida" }}
                />

                <InputUseForm
                    name="posicion"
                    label="Posición en Lay-Out"
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Posición en Lay-Out"
                    rules={{ required: "La posición en Lay-Out es requerida" }}
                />

                <InputUseForm
                    label="Columnas en Lay-Out"
                    name="columnas"
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Columnas en Lay-Out"
                    rules={{ required: "La cantidad de columnas es requerida" }}
                />

                <button onClick={handleSubmit(onSubmit)} className="w-full bg-success mt-4 text-white">Grabar</button>
            </div>
        </div>
    )
}
