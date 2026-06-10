import { Table } from 'antd'
import React from 'react'

export default function FinishGoodPage() {
    return (
        <div className='flex items-start justify-center w-full h-screen px-4 py-2'>
            <div className='flex flex-col'>
                <span className='text-5xl font-bold'>REGISTROS</span>

                <Table
                    pagination={false}
                    className='w-full mt-5'
                    size='small'
                    dataSource={[
                        {
                            fecha: '30/01/2025',
                            hora: '13:34',
                            kanban: 'P241255848868484'
                        },
                        {
                            fecha: '30/01/2025',
                            hora: '13:34',
                            kanban: 'P241255838868484'
                        },
                        {
                            fecha: '30/01/2025',
                            hora: '13:34',
                            kanban: 'P241255848484984'
                        },
                        {
                            fecha: '30/01/2025',
                            hora: '13:34',
                            kanban: 'P241218488684984'
                        },
                        {
                            fecha: '30/01/2025',
                            hora: '13:34',
                            kanban: 'P241255848114984'
                        },
                        {
                            fecha: '30/01/2025',
                            hora: '13:34',
                            kanban: 'P241255848868424'
                        },
                        {
                            fecha: '30/01/2025',
                            hora: '13:34',
                            kanban: 'P241255848868493'
                        }
                    ]}
                    rowKey={r => r.kanban}
                    columns={[
                        {
                            key: 'fecha',
                            dataIndex: 'fecha',
                            title: 'FECHA'
                        },
                        {
                            key: 'hora',
                            dataIndex: 'hora',
                            title: 'HORA'
                        },
                        {
                            key: 'kanban',
                            dataIndex: 'kanban',
                            title: 'KANBAN'
                        }
                    ]}
                />
            </div>

            <div className='flex flex-col gap-0 w-[70%] items-center'>
                <span className='text-5xl font-bold'>MODELOS</span>
                <div className='grid grid-cols-2 gap-4 mt-5'>
                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>HRDH-B</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>4</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>

                    <div className='grid grid-cols-2 gap-5'>
                        <div className='text-red-600 font-bold text-5xl'>SFHG</div>
                        <div className='text-red-600 font-bold text-5xl'>3</div>
                    </div>
                </div>
            </div>

            <div className=''>
                <div className='border-2 flex flex-col items-center'>
                    <span className='text-5xl font-bold border-b-2 w-full px-10 block py-2'>TOTAL</span>
                    <span className='text-red-600 font-bold text-9xl py-4 pb-5'>53</span>
                </div>
            </div>
        </div>
    )
}
