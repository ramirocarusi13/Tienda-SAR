import { useEffect } from "react"
import { useState } from "react"
import useUsers from "@hooks/useUsers"
import { getColorLevelOperationLine, getNivelName } from "../../utils/Utils"

const bgColor = (operation) => {
    if (operation?.habilitado == 0) {
        return 'bg-gray-300'
    } else {
        return 'bg-red-400'
    }
}

export default function PolivalenciaItem({ operation, polivalencias, user }) {
    const { isLoading: isLoadingUsers, setPolivalenciaUsuario } = useUsers(false)

    const [level, setLevel] = useState(0)

    const setearNivelPolivalencia = () => {
        const data = polivalencias.filter(polivalencia => polivalencia.operacion_id == operation.id)
        if (data?.length > 0) {
            setLevel(parseInt(data[0]?.polivalencia))
        } else {
            setLevel(0)
        }
    }

    const guardarPolivalencia = async (level) => {
        const payload = {
            userId: user,
            polivalencia: level,
            operacion: operation.id
        }
        const data = await setPolivalenciaUsuario(payload)

        setLevel(level)
    }

    useEffect(() => {
        if (polivalencias?.length >= 0) {
            setearNivelPolivalencia()
        } else {
            setLevel(0)
        }
    }, [polivalencias])

    return (

        <div className="w-full">
            <span className="w-full block text-center mb-1 text-xs font-bold">{operation?.nombre} {operation?.nivel && <span className={`px-2 ${getColorLevelOperationLine(operation?.nivel)}`}> {getNivelName(operation?.nivel)}</span>} {operation?.habilitado == 0 && '- INACTIVO'}</span>
            <div className={`w-full h-[30px] border flex border-black `}>
                <button onClick={() => guardarPolivalencia(0)} className="p-0 px-1 rounded-none hover:border-none active:border-none focus-within:border-none focus-visible:border-none">X</button>
                <div onClick={() => guardarPolivalencia(1)} className={`hover:cursor-pointer ${level >= 1 ? 'bg-green-500' : bgColor(operation)} hover:bg-green-500 flex items-center justify-center text-xs border-r w-[25%] h-full`}>1</div>
                <div onClick={() => guardarPolivalencia(2)} className={`hover:cursor-pointer ${level >= 2 ? 'bg-green-500' : bgColor(operation)} hover:bg-green-500 flex items-center justify-center text-xs border-r w-[25%] h-full`}>2</div>
                <div onClick={() => guardarPolivalencia(3)} className={`hover:cursor-pointer ${level >= 3 ? 'bg-green-500' : bgColor(operation)} hover:bg-green-500 flex items-center justify-center text-xs border-r w-[25%] h-full`}>3</div>
                <div onClick={() => guardarPolivalencia(4)} className={`hover:cursor-pointer ${level >= 4 ? 'bg-green-500' : bgColor(operation)} hover:bg-green-500 flex items-center justify-center text-xs border-r w-[8.3%] h-full`}>4</div>
                <div onClick={() => guardarPolivalencia(5)} className={`hover:cursor-pointer ${level >= 5 ? 'bg-green-500' : bgColor(operation)} hover:bg-green-500 flex items-center justify-center text-xs border-r w-[8.3%] h-full`}>5</div>
                <div onClick={() => guardarPolivalencia(6)} className={`hover:cursor-pointer ${level >= 6 ? 'bg-green-500' : bgColor(operation)} hover:bg-green-500 flex items-center justify-center text-xs border-r w-[8.3%] h-full`}>6</div>
            </div>
        </div>
    )
}
