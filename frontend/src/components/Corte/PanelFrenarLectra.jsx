import { setInicioDado, getEstadoFrenoLectra } from "@services/LectraService";
import { useState } from "react";
import { useEffect } from "react";

export default function PanelFrenarLectra({ lectra }) {

    const [currentState, setCurrentState] = useState(null)

    useEffect(() => {
        fetchEstado()
    }, [])

    const fetchEstado = async () => {
        const data = await getEstadoFrenoLectra({ lectra: lectra })
        // console.log(data)
        if (data?.data) {
            setCurrentState(data?.data?.dado_id)
        }
    }

    const informarParateLectra = async (e, lectra) => {
        const data = await setInicioDado({
            lectra,
            dado: e.target.value,
        })

        fetchEstado()

    }
    return (
        <div className='flex flex-col gap-1 w-full'>

            {currentState ?
                <span className="bg-red-500 text-white font-semibold rounded-xl block text-center">{currentState}</span>
                :
                <span className="bg-green-500 text-white font-semibold rounded-xl block text-center">NORMAL</span>
            }

            <select onChange={(e) => informarParateLectra(e, lectra)} className='w-full mb-1 font-bold p-2 text-xs rounded-lg bg-blue-200'>
                <option value={""} className='font-bold'>-- INFORMAR FRENADA --</option>
                <option value={"FALTA DE TENDIDO"} className='font-bold'>FALTA DE TENDIDO</option>
                <option value={"DEMORA PICKEO"} className='font-bold'>DEMORA PICKEO</option>
                <option value={"INGENIERIA"} className='font-bold'>INGENIERIA</option>
                <option value={"MANTENIMIENTO"} className='font-bold'>MANTENIMIENTO</option>
                <option value={"FALLA SISTEMA"} className='font-bold'>FALLA SISTEMA</option>
            </select>
        </div>
    )
}
