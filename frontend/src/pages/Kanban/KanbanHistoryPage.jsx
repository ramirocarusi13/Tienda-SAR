import { Timeline } from 'antd';
import { FaCircle } from "react-icons/fa";
import { getHistory } from '../../services/KanbanService';
import { useState } from 'react';
import { useEffect } from 'react';
import { formatDateTime } from "@utils/Utils"

export default function KanbanHistoryPage() {
    const [history, setHistory] = useState(null)

    const fetchData = async () => {
        const data = await getHistory('P240319150723110')
        setHistory(data?.data)
    }

    useEffect(() => {
        fetchData()
    }, [])


    if (history) {
        return (
            <div>
                <div className='flex mb-4 border-b border-gray-400 pb-2'>
                    <span className='text-4xl font-semibold'>{history.codigo} - {history.modelo?.nombre}</span>
                </div>
                <div className='flex items-start mt-10 mx-4 gap-2'>
                    <Timeline
                        className='w-[50%]'
                        // mode="alternate"
                        items={
                            history.history?.map((h, idx) => {
                                return {
                                    dot: (
                                        <FaCircle
                                            style={{
                                                fontSize: '10px',
                                            }}
                                        />
                                    ),
                                    color: 'green',
                                    children:
                                        <div className='flex flex-col items-start gap-1'>
                                            <span className='text-sm'>Cambio de estado - {formatDateTime(h.created_at)}</span>
                                            <div className='w-full'>
                                                <span className='font-semibold text-xs'>{h?.estado?.descripcion}</span>
                                            </div>
                                        </div>,
                                }
                            })
                        }
                    />
                    <div className='bg-red-500 w-full h-[400px]'>

                    </div>
                </div>
            </div>
        )
    }
}
