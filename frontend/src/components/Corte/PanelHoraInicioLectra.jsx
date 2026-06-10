import { useState } from "react"
import { useEffect } from "react"
import { getHoraInicioLectra, setInicioLectra } from "@services/LectraService"
import Loader from "@components/Loader"

const horas = [
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '00'
]

const minutos = [
    '00',
    '10',
    '20',
    '30',
    '40',
    '50',
]

export default function PanelHoraInicioLectra({ lectra }) {

    const [horaInicio, setHoraInicio] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        // console.log("PSO")
        fetchHoraInicioLectra()
    }, [])

    const fetchHoraInicioLectra = async () => {
        setIsLoading(true)

        const data = await getHoraInicioLectra({ lectra: lectra })

        if (data?.data) {
            setHoraInicio(data?.data?.hora)
        }

        setIsLoading(false)

    }

    const informarHoraInicioLectra = async (e, lectra) => {
        setIsLoading(true)

        const data = await setInicioLectra({ lectra, hora: e.target.value })

        if (!data?.error) {
            setHoraInicio(e.target.value)
        }

        setIsLoading(false)

    }

    if (isLoading) {
        return <div className="w-full flex items-center justify-center mb-1"><Loader /></div>
    }

    return (
        <div className='w-full'>
            <span className='text-sm font-semibold bg-green-700 text-white text-center block rounded-md px-2 mb-1'>HORA INICIO</span>
            {!isLoading &&
                <select value={horaInicio} onChange={(e) => informarHoraInicioLectra(e, lectra)} className='w-full mb-1 font-bold p-1 text-xs rounded-lg bg-orange-200'>
                    <option value={""} className='font-bold'></option>
                    {horas?.map(h => {
                        return minutos?.map(m => (
                            <option key={`hm_${h + '-' + m}`} value={h + ":" + m} className='font-bold'>{h}:{m}</option>
                        ))
                    })}
                </select>
            }
        </div>
    )
}
