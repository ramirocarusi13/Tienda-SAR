import Loader from "@components/Loader";
import { getStockPlanSemanal } from "@services/PcService";
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const columns = [
    { columnId: "cobertura", width: 50 },
    { columnId: "stock_plan", width: 50 },
    { columnId: "stock_produccion", width: 50 },
    { columnId: "stock_buffer", width: 60 },
    { columnId: "stock_buffer_corte", width: 50 },
    { columnId: "stock_dollys", width: 55 },
    { columnId: "stock_racks", width: 55 },
    { columnId: "total", width: 50 },
    { columnId: "consumo", width: 50 },
];

const headerRow = {
    rowId: "header",
    height: 30,
    cells: [
        { type: "header", text: "COB.", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "PLAN", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "ASSY", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "COSTU", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "CORTE", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "DOLLYS", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "RACKS", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "TOTAL", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "CONS.", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
    ]
}

export default function TableStockPlanSemanal({ refetch }) {

    const [rows, setRows] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => { if (isVisible) { getRows() } }, [refetch, isVisible])

    const getRows = async () => {
        setIsLoading(true)
        const data = await getStockPlanSemanal()

        const rows = []
        let cells = []
        let bgColor = ''

        rows.push({
            rowId: "header2",
            height: 20,
            cells: [
                { type: "header", text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
                { type: "header", text: "", colspan: 2, className: "!text-sm font-semibold text-center flex items-center justify-center !bg-orange-500 !text-white" },
                { type: "header", text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-orange-500 !text-white" },
                { type: "header", colspan: 2, text: "BUFFER", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-500 !text-white" },
                { type: "header", text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-500 !text-white" },
                { type: "header", colspan: 2, text: "PT", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-yellow-500 !text-white" },
                { type: "header", text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-500 !text-white" },
                { type: "header", text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
                { type: "header", text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
            ]
        })

        rows.push(headerRow)

        data?.data?.map((d, idx) => {
            d?.modelos?.map((m, idxx) => {
                cells = []
                bgColor = idxx % 2 == 0 ? 'bg-slate-300' : ''
                cells.push({ nonEditable: true, type: "text", text: `${m?.cobertura}`, className: `${m.cobertura >= 6 ? 'bg-green-500' : (m.cobertura >= 3 ? 'bg-yellow-400' : 'bg-red-500')} font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.stock_plan}`, className: `${bgColor} font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.stock_produccion}`, className: `${bgColor} font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.stock_buffer}`, className: `${bgColor} font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.stock_buffer_corte}`, className: `${bgColor} font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.stock_dollys}`, className: `bg-orange-100 font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.stock_racks}`, className: `bg-orange-100 font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.total}`, className: `bg-slate-400 font-semibold !text-sm` })
                cells.push({ nonEditable: true, type: "text", text: `${m?.consumo || 0}`, className: `bg-slate-400 font-semibold !text-sm` })
                rows.push({ rowId: `${d.modelo}-${idxx}-${idx}`, cells: cells, height: 20 })
            })

            rows.push({
                rowId: `t${idx}`,
                cells: [{ type: 'text', nonEditable: true, colspan: 9, text: '', className: 'bg-slate-400' }],
                height: 25
            })

            rows.push({
                rowId: `s${idx}`,
                cells: [{ type: 'text', nonEditable: true, colspan: 9, text: '', className: 'bg-blue-400' }],
                height: 5
            })

        })

        setRows(rows)
        setIsLoading(false)
    }

    return <div className={` sticky right-0  ${isVisible ? 'w-full bg-white p-1' : 'w-[50px] h-full'}`}>
        {!isVisible && <button onClick={() => setIsVisible(true)} className="text-xs px-2 py-2 bg-green-500 mr-1 font-bold"><IoIosArrowBack className="text-xl font-bold" /></button>}

        <div className={`flex items-center gap-1 justify-center bg-yellow-100 mb-1 ${!isVisible && 'hidden'}`}>
            <button onClick={() => setIsVisible(false)} className="text-xs px-1 py-0 bg-orange-500 mr-1 flex gap-2 items-center">OCULTAR <IoIosArrowForward className="font-bold text-base" /></button>
            <span className="text-sm font-bold block w-full py-1 text-center">STOCK</span>
            <button onClick={() => getRows()} className="text-xs px-1 py-0 bg-green-500 mr-1">ACTUALIZAR</button>

        </div>
        {!isLoading && isVisible &&
            <ReactGrid
                className='w-full'
                rows={rows}
                columns={columns}
                disableVirtualScrolling={true}
            />
        }

        {isLoading && <div className="flex items-center justify-center w-full mt-5"><Loader /></div>}
    </div>
}
