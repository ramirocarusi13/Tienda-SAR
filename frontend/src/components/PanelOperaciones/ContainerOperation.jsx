import Loader from "@components/Loader"
import { getColorLevelOperationLine } from "@utils/Utils"
import { AsyncImage } from "loadable-image"
import { useState } from "react"
import { Link } from "react-router-dom"
import ModalOperacion from "./ModalOperacion"
import ModalUserOperation from "./ModalUserOperation"
import { getNivelName } from "@utils/Utils"
const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

export default function ContainerOperation({ item, operation, isDragging, handleDragging, handleUpdateList, handleSetDisponible, turno }) {

    // console.log(item)
    const [isVisible, setIsVisible] = useState(false)
    const [isVisibleUser, setIsVisibleUser] = useState(false)
    const [activeUser, setActiveUser] = useState(null)

    const handleDrop = (e) => {

        let id = e.target.id

        // console.log(e.target)

        if (id == '' || id == undefined) {
            id = e.target.parentNode.id
        }

        if (id == '' || id == undefined) {
            id = e.target.parentNode.parentNode.id
        }

        if (id == '' || id == undefined) {
            id = e.target.parentNode.parentNode.parentNode.id
        }

        const orden = e.dataTransfer.getData('text')

        e.preventDefault();
        handleUpdateList(orden + "", id + "")
        handleDragging(false)
    }

    const handleDragOver = (e) => e.preventDefault()

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text', `${item?.orden}-${item?.linea}`)
        handleDragging(true)
    }

    const handleDragEnd = () => handleDragging(false)

    // const getColorLevelOperario = (level) => {

    //     if (level == 1) {
    //         //25%
    //         return 'bg-red-500'
    //     } else if (level == 2) {
    //         //50%
    //         return 'bg-orange-500'
    //     } else if (level == 3) {
    //         //75%
    //         return 'bg-green-200'
    //     } else if (level == 4) {
    //         //83%
    //         return 'bg-green-300'
    //     } else if (level == 5) {
    //         //91%
    //         return 'bg-green-400'
    //     } else if (level == 6) {
    //         //100%
    //         return 'bg-green-600'
    //     } else {
    //         return 'bg-red-500'
    //     }

    // }

    // const getNamePolivalencia = (polivalencia) => {
    //     if (polivalencia == 1) {
    //         return "25%"
    //     } else if (polivalencia == 2) {
    //         return "50%"
    //     } else if (polivalencia == 3) {
    //         return "75%"
    //     } else if (polivalencia == 4) {
    //         return "83%"
    //     } else if (polivalencia == 5) {
    //         return "91%"
    //     } else if (polivalencia == 6) {
    //         return "100%"
    //     } else {
    //         return "0%"
    //     }
    // }

    if (operation?.habilitado == 0) {
        return <div className={`w-full   bg-[#f5f5f5] h-[40px] `}></div>
    }

    const operario = item?.operario

    // console.log(item)
    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            id={item?.orden + '-' + item?.linea}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`flex gap-2 items-center justify-between w-full `}
        >
            {parseInt(operation?.orden) > 6 &&
                <div className='font-semibold w-[70px] bg-white h-[40px] px-1 border-black border-l border-t border-b flex flex-col items-center justify-center gap-1'>
                    <span onClick={() => setIsVisible(true)} className={`text-[9px] ${getColorLevelOperationLine(operation?.nivel)} block w-full text-center font-semibold`}>{getNivelName(operation?.nivel)}</span>
                    <span onClick={() => setIsVisible(true)} className="text-[8px] font-bold">{operation?.nombre}</span>
                </div>
            }

            {operario ?
                <div className={`w-full  ${isDragging ? '!bg-yellow-200' : ''} bg-yellow-300 h-[40px] flex items-center justify-between border-black border-b hover:cursor-grab ${item.orden > 6 && 'flex-row-reverse'}`}>

                    <button
                        onClick={(e) => { handleSetDisponible(item) }}
                        className="p-0 px-[2px] h-full !bg-gray-400 rounded-none text-xs">X
                    </button>

                    {/* <AsyncImage
                        style={{ width: "100%", height: "100%", maxWidth: "50px" }}
                        src={`${PUBLIC_URI}usuarios/${item?.operario?.user?.id}.jpg`}
                        loader={<div className="flex items-center justify-center"><Loader /></div>}
                    /> */}

                    <Link
                        // onClick={() => {
                        //     setActiveUser(item?.operario?.user?.id)
                        //     setIsVisibleUser(true)
                        // }}
                        className="w-full text-black hover:text-gray-500">
                        <span className='text-[70%] font-bold block text-center w-full'>{operario?.user?.email?.toUpperCase()}</span>
                        {/* <span className='text-[70%] font-bold block text-center w-full'>{item?.operario?.user?.email?.toUpperCase()} ({getNamePolivalencia(item?.operario?.user?.polivalencias?.find(i => i.operacion_id == operation.id)?.polivalencia)})</span> */}
                    </Link>

                    {/* <div className={`w-[25%] h-[40px] ${getColorLevelOperario(item?.operario?.user?.polivalencias?.find(i => i.operacion_id == operation.id)?.polivalencia)} `}></div> */}
                    {/* <div className={`w-[25%] h-[40px] ${} ${operation?.level == CRITICAL_LEVEL && '!bg-red-500 animate-pulse'}`}></div> */}
                </div>
                :
                operation?.id ?
                    <div className={`${isDragging ? '!bg-gray-300 ' : ''} ${operation?.name != '' && 'animate-pulse bg-red-400'} w-full border border-dotted border-black h-[40px]`}>
                        {operation?.name != '' && <button className="p-0 w-full h-full bg-transparent rounded-none border-none">+</button>}
                    </div>
                    :
                    <div className={` w-full border border-dotted border-black h-[40px]`}></div>
            }
            {
                parseInt(operation?.orden) < 7 &&
                <div className='bg-white font-semibold w-[70px] h-[40px] px-1 border-black border-l border-t border-b flex flex-col items-center justify-center gap-1'>
                    <span onClick={() => setIsVisible(true)} className={`text-[9px] ${getColorLevelOperationLine(operation?.nivel)} block w-full text-center font-semibold`}>{getNivelName(operation?.nivel)}</span>
                    <span onClick={() => setIsVisible(true)} className="text-[8px] font-bold">{operation?.nombre}</span>
                </div>
            }

            <ModalOperacion isVisible={isVisible} setIsVisible={setIsVisible} />
            <ModalUserOperation isVisible={isVisibleUser} setIsVisible={setIsVisibleUser} user={activeUser} />
        </div >
    )
}
