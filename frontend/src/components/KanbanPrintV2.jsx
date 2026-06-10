import { meses } from "../utils/Constants";
// import QRCode from "react-qr-code";
import { QRCode } from 'antd';
import arrow from "../assets/arrow.png";

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

export default function KanbanPrintV2({ kanban }) {

    if (kanban?.codigo?.substr(0, 1) == "P") {
        // console.log(kanban)
        return (
            <>
                <style>
                    {`@media print {body{margin:auto;  margin:0; margin-left:20px; padding-top:10px;} div.saltopagina{display:block; page-break-before:always}}`}
                </style>

                <div className=' h-[70mm] w-[200mm] items-start justify-center border-2 border-black relative mb-3 flex print:flex'>
                    <div className='w-[80mm] h-full flex flex-col relative'>
                        {/* <BsArrowReturnLeft className="absolute text-9xl opacity-70 text-gray-300 right-10 bottom-0" /> */}
                        <img src={arrow} className="w-40 h-40 absolute opacity-40 bottom-10 right-12" />
                        <div className="h-[60%] relative flex border-b-2 px-1 border-black">
                            {/* <span>PC</span> */}
                            {/* <FaArrowRight className="absolute top-[50%] text-5xl right-20 text-gray-400 opacity-50" /> */}
                            {/* <FaArrowTurnDown className="absolute top-[80%] text-5xl right-0 text-gray-400 opacity-50" /> */}
                            <div className="border-r-2 w-[70%] px-1 h-full border-black ">
                                <span>PC</span>
                            </div>
                            <div className="px-1 h-full border-black w-[30%]">
                                <span>QC CORTE</span>
                            </div>
                        </div>

                        <div className="flex relative items-center h-[40%] justify-between w-full">
                            {/* <FaArrowTurnDown className="absolute top-[50%] text-5xl right-32 text-gray-400 opacity-50 rotate-90" /> */}

                            <div className="border-r-2 px-1 h-full border-black w-full">
                                <span>QC LINEA</span>
                            </div>
                            <div className="px-1 h-full border-black w-full">
                                <span>CORTE</span>
                            </div>
                        </div>
                    </div>

                    <div className='w-[75mm] h-full flex flex-col items-center  border-r-2 border-black'>
                        {/* <div className='w-full !py-0 !my-0 text-3xl border-b border-black font-semibold'> */}
                        {/* <span className="text-xl border-b border-black font-semibold block w-full px-2 !py-0">{getTitleKanban(kanban?.codigo)}</span> */}
                        {/* </div> */}

                        <div className='flex items-start w-full h-full justify-between '>
                            {/* <div className='flex w-[20%] flex-col h-full justify-center py-2 items-center gap-2 px-1 '> */}
                            {/* <span className={`${kanban?.modelo?.nombre.length <= 4 ? 'text-5xl' : 'text-4xl'} font-semibold text-center block w-full`}>{kanban?.modelo?.nombre}</span> */}

                            {/* <QRCode className="mt-0" type="svg" size={130} bordered={false} value={kanban?.codigo || ""} /> */}

                            {/* </div> */}
                            <div className='w-[100%] h-full flex flex-col justify-between !items-start border-l-2 border-black'>
                                <div className="flex flex-col w-full">
                                    <div className='w-full flex items-center justify-center bg-black text-white font-bold text-2xl px-2 !text-center'><span>{kanban?.codigo}</span></div>
                                    <span className="text-xl text-center border-b border-black font-semibold block w-full px-2 !py-0">{getTitleKanban(kanban?.codigo)}</span>
                                    {/* <div className='flex items-center justify-between border-b border-black px-1 !w-full '>
                                        <span className='text-xl text-center border-r border-black !py-0 block w-full'>LINEA: <span className="text-xl font-bold">M1</span></span>
                                        <span className='text-xl text-center block w-full px-1'>LOTE: <span className="text-xl font-bold">8/10 A</span></span>

                                    </div> */}

                                    {/* <div className='flex flex-col px-1'>
                                        <span className='text-sm'>DESCRIPCIÓN:</span>
                                        <span className="text-sm font-semibold">{kanban?.modelo?.descripcion}</span>
                                    </div> */}
                                    <div className='flex flex-col w-full '>
                                        <span className={`${kanban?.modelo?.nombre.length <= 4 ? 'text-8xl' : 'text-7xl mt-2'} !py-0 font-semibold text-center block `}>{kanban?.modelo?.nombre}</span>
                                    </div>


                                </div>
                                <div className='flex flex-col w-full '>
                                    {/* <span className='underline text-xs'>COMPONENTES:</span> */}
                                    <div className='flex items-center  w-full justify-between '>
                                        <div className='flex flex-col  border border-l-0 border-black border-b-0 w-full text-center'>
                                            <span className='border-b block w-full border-black text-xs'>H/R</span>
                                            <span className="text-xs font-bold">{kanban?.modelo?.hr}</span>
                                        </div>

                                        <div className='flex flex-col border w-full border-black border-b-0 border-l-0 text-center'>
                                            <span className='border-b block w-full border-black text-xs'>CTR H/R</span>
                                            <span className="text-xs font-bold">{kanban?.modelo?.ctrhr}</span>
                                        </div>

                                        <div className='flex flex-col border w-full border-black border-b-0 border-r-0 border-l-0 text-center'>
                                            <span className='border-b block w-full border-black text-xs'>A/R</span>
                                            <span className="text-xs font-bold">{kanban?.modelo?.ar}</span>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-center justify-between border-t border-black"> */}
                                    <div className='flex items-center gap-2 border-t border-black px-1'>
                                        <span className='text-xl'>MES: </span>
                                        <span className='text-xl font-semibold'>{meses.filter(mes => mes.value == kanban?.mes)[0]?.label.toUpperCase()}</span>
                                    </div>

                                    <div className='flex items-center gap-2 px-1 border-t border-black'>
                                        <span className=' text-xl'>CANTIDAD: </span>
                                        <span className='text-xl font-semibold'>{kanban?.modelo?.cantidad} SETS</span>
                                    </div>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='w-[45mm] h-full flex flex-col items-center justify-between relative'>

                        <span className={`text-sm !py-0 text-center block `}>LINEA</span>
                        <span className={`text-5xl !py-0 font-semibold text-center block `}>M{kanban?.linea}</span>

                        <div className='!py-0 !my-0 flex w-full items-center justify-center px-1 border-y border-black'>
                            <QRCode className="mt-0 !py-0 " type="svg" size={160} bordered={false} value={kanban?.codigo || ""} />
                        </div>
                        <span className="font-bold text-xl text-center bg-black w-full text-white">LOTE : {kanban.secuencia}/{kanban.cantidad} {kanban.lote}</span>
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
