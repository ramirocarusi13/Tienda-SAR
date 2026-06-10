import React from 'react'
import QRCode from 'react-qr-code'

const levels = [1, 2, 3]

export default function EtiquetaRack({ rack, pos }) {
    return (

        levels.map((l, idx) => (
            <div key={idx} className=' h-[70mm] w-[200mm] mt-1 items-center justify-center border-8  border-black relative  flex print:flex'>
                <div className={` flex w-full items-stretch gap-3 justify-around px-2 py-2`}>
                    <span className={`${(pos == 'W' || pos == 'M') ? 'text-[190px]' : 'text-[200px]'} font-bold tracking-tighter`}>{rack}-{pos}-{l}</span>
                    <div className='w-[40mm] flex items-center justify-center '>
                        <QRCode className=" mt-5" value={rack + "-" + pos + "-" + l} />
                    </div>
                </div>
            </div>
        ))

    )
}
