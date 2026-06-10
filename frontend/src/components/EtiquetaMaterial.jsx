import QRCode from "react-qr-code";

export default function EtiquetaMaterial({ code, name, lote, codInterno }) {
    return (
        <div className="h-[30mm] w-[100mm] rounded-lg mt-4 px-2 gap-1 bg-red-200 flex items-center">
            {/* <div className='py-2 h-full'> */}
            <QRCode className="py-1 h-full w-[30mm]" value={lote} />
            {/* </div> */}
            <div className="flex items-start justify-between flex-col w-full h-full py-1 px-2">
                <div className="flex flex-col gap-0">
                    <span className="text-xl font-bold">{code}</span>
                    <span className="text-sm">{name}</span>
                </div>

                <div className=" w-full flex items-end justify-between">
                    <span className="text-2xl font-bold">{codInterno}</span>
                    <span className="text-sm font-semibold">50.55ML | 90.99M2</span>
                </div>
                <span className="text-sm font-semibold">{lote}</span>
            </div>
        </div>
    )
}
