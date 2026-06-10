import { estados, meses } from "../utils/Constants";
import QRCode from "react-qr-code";

const getTitleKanban = (codigo) => {

    const type = codigo.substr(0, 1)

    if (type == "P") {
        return "KANBAN DE PROCESO"
    } else if (type == "M") {
        return "KANBAN DE MATERIAL"
    }
}

{/* <div className=' h-[70mm] w-[200mm] mt-2 items-center justify-center border-8  border-black relative  flex print:flex'>
    
    <div className={` flex w-full items-center  gap-4 justify-center  p-2`}>
        <span className="text-[220px] font-semibold tracking-tighter">A-A-1</span>
        <QRCode className=" w-[40mm] mt-6" value={"A-A-1"} />
    </div>
    </div> */}

export default function KanbanPrint({ kanban }) {

    if (kanban?.codigo?.substr(0, 1) == "P") {
        // console.log(kanban)
        return (
            <>
                <style>
                    {`@media print {body{margin:auto;  margin:0; margin-left:20px; padding-top:10px;} div.saltopagina{display:block; page-break-before:always}}`}
                </style>

                <div className=' h-[70mm] w-[200mm] items-start justify-center border-2 border-black relative mb-3 flex'>
                    <div className='w-[55mm]  h-full'></div>

                    <div className=' w-[102mm] h-full flex flex-col items-center border-l-2 border-l-black border-r-2 '>
                        <span className='block w-full bg-black text-white font-bold text-xl px-2'>{kanban?.codigo}</span>
                        <div className='w-full text-3xl border-b border-black px-4 font-semibold'>
                            <span>{getTitleKanban(kanban?.codigo)}</span>
                        </div>

                        <div className='flex items-start w-full h-full justify-between '>
                            <div className='flex w-[40%] flex-col h-full justify-center py-2 items-center gap-2 px-1 '>
                                <span className={`${kanban?.modelo?.nombre.length <= 4 ? 'text-5xl' : 'text-4xl'} font-semibold text-center block w-full`}>{kanban?.modelo?.nombre}</span>
                                <div className='bg-black w-[30mm] h-[30mm]'>
                                    <QRCode className="w-full h-full" value={kanban?.codigo || ""} />
                                </div>
                            </div>
                            <div className='w-[60%] h-full flex flex-col px-5 justify-between'>
                                <div className='flex flex-col'>
                                    <span className='underline text-xs'>DESCRIPCIÓN:</span>
                                    <span className="text-xs">{kanban?.modelo?.descripcion}</span>
                                </div>

                                <div className='flex flex-col'>
                                    <span className='underline text-xs'>COMPONENTES:</span>
                                    <div className='flex items-center justify-between max-w-[200px]'>
                                        <div className='flex flex-col'>
                                            <span className='underline text-xs'>H/R</span>
                                            <span className="text-xs">{kanban?.modelo?.hr}</span>
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className='underline text-xs'>CTR H/R</span>
                                            <span className="text-xs">{kanban?.modelo?.ctrhr}</span>
                                        </div>

                                        <div className='flex flex-col'>
                                            <span className='underline text-xs'>A/R</span>
                                            <span className="text-xs">{kanban?.modelo?.ar}</span>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <span className='underline text-xs'>MES: </span>
                                        <span className='text-xl font-semibold'>{meses.filter(mes => mes.value == kanban?.mes)[0]?.label.toUpperCase()}</span>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <span className='underline text-xs'>CANTIDAD: </span>
                                        <span className='text-xl font-semibold'>{kanban?.modelo?.cantidad} SETS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' w-[45mm] h-full p-2 flex flex-col relative'>
                        <div className='absolute h-full  border-dotted border-l-2 border-l-black border-r-0 w-[2px] top-0 left-0 bg-transparent border-transparent'></div>

                        <span className='underline text-xs'>MODELO:</span>
                        <span className='text-3xl font-semibold'>{kanban?.modelo?.nombre}</span>
                        <span className='underline text-xs'>MES:</span>
                        <span className='text-2xl font-semibold'>{meses.filter(mes => mes.value == kanban?.mes)[0]?.label.toUpperCase()}</span>

                        <span className='underline text-xs'>COMPONENTES:</span>
                        <div className='flex items-center justify-between'>
                            <div className='flex flex-col'>
                                <span className='underline text-xs'>H/R</span>
                                <span className="text-xs">{kanban?.modelo?.hr}</span>
                            </div>

                            <div className='flex flex-col'>
                                <span className='underline text-xs'>CTR H/R</span>
                                <span className="text-xs">{kanban?.modelo?.ctrhr}</span>
                            </div>

                            <div className='flex flex-col'>
                                <span className='underline text-xs'>A/R</span>
                                <span className="text-xs">{kanban?.modelo?.ar}</span>
                            </div>
                        </div>

                        <span className='underline text-xs'>CANTIDAD:</span>
                        <span className='text-2xl font-semibold'>{kanban?.modelo?.cantidad} SETS</span>

                        <span className='underline text-xs'>N° KANBAN:</span>
                        <span className="text-xs">{kanban?.codigo}</span>

                        {kanban?.estado?.linea?.id && <span className="text-xs font-semibold mt-1">LINEA {kanban?.estado?.linea?.codigo}</span>}
                    </div>
                </div>
            </>
        )
    }

    if (kanban?.codigo?.substr(0, 1) == "M") {

        return (
            <>
                <style>
                    {/* {`@media print {body{margin:auto;  margin:0; margin-left:20px;} div.saltopagina{display:block; page-break-before:always}}`} */}
                </style>

                <div className=' h-[70mm] w-[200mm] items-start justify-center border-2 border-black relative mb-3 flex'>
                    <div className='w-[55mm] p-4 h-full'>
                        <span className='block w-full text-lg font-bold text-center '>{kanban?.codigo}</span>
                        <QRCode className="w-full h-full" value={kanban?.codigo || ""} />
                    </div>

                    <div className=' w-[98mm] h-full flex flex-col items-center '>

                        <div className='w-full text-3xl border-b border-black font-semibold'>
                            <span>{getTitleKanban(kanban?.codigo)}</span>
                        </div>

                        <div className='flex items-start w-full h-full justify-between py-1'>
                            <div className='w-[100%] h-full flex flex-col  justify-between'>
                                <div className='flex flex-col items-start justify-between h-full'>
                                    <div className="flex flex-col">
                                        <span className='underline text-lg font-semibold'>MATERIAL:</span>
                                        <span className="text-2xl">BRAIN-NAPEN-50</span>
                                    </div>
                                    {/* <span className="text-xs">{kanban?.modelo?.descripcion}</span> */}

                                    <div className="flex flex-col">
                                        <span className='underline text-lg font-semibold'>DESCRIPCIÓN:</span>
                                        <span className="text-xl">BRAIN NAUB Perf. 5T (Nylon)</span>
                                    </div>

                                    <div className="flex flex-col">
                                        <span className='underline text-lg font-semibold'>CANTIDAD:</span>
                                        <span className="text-xl">22,7 ML / 31,87 M2</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className=' w-[50mm] h-full p-2 flex flex-col relative justify-between'>
                        {/* <div className='absolute h-full  border-dotted border-l-2 border-l-black border-r-0 w-[2px] top-0 left-0 bg-transparent border-transparent'></div> */}

                        <div className="flex flex-col h-full">
                            <span className='underline font-bold'>CÓDIGO INTERNO:</span>
                            <span className='text-5xl font-semibold'>C5</span>
                        </div>

                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <span className='underline font-bold'>PROVEEDOR:</span>
                                <span className='text-lg'>TAILANDIA</span>
                            </div>

                            <div className="flex flex-col">
                                <span className='underline font-bold'>UBICACIÓN:</span>
                                <span className='text-lg'>CARRO-B</span>
                            </div>

                            <div className="flex flex-col">
                                <span className='underline font-bold'>KANBAN:</span>
                                <span className='text-lg'>M240221203825818</span>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        )

    }
}
