import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const lectras = [1, 2, 3, 4]

export default function DadosPendientesPrint({ planificacion }) {

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="flex flex-col items-start">
            <button
                onClick={() => {
                    handlePrint()
                }}
                className='bg-yellow-400 text-xs'>IMPRIMIR DADOS PENDIENTES</button>

            <div ref={componentRef} className="!text-black w-full print:grid grid-cols-4 hidden">

                {lectras?.map((lectra, idd) => (
                    <div className="w-full border-r border-black" key={`lec_${idd}`}>
                        <span className="w-full block font-semibold text-xl text-center border-b border-black py-2">LECTRA {lectra}</span>

                        {planificacion?.filter(p => p?.lectra == lectra)?.map(p => p?.datos?.map((d, iddx) => {
                            if (d?.fin == null) {
                                return <div key={`dado_${iddx}`} className={` flex flex-col w-full items-start justify-between border-b px-2  `}>

                                    <div className='flex flex-col items-start gap-0 w-full justify-between'>
                                        <span className='text-sm font-bold text-start'>{d?.modelo ? d.modelo : d?.dado} </span>
                                        <div className={`w-full`}>
                                            <span className='font-semibold text-sm'> {d?.material?.codigo_interno} -</span>
                                            <span className='font-semibold text-sm'> {d?.material?.nombre} </span>
                                        </div>
                                    </div>
                                </div>
                            }
                        }))}
                    </div>
                ))}

            </div>
        </div >
    )
}
