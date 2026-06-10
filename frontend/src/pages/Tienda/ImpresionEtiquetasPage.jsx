import React from 'react'
import EtiquetaPieza from '@components/Tienda/EtiquetaPieza'
import Loader from '@components/Loader'
import { useReactToPrint } from 'react-to-print';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { getEtiquetas } from '@services/TiendaService';
import QRCode from 'react-qr-code';

export default function ImpresionEtiquetasPage() {

    const [etiquetas, setEtiquetas] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const handlePrint = useReactToPrint({ content: () => componentRef?.current, });

    const componentRef = useRef();

    const fetchEtiquetas = async () => {
        setIsLoading(true)
        const data = await getEtiquetas()
        setEtiquetas(data?.data)
        setIsLoading(false)

    }

    useEffect(() => {
        fetchEtiquetas()
    }, [])

    return (
        <div className="flex flex-col items-center gap-2" >
            <button onClick={() => handlePrint()} className='bg-success px-10 font-semibold text-white'>IMPRIMIR</button>
            {isLoading && <Loader />}



            <div ref={componentRef} className='flex mt-2 flex-wrap print:flex print:ml-2 gap-1 w-full print:items-center print:justify-center'>
                {/* <div ref={componentRef} className='flex gap-0 items-center flex-wrap print:ml-5 print:mt-5'> */}

                {/* <EtiquetaPieza codigo={"I6-SFLE_240V-H-K4-01"} modelo={""} lado={""} /> */}

                {etiquetas?.map((e, idx) => (
                    <EtiquetaPieza key={idx} codigo={e.codigo} modelo={e.modelo?.nombre} lado={e.parte?.lado?.lado} />
                ))}

                {/* <div className='flex items-center flex-col gap-2'>
                    <QRCode className="w-40 h-40 " value={"INGRESO"} />
                    <span className='font-bold text-4xl block w-full text-center'>INGRESO</span>
                </div>

                <div className='flex items-center flex-col gap-2'>
                    <QRCode className="w-40 h-40" value={"DESPACHO"} />
                    <span className='font-bold text-4xl block w-full text-center'>DESPACHO</span>
                </div>

                <div className='flex items-center flex-col gap-2'>
                    <QRCode className="w-40 h-40" value={"CANCELAR"} />
                    <span className='font-bold text-4xl block w-full text-center'>CANCELAR</span>
                </div> */}

            </div>
        </div>
    )
}
