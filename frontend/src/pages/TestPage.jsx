import { useState } from "react"

export default function TestPage() {

    const [img, setImg] = useState("/despiece/71072-0KM62-C4.jpg")
    const [pieza, setPieza] = useState({
        l: 41,
        t: 16,
        w: 22,
        h: 6
    })

    return (
        <div className="flex items-center justify-center">
            <div className="w-auto h-full relative bg-red-500">
                <div className="absolute top-0 left-[50%] h-full w-[2px] bg-cyan-500"></div>
                <div className="absolute top-0 left-[25%] h-full w-[2px] bg-green-500"></div>
                <div className="absolute top-0 left-[75%] h-full w-[2px] bg-green-500"></div>
                <div className="absolute top-[50%] left-0 w-full h-[2px] bg-cyan-500"></div>
                <div className="absolute top-[25%] left-0 w-full h-[2px] bg-green-500"></div>
                <div className="absolute top-[75%] left-0 w-full h-[2px] bg-green-500"></div>
                {pieza &&
                    <button key={1}
                        style={{ left: `${pieza.l}%`, top: `${pieza.t}%`, width: `${pieza.w}%`, height: `${pieza.h}%` }}
                        className={`bg-red-500 !outline-none active:bg-green-500 border-0 border-green-400 absolute opacity-50 `}>
                    </button>
                }

                <img src={img} className="w-auto h-full" />
            </div>
        </div>
    )
}
