import { formatDateTime } from "@utils/Utils";
import { QRCode } from 'antd';


export default function EtiquetaQr({ etiqueta }) {


    return (
        <div className={`print:w-[25mm] print:mt-2 w-[30mm] print:border-0 border rounded-none hover:opacity-90 flex flex-col items-center print:justify-center print:p-0 border-black px-1`}>
            {/* <div className={`print:w-[${parseInt(tamano) - 5}mm] print:mt-2 w-[${tamano}mm] print:border-0 border rounded-none hover:opacity-90 flex flex-col items-center print:justify-center print:p-0 border-black px-1`}> */}

            <span className='text-lg text-center font-bold w-full print:mt-1'>{etiqueta?.modelod?.nombre}</span>

            <QRCode className="mt-0" type="svg" size={80} bordered={false} value={etiqueta?.qr} />

            <div className="border-t my-1 w-full text-center  border-black">
                <span className='block text-[70%] font-semibold mt-1'>{etiqueta?.codigo}</span>
            </div>

            <div className='w-full flex flex-col justify-between border-black text-center items-center border-t border-b'>
                <span className='text-lg border-b border-black font-bold w-full '>{etiqueta?.vehiculo}</span>
                <span className='text-sm font-semibold flex items-center justify-center gap-1 border-black w-full py-0'>{etiqueta?.secuencia} <span className="text-[10px]">{etiqueta?.id_etiqueta}</span></span>
            </div>

            <div className='w-full flex border-b border-black text-center justify-between'>
                <span className='text-[80%] font-semibold border-r border-black w-full py-0'>{etiqueta?.ubicacion}{etiqueta?.lado} </span>
                <span className='text-[80%] font-semibold  w-full py-0'>{etiqueta?.tipo == 'CS' ? 'CUSH' : 'BACK'}</span>
                {/* <span className='text-sm font-semibold w-full py-1'>{etiqueta?.tipo == 'CS' ? 'CUSH' : 'BACK'}</span> */}
                {/* <span className='text-sm font-semibold w-full py-1'>{etiqueta?.modelod?.nombre}</span> */}
            </div>

            {/* <span className='text-[50%] font-semibold w-full py-1 text-center'>{etiqueta?.tipo == 'CS' ? 'CUSHION' : 'BACK'}</span> */}

            <span className='text-[10px] mt-1'>{formatDateTime(etiqueta.created_at, true)}</span>
            <div className="w-full border-b-4 border-black border-dotted mt-0" style={{ breakAfter: "page" }}></div>
        </div>
    )
}