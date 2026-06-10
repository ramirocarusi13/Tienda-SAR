import { Modal, Table } from 'antd'
import { fetchHistorial } from "@services/DepositoService"
import { useState } from 'react'
import { useEffect } from 'react'
import { Tag } from 'antd'
import { formatDate } from '../../utils/Utils'

export default function ModalSelectEditPedido({ isVisible, setIsVisible, setSelectedDespacho }) {

    const [isLoading, setIsLoading] = useState(false)
    const [dataPendiente, setDataPendiente] = useState([])

    useEffect(() => {
        if (isVisible) {
            fetchDespachos()
        }
    }, [isVisible])

    const fetchDespachos = async () => {
        setIsLoading(true)
        const data = await fetchHistorial()
        // console.log(data)
        setDataPendiente(data?.data)
        setIsLoading(false)
    }

    return (
        <Modal
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            okButtonProps={{ className: 'bg-green-500' }}
            closable={false}
            footer={[
                <button key={'btn1'} className='text-xs bg-gray-400' onClick={() => setIsVisible(false)}>Cancelar</button>
            ]}
        >
            <Table
                loading={isLoading}
                dataSource={dataPendiente}
                rowKey={(row) => row.id}
                className='w-full'
                size='small'
                pagination={{
                    pageSize: 20
                }}
                columns={[
                    {
                        key: 'run',
                        dataIndex: 'run',
                        title: 'Run'
                    },
                    {
                        key: 'created_at',
                        dataIndex: 'created_at',
                        title: 'Fecha',
                        render: (text) => formatDate(text)
                    },
                    {
                        key: 'user',
                        dataIndex: 'user',
                        title: 'Usuario',
                        render: (text) => text?.name
                    },
                    {
                        key: 'estado',
                        dataIndex: 'estado',
                        title: 'Estado',
                        render: (_, record) => {
                            if (record?.pendiente) {
                                return <Tag color='orange-inverse'>Pendiente</Tag>
                            } else {
                                return <Tag color='green-inverse'>Pickeado</Tag>
                            }
                        }
                    },
                    {
                        key: 'acciones',
                        dataIndex: 'acciones',
                        title: 'Acciones',
                        render: (_, record) => {
                            return <button onClick={
                                () => {
                                    setSelectedDespacho(record.id)
                                    setIsVisible(false)
                                }} className='text-xs py-1 px-2 text-sky-500 bg-transparent !border-none' > Seleccionar</button>
                        }
                    }
                ]}
            />
        </Modal >
    )
}
