import React from 'react'
import QRCode from 'react-qr-code'

const levels = [0]

export default function EtiquetaRack0({ rack, pos }) {
    return (
        <div className={`flex flex-col items-center !w-full !h-[95mm] !border-8 border-black p-1`}>
            <QRCode className="mt-6 h-[45mm]" value={rack + "-" + pos + "-0"} />
            <span className={`${(pos == 'W' || pos == 'M') ? 'text-[120px]' : 'text-[130px]'} font-bold tracking-tighter`}>{rack}-{pos}-0</span>
        </div>


    )
}