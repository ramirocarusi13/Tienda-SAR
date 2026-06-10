import { formatDateTime } from '@utils/Utils'
import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'

export default function LectraView({ lectra }) {

    const [ctime, setTime] = useState(lectra.time)

    const UpdateTime = () => {
        const cTime = dayjs()
        const lTime = dayjs(lectra.time)

        let h = cTime.diff(lTime, 'hour')
        let m = cTime.diff(lTime, 'minute')
        let s = cTime.diff(lTime, 'seconds')


        if (m > 60) {
            m = m / 60
            m = (m - h) * 60
        }

        s = s / 60 / 60
        s = s - h //Le resto las horas actuales
        s = s * 60 //Lo paso a minutos
        s = (s - m)
        s = parseInt(s * 60) // Lo paso a segundos

        m = m.toFixed()
        h = h.toFixed()
        s = s.toFixed()

        if (h.length < 2) {
            h = `0${h}`
        }

        if (m.length < 2) {
            m = `0${m}`
        }

        if (s.length < 2) {
            s = `0${s}`
        }

        setTime(`${h}:${m}:${s}`)
    }

    useEffect(() => {
        if (lectra.status == 'Error') {
            // UpdateTime()
            setInterval(UpdateTime)

        }
    }, [])


    return (
        <div className={`flex flex-col items-start relative justify-start rounded-md w-full h-[500px] border`}>
            <div className={`flex flex-col items-center relative justify-center h-[60%] rounded-md w-full ${lectra.status == 'Error' ? 'bg-error' : 'bg-success'}`}>
                <span className='block bg-gray-400 w-full absolute top-0 text-xl text-center py-2 rounded-t-md font-semibold'>{lectra.name}</span>

                {lectra.status == 'Error' ?
                    <div className='flex flex-col items-center'>
                        <span className='text-sm font-semibold mb-2 block'>Inicio : {formatDateTime(lectra.time)}</span>
                        <span className='text-xl font-semibold'>Tiempo muerto: </span>
                        <span className='text-3xl font-semibold'>{ctime}</span>
                    </div>
                    :
                    <div className='flex flex-col items-center'>
                        <span className='text-xl font-semibold'>En Producción</span>
                    </div>
                }
            </div>

            <div className='p-2'>
                {lectra.status != 'Error' &&
                    <div className='flex flex-col gap-1'>
                        <span className='block text-xl font-semibold'>Cortando : {lectra.corte}</span>
                        <span className='block text-xl font-semibold'>Inicio : 17:00</span>
                    </div>
                }
            </div>
        </div>
    )
}
