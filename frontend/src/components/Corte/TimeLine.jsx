import Loader from '@components/Loader';
import { getEstadoLectrasTimeline } from '@services/LectraService';
import { useEffect, useState } from 'react';
import 'react-calendar-timeline/lib/Timeline.css';
import TimeLineLectra from './TimeLineLectra';
import { minutesToTime } from '../../utils/Utils';

const groups = [
    { id: 'P-1', title: `L1 PLAN`, bg: 'bg-slate-200' },
    { id: 'R-1', title: 'L1 REAL', bg: 'bg-slate-200' },
    { id: 'P-2', title: 'L2 PLAN', bg: 'bg-yellow-200' },
    { id: 'R-2', title: 'L2 REAL', bg: 'bg-yellow-200' },
    { id: 'P-3', title: 'L3 PLAN', bg: 'bg-slate-200' },
    { id: 'R-3', title: 'L3 REAL', bg: 'bg-slate-200' },
    { id: 'P-4', title: 'L4 PLAN', bg: 'bg-yellow-200' },
    { id: 'R-4', title: 'L4 REAL', bg: 'bg-yellow-200' }
]

export default function TimeLine({ visible }) {

    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const temp = await getEstadoLectrasTimeline()
            if (!temp?.error) {
                setData(temp?.data?.planificacion)
            }
        } catch (error) {
            console.log(error)
        }
        setIsLoading(false)
    }


    useEffect(() => {
        fetchData()
    }, [visible])

    if (isLoading) {
        return <div className='w-full h-full flex items-center justify-center'><Loader fontSize={200} /></div>
    } else {
        return (

            <div className='w-full '>

                {/* <span className='block w-full text-6xl font-bold text-center mt-2 text-white'>LECTRA 1 {data?.filter(d => d.lectra == 1)?.reduce((p, c) => p + parseInt(c.demora), 0) > 0 && <span className='text-red-500'>(GAP {minutesToTime(data?.filter(d => d.lectra == 1)?.reduce((p, c) => p + parseInt(c.demora), 0))})</span>}</span> */}
                <span className='block w-full text-6xl font-bold text-center mt-1 text-white'>LECTRA 1</span>

                <TimeLineLectra
                    data={data?.filter(d => d.lectra == 1)}
                    groups={[
                        { id: 'P-1', title: `PLAN`, bg: 'bg-slate-200' },
                        { id: 'R-1', title: 'REAL', bg: 'bg-yellow-200' },
                    ]}
                />


                <span className='block w-full text-6xl font-bold text-center mt-1 text-white'>LECTRA 2</span>

                <TimeLineLectra
                    showHeader={false}
                    data={data?.filter(d => d.lectra == 2)}
                    groups={[
                        { id: 'P-2', title: `PLAN`, bg: 'bg-slate-200' },
                        { id: 'R-2', title: 'REAL', bg: 'bg-yellow-200' },
                    ]}
                />

                <span className='block w-full text-6xl font-bold text-center mt-1 text-white'>LECTRA 3</span>

                <TimeLineLectra
                    showHeader={false}
                    data={data?.filter(d => d.lectra == 3)}
                    groups={[
                        { id: 'P-3', title: `PLAN`, bg: 'bg-slate-200' },
                        { id: 'R-3', title: 'REAL', bg: 'bg-yellow-200' },
                    ]}
                />

                <span className='block w-full text-6xl font-bold text-center mt-1 text-white'>LECTRA 4</span>


                <TimeLineLectra
                    showHeader={false}
                    data={data?.filter(d => d.lectra == 4)}
                    groups={[
                        { id: 'P-4', title: `PLAN`, bg: 'bg-slate-200' },
                        { id: 'R-4', title: 'REAL', bg: 'bg-yellow-200' },
                    ]}
                />
            </div>

        )
    }
}
