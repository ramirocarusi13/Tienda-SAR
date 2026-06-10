import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { filterStockLogistica } from "@services/StockService";
import { Table } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";

const columns = [
    {
        title: 'Orden',
        dataIndex: 'orden',
        key: 'orden',
    },
    {
        title: 'Código',
        dataIndex: 'codigo',
        key: 'codigo',
    },
    {
        title: 'Descripción',
        dataIndex: 'nombre',
        key: 'nombre',
    },
    {
        title: 'Color',
        dataIndex: 'color',
        key: 'color',
    },
    {
        title: 'SubTotal KG',
        dataIndex: 'inventario_sum_cantidad',
        key: 'inventario_sum_cantidad',
        align: "right",
        render: (text) => {
            return text ? parseFloat(text).toFixed(2) : 0
        }
    },
    {
        title: 'Densidad',
        dataIndex: 'densidad',
        key: 'densidad',
        align: "right",
        render: (text) => parseFloat(text).toFixed(2)
    },
    {
        title: 'Total M2',
        dataIndex: 'm2',
        key: 'm2',
        align: "right",
        render: (_, record) => {
            if (parseFloat(record.densidad) > 0 && parseFloat(record.inventario_sum_cantidad) >= 0) {
                return (parseFloat(record.inventario_sum_cantidad) / parseFloat(record.densidad)).toFixed(3)
            } else {
                return 0
            }
        }
    },
    {
        title: 'Ancho',
        dataIndex: 'ancho',
        align: "right",
        key: 'ancho',
        render: (text) => parseFloat(text).toFixed(2)
    },
    {
        title: 'Total ML',
        dataIndex: 'ml',
        align: "right",
        key: 'ml',
        render: (_, record) => {
            let m2;
            if (parseFloat(record.densidad) > 0 && parseFloat(record.inventario_sum_cantidad) >= 0) {
                m2 = (parseFloat(record.inventario_sum_cantidad) / parseFloat(record.densidad)).toFixed(3)
            } else {
                m2 = 0
            }

            if (m2 > 0) {
                if (parseFloat(record.ancho) > 0) {
                    return (m2 / parseFloat(record.ancho)).toFixed(2)
                } else {
                    return 0
                }
            } else {
                return 0
            }
        }
    },
];

const getDataRun = (data, run) => {
    const res = data.filter(d => parseInt(d.run) == run)
    return res
}

const drawRun = (data, run) => {
    const dataRun = getDataRun(data, run)

    return <div key={`RUN${run}`} className="border-2 border-black w-full p-2">
        <span className="text-lg font-semibold mb-4 block border-b px-2">RUN {run} ({dataRun?.length})</span>

        <div className="flex flex-col gap-2">
            {dataRun.map((dato, idx) => (
                <div key={`2${idx}`} className={`w-full flex justify-between px-2 ${parseInt(dato.cuarentena) == 1 && "bg-yellow-300"} ${parseInt(dato.rechazado) == 1 && "bg-red-500"}`}>
                    <div><span className="font-semibold">KANBAN</span> : {dato.codigo_kanban}</div>
                    <div><span className="font-semibold">MODELO</span> : {dato.modelo}</div>
                    {parseInt(dato?.rechazado) == 1 ?
                        <div><span className="font-semibold">RECHAZADO</span></div>
                        : parseInt(dato?.cuarentena) == 1 ?
                            <div><span className="font-semibold">PENDIENTE</span></div>
                            :
                            <div><span className="font-semibold">LIBERADO</span></div>
                    }
                </div>
            ))}
        </div>
    </div>
}

export default function ReporteRunsPage() {
    const { register, control, formState: { errors }, getValues } = useForm();

    const [datos, setDatos] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [dataSum, setDataSum] = useState([])

    const fetchDatos = async (date) => {
        setIsLoading(true)
        const data = await filterStockLogistica({ fecha_egreso: date })
        // console.log(data)
        setDatos(data.data)

        const result = []
        data.data?.reduce((res, val) => {
            if (parseInt(val.rechazado) == 0) {
                if (!res[val.modelo]) {
                    res[val.modelo] = { modelo: val.modelo, cantidad: 0 }
                    result.push(res[val.modelo])
                }
                res[val.modelo].cantidad += 1
            }
            return res
        }, {})

        setDataSum(result)

        setIsLoading(false)
    }

    const changeDate = (date) => {
        if (!date) {
            setDatos([])
            setDataSum([])
            return
        }
        const temp = new Date(date)
        fetchDatos(`${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()}`)
    }


    return (
        <div className="w-full">
            <div className="w-full flex items-center gap-2">
                <InputUseForm
                    name="fecha"
                    classNameInput="!text-2xl"
                    type="date"
                    control={control}
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Fecha"
                    onChangeFn={(date) => {
                        changeDate(date)
                    }}
                />

                <button className="bg-green-500 mb-2" onClick={() => {
                    changeDate(getValues("fecha"))
                }}>Recargar</button>
            </div>

            {isLoading && <div className="flex items-center justify-center"><Loader /></div>}

            {!isLoading && datos?.length > 0 &&
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {drawRun(datos, 1)}
                    {drawRun(datos, 2)}
                    {drawRun(datos, 3)}
                    {drawRun(datos, 4)}
                </div>
            }

            <Table
                bordered={true}
                size="small"
                locale={{
                    emptyText: "No se encontraron registros",
                }}
                rowClassName={(row) => {
                    if (row.orden % 2 == 0) {
                        return "bg-slate-200"
                    }
                }}
                className="w-full mt-4"
                pagination={false}
                columns={[
                    {
                        title: "Modelo (No incluye rechazados)",
                        key: "modelo",
                        dataIndex: "modelo",
                    },
                    {
                        title: "Cantidad",
                        key: "cantidad",
                        dataIndex: "cantidad",
                        align: "right"
                    }
                ]}
                loading={{
                    indicator: <Loader />,
                    spinning: isLoading
                }}
                dataSource={dataSum}
                rowKey={(item) => item.modelo}

                summary={(pageData) => {
                    let cantidadModelos = 0;

                    pageData.forEach(({ cantidad }) => {
                        cantidadModelos = cantidadModelos + parseInt(cantidad)

                    });
                    return (
                        <>
                            <Table.Summary.Row className="bg-green-100">
                                <Table.Summary.Cell index={0}><span className=" font-bold">TOTAL</span></Table.Summary.Cell>
                                <Table.Summary.Cell align="right" index={1}><span className=" font-bold">{cantidadModelos}</span></Table.Summary.Cell>
                            </Table.Summary.Row>
                        </>
                    );
                }}
            />
        </div>
    )
}
