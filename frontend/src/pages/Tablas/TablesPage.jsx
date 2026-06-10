import SelectUseForm from "@components/SelectUseForm";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useTables from "@hooks/useTables"
import InputUseForm from "../../components/InputUseForm";
import { useEffect } from "react";
import Loader from "@components/Loader"
import { Table } from "antd";

const tables = [
    {
        label: "Colores",
        value: "colores"
    },
    {
        label: "Tipo Materiales",
        value: "materiales"
    },
    {
        label: "Filas",
        value: "filas"
    }
]

export default function TablesPage() {
    const [tipoTabla, setTipoTabla] = useState(null)
    const [recordEdit, setRecordEdit] = useState(null)
    const { register, control, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({ defaultValues: { cantidad_reverso: "1", hojas: "1" } });

    const { isLoading, response, fetchTable, saveStandardTable, deleteTable } = useTables(null, false)


    const watchTabla = watch("tabla", '')

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id'
        },
        {
            title: 'Nombre',
            key: 'nombre',
            dataIndex: 'nombre'
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => {
                return <div className="flex items-center">
                    <button className="text-xs bg-transparent text-blue-700" onClick={() => {
                        setRecordEdit(record)
                        setValue("nombre", record.nombre)
                    }}>Modificar</button>

                    <button
                        onClick={() => {
                            onDelete(record)
                        }}
                        className="text-xs bg-transparent text-red-700">Eliminar</button>
                </div>
            }
        }
    ]

    useEffect(() => {
        if (watchTabla || tipoTabla) {
            setRecordEdit(null)
            setTipoTabla(watchTabla)
            setTimeout(() => {
                fetchTable(watchTabla)
            }, [50])
        }
    }, [watchTabla, tipoTabla])

    const saveTable = async () => {

        const data = {
            id: recordEdit.id,
            table: tipoTabla,
            nombre: getValues("nombre")
        }

        saveStandardTable(data, (response) => {
            if (!response.error) {
                setRecordEdit(null)
                setValue("nombre", "")
                fetchTable(watchTabla)
            }
        })

    }


    const onDelete = async (record) => {

        const passwordDelete = "2024S@R"

        const res = confirm("La eliminación del dato puede afectar a otras tablas. Este cambio no se puede revertir. ¿Está seguro que desea eliminar el dato?")
        // console.log(res)

        if (!res) {
            return
        }

        const password = prompt("Ingrese la contraseña para eliminar", "")
        if (!password || (password != passwordDelete) || password == "") {
            alert("Acceso denegado")
            return
        }

        const data = {
            id: record.id,
            table: tipoTabla
        }

        // console.log(data)

        // console.log("ELIMINO")
        deleteTable(data, (response) => {
            if (!response.error) {
                setRecordEdit(null)
                setValue("nombre", "")
                fetchTable(watchTabla)
            }
        })
    }


    return (
        <div>

            <div>
                <SelectUseForm
                    label="Tabla"
                    name="tabla"
                    placeholder="Seleccione una tabla"
                    register={register}
                    errors={errors}
                    // rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full "
                    search={true}
                    // loading={isLoadingModels}
                    control={control}
                    options={tables}
                />

                {isLoading && <div className="min-h-[80vh] w-full flex items-center justify-center"><Loader /></div>}

                {tipoTabla && !isLoading &&
                    <div className="w-full mt-4 flex items-start justify-between">
                        <div className="w-[60%]">

                            <button
                                onClick={() => {
                                    setValue("nombre", "")
                                    setRecordEdit({ id: null, nombre: "" })
                                }}
                                className="bg-success text-white text-sm mb-2">Nuevo +</button>

                            <Table
                                className="w-full"
                                loading={isLoading}
                                dataSource={response}
                                columns={columns}
                                size="small"
                                pagination={false}
                                rowKey={(row) => row.id}
                            />
                        </div>
                        {recordEdit &&
                            <div className="w-full">
                                <InputUseForm
                                    label="Nombre"
                                    name="nombre"
                                    className="w-full"
                                    register={register}
                                    errors={errors}
                                    placeholder="Nombre"
                                    rules={{ required: "Ingrese el nombre" }}
                                />

                                <div className="flex items-center w-full gap-2 justify-end">
                                    <button className="text-sm bg-success" onClick={() => saveTable()}>Guardar</button>
                                    {/* {recordEdit.id && <button className="text-sm bg-red-500">Eliminar</button>} */}
                                </div>

                            </div>
                        }
                    </div>
                }
            </div>

        </div>
    )
}
