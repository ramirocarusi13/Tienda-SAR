import PrioridadPlan from "@components/Pc/PrioridadPlan";
import usePcImpresiones from '@hooks/usePcImpresiones';
import { Table, Tabs } from "antd";
import { useEffect, useState } from "react";

export default function PendienteImpresionPage() {

    const { isLoading, fetchSituacionActual } = usePcImpresiones(false)
    const [kanbanPendientes, setKanbanPendientes] = useState([])

    const getPendientes = async () => {
        const data = await fetchSituacionActual(true)
        setKanbanPendientes(data?.data)
    }

    useEffect(() => {
        getPendientes()
    }, [])

    return (
        <div>
            <Tabs
                defaultActiveKey="2"
                items={[
                    {
                        key: '1',
                        label: 'Situación actual',
                        children: <div>
                            <button onClick={() => getPendientes()} className="text-xs bg-green-400 mb-4 px-10">Actualizar</button>

                            <Table
                                locale={{ emptyText: "No tiene kanbans pendiente de impresión" }}
                                pagination={{ pageSize: 100 }}
                                className="w-full"
                                size='small'
                                loading={isLoading}
                                dataSource={kanbanPendientes}
                                rowKey={row => row.modelo}
                                rowClassName={(r, idx) => {
                                    if (idx % 2 == 0) {
                                        return `bg-slate-300 font-semibold  w-full px-2 `
                                    } else {
                                        return `bg-white font-semibold  w-full px-2 `
                                    }
                                }}
                                columns={[
                                    { title: 'Modelo', key: 'modelo', dataIndex: 'modelo', className: '' },
                                    { title: 'Sets en corte', key: 'sets_en_corte', dataIndex: 'sets_en_corte', className: '' },
                                    { title: 'Sets cortados', key: 'sets_cortados', dataIndex: 'sets_cortados', className: '' },
                                    { title: 'Sets en buffer', key: 'sets_en_buffer', dataIndex: 'sets_en_buffer', className: '' },
                                    { title: 'Sets en dollys', key: 'sets_en_dollys', dataIndex: 'sets_en_dollys', className: '' },
                                    { title: 'Sets en cajas', key: 'sets_en_rack', dataIndex: 'sets_en_rack', className: '' },
                                ]}
                            />
                        </div>
                    },
                    {
                        key: '2',
                        label: 'Planificación',
                        children: <PrioridadPlan />
                    }
                ]}
            />
        </div>
    )
}
