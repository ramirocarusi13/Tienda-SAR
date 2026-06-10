// import { AsyncImage } from "loadable-image"
// import Loader from "@components/Loader"
import { Link } from "react-router-dom";
import ModalUserOperation from "./ModalUserOperation";
import { useState } from "react";
import { jerarquias } from "../../utils/Constants";
import { RiFlag2Fill } from 'react-icons/ri'

// const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

export default function MembersDisponibles({ item, isDragging, handleDragging, handleUpdateList }) {

    const [isVisibleUser, setIsVisibleUser] = useState(false)
    const [activeUser, setActiveUser] = useState(null)

    const handleDrop = (e) => {

        let id = e.target.id

        if (id == '' || id == undefined) {
            id = e.target.parentNode.id
        }

        if (id == '' || id == undefined) {
            id = e.target.parentNode.parentNode.id
        }

        const orden = e.dataTransfer.getData('text')

        e.preventDefault();
        handleUpdateList(orden + "", id + "")
        handleDragging(false)
    }

    const handleDragOver = (e) => e.preventDefault()

    const handleDragStart = (e) => {
        // console.log(item?.nombre)
        e.dataTransfer.setData('text', `${item?.id}-${item?.linea}`)
        handleDragging(true)
    }

    const handleDragEnd = () => handleDragging(false)
    // console.log(item)
    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            id={item?.id + '-' + item?.linea}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`flex gap-4 items-center justify-between w-full mb-1 layout-cards ${isDragging ? 'bg-gray-300' : ''}`}
        >
            <div className={`w-full flex items-center h-[30px] justify-between ${item?.email ? 'bg-green-300' : 'border border-dotted'} hover:cursor-grab`}>

                {/* <AsyncImage
                    style={{ width: "100%", height: "40px", maxWidth: "40px" }}
                    src={`${PUBLIC_URI}usuarios/${item?.id}.jpg`}
                    loader={<div className="flex items-center justify-center"><Loader /></div>}
                /> */}
                <Link
                    // onClick={() => {
                    //     setActiveUser(item?.id)
                    //     setIsVisibleUser(true)
                    // }}
                    className="w-full text-black hover:text-gray-500 relative">
                    <span className='text-xs block text-center w-full'>{item?.email?.toUpperCase()}</span>
                    {item.rol == jerarquias.UTILITY &&
                        <div className="absolute top-[-11px] left-[-4px] ">
                            <span className="text-white z-10 absolute left-[4px] top-[3px] text-sm">UT</span>
                            <RiFlag2Fill className="text-blue-500 text-3xl" />
                        </div>
                    }

                    {item.rol == jerarquias.TEAM_LEADER &&
                        <div className="absolute top-[-11px] left-[-4px] ">
                            <span className="text-white z-10 absolute left-[5px] top-[3px] text-sm">TL</span>
                            <RiFlag2Fill className="text-gray-500 text-3xl" />
                        </div>
                    }

                    {item.rol == jerarquias.MEMBER &&
                        <div className="absolute top-[-11px] left-[-4px] ">
                            <span className="text-black z-10 absolute left-[3px] top-[3px] text-sm">TM</span>
                            <RiFlag2Fill className="text-white text-3xl " />
                        </div>
                    }

                    {item.rol == jerarquias.GROUP_LEADER &&
                        <div className="absolute top-[-11px] left-[-4px] ">
                            <span className="text-white z-10 absolute left-[5px] top-[3px] text-sm">GL</span>
                            <RiFlag2Fill className="text-black text-3xl" />
                        </div>
                    }
                </Link>
            </div>

            <ModalUserOperation isVisible={isVisibleUser} setIsVisible={setIsVisibleUser} user={activeUser} />

        </div>

    )
}
