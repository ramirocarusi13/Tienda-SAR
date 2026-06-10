import InputUseForm from "@components/InputUseForm";
import SelectUseForm from "@components/SelectUseForm";
import { reporteStock } from "@services/StockService";
import { formatDateTime } from "@utils/Utils";
import { Badge } from "antd";
import { Tag } from "antd";
import { Table } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import useModels from "@hooks/useModels";

export default function ReporteStockPage() {
    const { register, control, handleSubmit, formState: { errors }, getValues, setFocus, setValue } = useForm();
    const { isLoading: isLoadingModels, response: models, getData, update, updateLines } = useModels()

    const [dataSource, setDataSource] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [infoDeposito, setInfoDeposito] = useState(null)

    const onSubmit = async (data) => {
        setIsLoading(true)
        setInfoDeposito(null)
        const res = await reporteStock({ deposito: data?.deposito, ubicacion: data?.ubicacion, modelo: data?.modelo })

        // console.log(res?.data?.depositoInfo)

        const info = res?.data?.depositoInfo
        info.capacidad = 100 - Math.ceil((info?.ubicaciones_ocupadas_count * 100) / info?.ubicaciones_count)

        if (info?.ubicaciones_count == 1) {
            info.capacidad = "-"
            info.capacidadStatus = 'text-green-600'
            info.posiciones = "ÚNICA"
        } else {
            if (info.capacidad > 50) {
                info.capacidadStatus = 'text-green-600'
            } else if (info.capacidad > 30) {
                info.capacidadStatus = 'text-orange-500'
            } else {
                info.capacidadStatus = 'text-red-500'
            }
            if (info?.ubicaciones_count > 0) {
                info.posiciones = `${info?.ubicaciones_count - info?.ubicaciones_ocupadas_count}/${info?.ubicaciones_count}`
            } else {
                info.posiciones = '-/-'
            }
        }

        setDataSource(res?.data?.stock)
        setInfoDeposito(info)
        setIsLoading(false)
    }

    return (
        <div className="">
            <div className=" flex items-center gap-2">
                <SelectUseForm
                    classNameLabel="!mt-0"
                    label="Deposito"
                    name="deposito"
                    // size="large"
                    placeholder="Seleccione un deposito"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el deposito" }}
                    className="w-full"
                    search={true}
                    control={control}
                    options={[{ value: 8, label: 'RACKS' }, { value: 9, label: 'DOLLYS' }, { value: 10, label: 'TEMPO A' }, { value: 11, label: 'TEMPO B' }]}
                />

                <InputUseForm
                    classNameLabel="!mt-0"
                    control={control}
                    // type="number"
                    label="Ubicación"
                    // rules={{ required: "Debe ingresar la posición" }}
                    name="ubicacion"
                    className="w-full "
                    register={register}
                    size="large"
                    errors={errors}
                    placeholder="Posición"
                />

                <SelectUseForm
                    label="Modelo"
                    classNameLabel="!mt-0"
                    name="modelo"
                    placeholder="Seleccione un modelo"
                    register={register}
                    errors={errors}
                    // rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full "
                    loading={isLoadingModels}
                    search={true}
                    control={control}
                    onSelect={() => {

                    }}
                    options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                />

                <button onClick={handleSubmit(onSubmit)} className="mt-6 px-10 bg-blue-600 text-sm text-white">Buscar</button>
            </div>

            <div className="w-full">
                {!isLoading && infoDeposito &&
                    <div className="w-full flex items-center gap-2 mb-2">
                        <div className="w-[200px] text-center rounded-sm flex flex-col  border-gray-600 border">
                            <span className="bg-blue-950 text-white text-lg font-semibold py-1">CAPACIDAD</span>
                            <span className={`text-5xl font-bold py-1 ${infoDeposito?.capacidadStatus}`}>{infoDeposito?.capacidad}%</span>
                        </div>
                        <div className="min-w-[200px] text-center rounded-sm flex flex-col border-gray-600 border">
                            <span className="bg-blue-950 text-white text-lg font-semibold py-1 px-2">POSICIONES LIBRES</span>
                            <span className="text-5xl font-bold py-1">{infoDeposito?.posiciones}</span>
                        </div>
                        {getValues("modelo") != '' &&
                            <div className="min-w-[200px] text-center rounded-sm flex flex-col border-gray-600 border">
                                <span className="bg-blue-950 text-white text-lg font-semibold py-1 px-2">EXISTENCIAS MODELO</span>
                                <span className="text-5xl font-bold py-1">{dataSource?.length}</span>
                            </div>
                        }
                    </div>
                }

                <Table
                    loading={isLoading}
                    size="small"
                    rowClassName={(r, idx) => {
                        if (idx % 2 == 0) {
                            return 'bg-gray-200'
                        }
                    }}
                    expandable={{
                        expandedRowRender: (record) => {
                            const columns = [
                                {
                                    title: 'Nombre',
                                    dataIndex: 'nombre',
                                    key: 'nombre',
                                },
                                {
                                    title: 'Referencia',
                                    dataIndex: 'contenido',
                                    key: 'contenido',
                                },
                                {
                                    title: 'Lote',
                                    dataIndex: 'lote',
                                    key: 'lote',
                                },
                            ];

                            return <Table size="small" columns={columns} dataSource={record?.ocupacion?.cont} pagination={false} />
                        },
                        defaultExpandedRowKeys: ['0'],
                    }}

                    rowKey={r => r.id}
                    dataSource={dataSource}
                    columns={[
                        {
                            dataIndex: 'deposito',
                            title: 'Deposito',
                            render: (_, record) => record?.deposito?.descripcion?.toUpperCase()
                        },
                        {
                            dataIndex: 'posicion',
                            title: 'Posición',
                            render: (_, record) => record?.nombre
                        },
                        {
                            dataIndex: 'ingreso',
                            title: 'Ingreso',
                            render: (_, record) => formatDateTime(record?.ocupacion?.ingreso)
                        },
                        {
                            dataIndex: 'contenido',
                            title: 'Contenido',
                            // render: (_, record) => record?.cont[0]?.detalle
                            render: (_, r) => {
                                if (r?.ocupacion?.contenido == 'KANBAN') {
                                    return <Tag color="green">{r?.ocupacion?.contenido} - {r?.ocupacion?.cont[0]?.nombre}</Tag>
                                } else {
                                    return <Tag color="blue">{r?.ocupacion?.contenido}</Tag>
                                }
                            }
                        }
                    ]}
                    pagination={{
                        pageSize: 20,
                        showSizeChanger: false,
                    }}
                />
            </div>
        </div>
    )
}
