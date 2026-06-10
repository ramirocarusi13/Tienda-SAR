
import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { Table } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Tag } from "antd";
import { getKanbanReport } from '../../services/KanbanService';
import { formatDateTime } from "../../utils/Utils";


export default function KanbanDetailPage() {

    const [dataKanban, setDataKanban] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const { register, control, formState: { errors } } = useForm();

    const keyPressEnter = async (e) => {
        if (e.key == 'Enter') {
            setIsLoading(true)
            const data = await getKanbanReport(e.target.value)
            if (data?.error) {
                setDataKanban([])
            } else {
                setDataKanban(data?.data)
            }
            setIsLoading(false)
        }
    }

    return (
        <div className="px-4">
            <InputUseForm
                label="Ingrese el número de kanban"
                name="qr"
                className="w-full"
                register={register}
                classNameInput="!text-2xl !py-4"
                errors={errors}
                placeholder="Nro Kanban"
                rules={{ required: "Ingrese o escanee el kanban" }}
                onKeyPress={keyPressEnter}
            />

            {(!isLoading && (dataKanban?.id == null)) && <span className="w-full block text-center font-semibold mt-2">No hay datos para mostrar</span>}

            {isLoading && <div className="w-full flex items-center justify-center"><Loader fontSize={100} /></div>}

            {(!isLoading && dataKanban?.id > 0) &&
                <div className="flex items-start justify-between w-full gap-4 mt-4">

                    <div className=" flex flex-col w-full">
                        <div className="w-full flex flex-col">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Datos de kanban</span>
                            <div className="flex items-center gap-4 mt-2">
                                <span>Estado: <span className="font-bold">{dataKanban?.estado?.estado?.descripcion}</span></span>
                                <span>Modelo: <span className="font-bold">{dataKanban?.modelo?.nombre}</span></span>
                                <span>Creado: <span className="font-bold">{formatDateTime(dataKanban?.created_at)}</span></span>
                            </div>
                        </div>

                        <div className="flex flex-col mt-6 w-[50%]">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Historial estados</span>
                            <Table
                                pagination={false}
                                rowKey={r => r.id}
                                size="small"
                                dataSource={dataKanban?.history}
                                columns={[
                                    {
                                        title: 'Fecha',
                                        key: 'created_at',
                                        dataIndex: 'created_at',
                                        render: (t) => {
                                            return formatDateTime(t)
                                        }
                                    },
                                    {
                                        title: 'Estado',
                                        key: 'estado',
                                        dataIndex: 'estado',
                                        render: (_, r) => {
                                            let color = ''
                                            if (r?.estado_id == "7") {
                                                color = 'blue'
                                            } else if (r?.estado_id == "2") {
                                                color = 'orange'
                                            } else if (r?.estado_id == "3") {
                                                color = 'red'
                                            } else if (r?.estado_id == "6") {
                                                color = 'green'
                                            }

                                            return <Tag color={color}>{r?.estado?.descripcion}</Tag>
                                        }
                                    },

                                ]}
                            />
                        </div>

                        <div className="w-full flex flex-col mt-6">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Etiquetas generadas/impresas</span>
                            <Table
                                pagination={false}
                                rowKey={r => r.id}
                                size="small"
                                dataSource={dataKanban?.etiquetas_qr_generadas}
                                columns={[
                                    {
                                        title: 'Estado',
                                        key: 'estado',
                                        dataIndex: 'estado',
                                        render: (text, r) => {
                                            let color = ''
                                            if (text == "VALIDADA" || text == "CREADA") {
                                                color = 'blue'
                                            } else if (text == "QCP_OK") {
                                                color = 'green'
                                            } else if (text == "SCRAP") {
                                                color = 'red'
                                            }

                                            return <Tag color={color}>{text}</Tag>
                                        }
                                    },
                                    {
                                        title: 'Secuencia',
                                        key: 'secuencia',
                                        dataIndex: 'secuencia'
                                    },
                                    {
                                        title: 'QR',
                                        key: 'qr',
                                        dataIndex: 'qr'
                                    },
                                    {
                                        title: 'Tipo',
                                        key: 'tipo',
                                        dataIndex: 'tipo'
                                    },
                                    {
                                        title: 'Lado',
                                        key: 'lado',
                                        dataIndex: 'lado'
                                    },
                                    {
                                        title: 'User impresión',
                                        key: 'user_impresion',
                                        dataIndex: 'user_impresion',
                                        render: (_, r) => {
                                            return r?.user_impresion?.email
                                        }
                                    }
                                ]}
                            />
                        </div>

                        <div className="w-full flex flex-col mt-6">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Etiquetas controladas</span>
                            <Table
                                pagination={false}
                                rowKey={r => r.id}
                                size="small"
                                dataSource={dataKanban?.etiquetas_qr_validadas}
                                columns={[
                                    {
                                        title: 'Estado',
                                        key: 'estado',
                                        dataIndex: 'estado',
                                        render: (text, r) => {
                                            let color = ''
                                            if (text == "VALIDADA" || text == "CREADA") {
                                                color = 'blue'
                                            } else if (text == "QCP_OK") {
                                                color = 'green'
                                            } else if (text == "SCRAP") {
                                                color = 'red'
                                            }

                                            return <Tag color={color}>{text}</Tag>
                                        }
                                    },
                                    {
                                        title: 'Secuencia',
                                        key: 'secuencia',
                                        dataIndex: 'secuencia'
                                    },
                                    {
                                        title: 'QR',
                                        key: 'qr',
                                        dataIndex: 'qr'
                                    },

                                    {
                                        title: 'Tipo',
                                        key: 'tipo',
                                        dataIndex: 'tipo'
                                    },
                                    {
                                        title: 'Lado',
                                        key: 'lado',
                                        dataIndex: 'lado'
                                    },
                                    {
                                        title: 'User validación Cara B',
                                        key: 'user_validacion_cara_b',
                                        dataIndex: 'user_validacion_cara_b',
                                        render: (_, r) => {
                                            return r?.user_validacion_cara_b?.email
                                        }
                                    },
                                    {
                                        title: 'Hora validación Cara B',
                                        key: 'hora_validacion_carab',
                                        dataIndex: 'hora_validacion_carab',
                                        render: (text) => {
                                            if (text) {
                                                return formatDateTime(text)
                                            }
                                        }
                                    },
                                    {
                                        title: 'User Validación',
                                        key: 'user_validacion',
                                        dataIndex: 'user_validacion',
                                        render: (_, r) => {
                                            return r?.user_validacion?.email
                                        }
                                    },
                                    {
                                        title: 'Hora Validación',
                                        key: 'hora_validacion',
                                        dataIndex: 'hora_validacion',
                                        render: (text) => {
                                            return formatDateTime(text)
                                        }
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
