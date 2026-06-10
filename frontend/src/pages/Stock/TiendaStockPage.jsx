import Loader from "@components/Loader";
import ModalEditPiezaTienda from "@components/ModalEditPiezaTienda";
import SelectUseForm from "@components/SelectUseForm";
import useModels from "@hooks/useModels";
import useStockPiezas from '@hooks/useStockPiezas';
import { Badge } from "antd";
import { Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaFilePdf } from "react-icons/fa";
import { Link } from "react-router-dom";
// import { getFileKanbansReposicion } from "@services/PiezaService"

const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;
const VITE_API_URI = import.meta.env.VITE_API_URI;

const screenHeight = window.screen.height;

export default function TiendaStockPage() {
    const { isLoading: isLoadingStock, response: stock, getDataStockTienda: fetchStock } = useStockPiezas()
    const { register, control, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({ defaultValues: { cantidad_reverso: "1", hojas: "1" } });
    const { isLoading: isLoadingModels, response: models, getData, update } = useModels()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editId, setEditId] = useState(null)
    const [dataFiltered, setDataFiltered] = useState([])
    const [originalData, setOriginalData] = useState([])

    const watchModelo = watch("modelo", '')
    const watchPieza = watch("pieza", null)

    const columns = [
        {
            title: 'Modelo',
            dataIndex: 'modelo',
            key: 'modelo',
            className: 'min-w-[50px]',
            render: (_, record) => record?.parte?.modelo[0]?.nombre
        },
        {
            title: 'Pieza',
            dataIndex: 'pieza',
            key: 'pieza',
            render: (_, record) => record?.codigo
        },
        {
            title: 'Mín.',
            dataIndex: 'minimo',
            key: 'minimo',
            className: 'min-w-[40px]',
            render: (_, record) => record?.minimo
        },
        {
            title: 'Máx.',
            dataIndex: 'maximo',
            key: 'maximo',
            className: 'min-w-[40px]',
            render: (_, record) => record?.maximo
        },
        {
            title: 'Optimo',
            dataIndex: 'optimo',
            key: 'optimo',
            className: 'min-w-[50px]',
            render: (_, record) => record?.pto_optimo
        },
        {
            title: 'Rep.',
            className: 'min-w-[40px]',
            dataIndex: 'reposicion',
            key: 'reposicion',
            render: (_, record) => {
                const val = record?.maximo - parseInt(record?.stock_tienda_sum_cantidad || 0)

                if (val <= 0) {
                    return 0
                }
                return val
            }
        },
        {
            title: 'Stock',
            dataIndex: 'stock_tienda_sum_cantidad',
            key: 'stock_tienda_sum_cantidad',
            className: 'min-w-[40px]',
            render: (text) => {
                if (!text) {
                    return 0
                } else {
                    return text
                }
            }
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            key: 'estado',
            render: (_, record) => {
                // if (record?.codigo == "1977" && record.parte.modelo[0].nombre == 'SFLC') {
                //     console.log(record)
                // }
                if (record?.kanban_reemplazo?.abierto) {
                    return <Tag color={"#1677ff"}>En Corte</Tag>
                }

                //TODO REVISAR
                let reposicion = record?.maximo - parseInt(record?.stock_tienda_sum_cantidad || 0)

                if (parseInt(record?.stock_tienda_sum_cantidad || 0) < record?.minimo) {
                    if (reposicion < record?.pto_optimo || parseInt(record?.pto_optimo || 0) == 0) {
                        return <Tag className="!text-xs" color={"#ef4444"}>Crítico</Tag>
                    }
                    return <Tag className="!text-xs" color={"#E89831"}>Listo para corte</Tag>
                    // return <Tag color={"#E89831"} bordered>Listo para corte</Tag>
                } else if (record?.stock_tienda_sum_cantidad >= record?.maximo) {
                    return <Tag className="!text-xs" color={"#10b981"}>Correcto</Tag>
                } else {
                    return <Tag className="!text-xs" color={"#E8DD31"}>Normal</Tag>
                }
            }
        },
        {
            title: 'Mat. Código',
            dataIndex: 'material_codigo',
            key: 'material_codigo',
            render: (_, record) => {
                return <span className="text-xs">{record?.material_pieza?.codigo}</span>
            }
        },
        // {
        //     title: 'Mat. Cod. Int.',
        //     dataIndex: 'material',
        //     key: 'material',
        //     render: (_, record) => record?.material_pieza?.material?.codigo_interno
        // },
        {
            title: 'Material',
            dataIndex: 'material_nombre',
            key: 'material_nombre',
            render: (_, record) => {
                // console.log(record)
                return <span className="text-xs">{record?.material_pieza?.nombre}</span>
            }
        },
        // {
        //     title: 'Color',
        //     dataIndex: 'material_color',
        //     key: 'material_color',
        //     render: (_, record) => record?.material_pieza?.material?.color
        // },
        {
            title: 'Rep.',
            dataIndex: 'rep',
            key: 'rep',
            className: 'min-w-[40px]',
            render: (_, record) => {

                // if (record?.kanban_reemplazo?.abierto) {
                const val = record?.maximo - parseInt(record?.stock_tienda_sum_cantidad || 0)
                if (val <= 0) {
                    return ""
                }

                if (record?.kanban_reposicion) {

                    // console.log(record)

                    let capas = 1;
                    if (record?.pto_optimo <= 0) {
                        capas = 1
                    }
                    let reposicion = record?.maximo - parseInt(record?.stock_tienda_sum_cantidad || 0)

                    if (reposicion < record?.pto_optimo || parseInt(record?.pto_optimo || 0) == 0) {
                        capas = 1
                    }

                    capas = Math.ceil(reposicion / record?.pto_optimo)
                    if (capas == 0) {
                        capas = 1
                    }

                    return <Link target="_blank" to={`${PUBLIC_URI}api/pieza/getFileReposicion/${record.id}/${record?.parte?.modelo[0]?.nombre}/${record?.kanban_reposicion}/${capas}`} className="bg-transparent m-0 p-0"><FaFilePdf className="text-main" /></Link>

                    // return <Link target="_blank" to={`${PUBLIC_URI}kanban_reposicion/${record?.parte?.modelo[0]?.nombre}/${record?.kanban_reposicion}`} className="bg-transparent m-0 p-0"><FaFilePdf className="text-main" /></Link>
                }
            }
        },
        {
            title: '',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (_, record) => {
                return <button onClick={() => {
                    setEditId(record.id)
                    setIsModalOpen(true)
                }} className="text-xs px-1 m-0">Editar</button>
            }
        }
    ];

    const fetchData = async () => {
        const data = await fetchStock({ modelo: watchModelo }, true)
        // console.log(data)
        setDataFiltered(data?.data)
        setOriginalData(data?.data)
        // console.log(data?.data)
    }

    useEffect(() => {
        // fetchStock({ modelo: watchModelo })
        fetchData()
    }, [watchModelo])

    const filterData = () => {
        let temp = originalData
        if (watchPieza) {
            temp = temp?.filter(t => t?.id == watchPieza)
        }

        // console.log(temp, watchPieza)
        setDataFiltered(temp)
    }

    useEffect(() => {
        filterData()
    }, [watchPieza])

    return (
        <div>
            {/* <Link target="_blank" to={`${VITE_API_URI}tienda/verificarPiezasReemplazoTienda`} className="text-sm p-2 rounded-md block mb-1 w-[250px] text-center text-white bg-[#E89831] hover:text-white hover:opacity-80">Generar Kanbans listos para corte</Link> */}
            <div className="px-2 bg-white flex items-end rounded-lg gap-2">
                <SelectUseForm
                    label="Modelo"
                    name="modelo"
                    placeholder="Seleccione un modelo"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full "
                    loading={isLoadingModels}
                    onClear={() => {
                        setValue("pieza", null)
                    }}
                    search={true}
                    control={control}
                    options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                />

                <SelectUseForm
                    label="Pieza"
                    name="pieza"
                    placeholder="Seleccione una pieza"
                    register={register}
                    errors={errors}
                    // rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full "
                    loading={isLoadingModels}
                    search={true}
                    onClear={() => filterData()}
                    control={control}
                    options={dataFiltered?.map((s) => { return { value: s.id, label: s.codigo } })}
                />
            </div>

            <Table
                // bordered={false}
                tableLayout="auto"
                footer={() => {
                    return <div className="flex flex-row items-start gap-4">
                        <div className="flex items-center gap-1"><div className="bg-[#ef4444] w-5 h-5"></div><span className="font-semibold text-xs">Crítico</span></div>
                        <div className="flex items-center gap-1"><div className="bg-[#E89831] w-5 h-5"></div><span className="font-semibold text-xs">Listo para corte</span></div>
                        <div className="flex items-center gap-1"><div className="bg-[#E8DD31] w-5 h-5"></div><span className="font-semibold text-xs">Stock entre mínimo y máximo</span></div>
                        <div className="flex items-center gap-1"><div className="bg-[#10b981] w-5 h-5"></div><span className="font-semibold text-xs">Stock mayor o igual al máximo</span></div>
                        <div className="flex items-center gap-1"><div className="bg-[#1677ff] w-5 h-5"></div><span className="font-semibold text-xs">En corte / Kanban generado</span></div>
                    </div>
                }}
                size="small"
                locale={{
                    emptyText: "No se encontraron registros",
                }}
                className="w-full mt-1"
                rowClassName="text-xs"
                pagination={{
                    pageSize: 200,
                    showSizeChanger: false
                }}
                bordered={true}
                columns={columns}
                dataSource={dataFiltered}
                // dataSource={stock?.data}
                loading={{
                    indicator: <Loader />,
                    spinning: isLoadingStock
                }}
                rowKey={(item) => Math.random()}
            />

            <ModalEditPiezaTienda
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                editId={editId}
                onSaved={fetchData}
            />
        </div>
    )
}
