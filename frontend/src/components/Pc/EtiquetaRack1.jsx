import React from 'react'
import QRCode from 'react-qr-code'

const levels = [1, 2, 3, 4]

export default function EtiquetaRack1({ rack, pos, pos2 }) {
    return (

        // levels.map((l, idx) => (
        <div className='mt-1 items-center justify-center relative  flex print:flex'>
            <div className={` flex flex-col w-full items-center gap-1 justify-start h-[100px]`}>
                <span className={`${(pos == 'W' || pos == 'M') ? 'text-sm' : 'text-sm'} blockfont-bold tracking-tighter`}>{rack}-{pos}-{pos2}</span>
                {/* <div className='w-[40mm] flex items-center justify-center '> */}
                <QRCode className="w-[40mm] " value={rack + "-" + pos + "-" + pos2} />
                {/* </div> */}
            </div>
        </div>
        // ))

    )
}
