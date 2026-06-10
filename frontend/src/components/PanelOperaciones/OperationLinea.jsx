import { getColorLevelOperationLine } from "@utils/Utils"
import { useState } from "react"
import { getNivelName } from "../../utils/Utils"
import ModalOperacion from "./ModalOperacion"


export default function OperationLinea({ item, operation, setActive }) {

    const [isVisible, setIsVisible] = useState(false)

    return (
        <div
            id={item?.orden + '-' + item?.linea}
            className={`flex gap-2 items-center justify-between w-full `}
        >
            {item?.nombre ?
                <div className={`w-full ${item.habilitado == 1 ? 'bg-green-400' : 'bg-gray-200'} h-[40px] flex items-center justify-between border-black border-b `}>
                    <div className={`border-r border-black font-semibold flex items-center justify-center w-[50px] h-full ${getColorLevelOperationLine(item?.nivel)}`}>{getNivelName(item?.nivel)}</div>
                    <button onClick={() => setActive(item)} className="p-0 w-full h-full bg-transparent rounded-none border-none">
                        <span className={`text-xs font-semibold block text-center w-full  ${item.habilitado == 1 ? 'text-black' : 'text-black'}`}>{item?.nombre}</span>
                    </button>
                </div>
                :
                <div className={` ${operation?.name != '' && 'animate-pulse bg-red-400'} w-full border border-dotted border-black h-[40px]`}>
                    {operation?.name != '' && <button className="p-0 w-full h-full bg-transparent rounded-none border-none">+</button>}
                </div>
            }
            <ModalOperacion isVisible={isVisible} setIsVisible={setIsVisible} />
        </div>
    )
}
