import { Modal, Progress, Table, Tabs } from 'antd';


export default function ModalOperacion({ isVisible, setIsVisible }) {
    return (
        <Modal
            width="100%"
            open={isVisible}
            onCancel={() => setIsVisible(false)}
        >
            <div className="">
                <span className="font-semibold text-xl block mb-4">Operacion 1</span>

                <Tabs
                    items={[
                        {
                            key: '1',
                            label: 'Producción',
                            children: <div>
                                <Table
                                    title={() => <span className='font-semibold text-lg'>Operadores más capacitados</span>}
                                    pagination={false}
                                    className='w-[30%]'
                                    size="small"
                                    dataSource={[
                                        { tm: 'Jofre Santiago', time: '00:03:20', percentage: 95 },
                                        { tm: 'Perez Gisela', time: '00:03:20', percentage: 54 },
                                        { tm: 'Zarate Jonathan', time: '00:03:20', percentage: 32 },
                                        { tm: 'Aguirre Ivan', time: '00:03:20', percentage: 20 },
                                    ]}

                                    columns={[
                                        {
                                            title: 'TM',
                                            dataIndex: 'tm',
                                            key: 'tm'
                                        },
                                        {
                                            title: 'Tiempo',
                                            dataIndex: 'time',
                                            key: 'time'
                                        },
                                        {
                                            title: '%',
                                            dataIndex: 'percentage',
                                            key: 'percentage'
                                        },
                                        {
                                            title: '',
                                            dataIndex: 'bar',
                                            key: 'bar',
                                            render: (_, record) => {
                                                return <Progress
                                                    // trailColor='red'
                                                    strokeColor={(record?.percentage < 50 ? 'red' : (record?.percentage < 85 ? 'blue' : 'green'))}
                                                    className='w-full'
                                                    percent={record?.percentage}
                                                    size="small"
                                                />
                                            }
                                        }
                                    ]}
                                />
                            </div>
                        },
                        {
                            key: '2',
                            label: 'Ingeniería',
                            children: <div></div>
                        }
                    ]}
                />



            </div>
        </Modal>
    )
}
