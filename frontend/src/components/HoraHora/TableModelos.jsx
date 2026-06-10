import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { formatDate } from "@utils/Utils";
import { fetchModelosHoraHora, setModelosHoraHora } from "../../services/HoraHoraService";
import { useState } from "react";
import { useEffect } from "react";
import { Spin } from "antd";

const columns = [
    // { columnId: "linea", width: 50, editable: false },
    { columnId: "modelo", width: 200, editable: false },
    { columnId: "plan", width: 130 },
    { columnId: "real", width: 130 },
];

const headerRow = {
    rowId: "header",
    height: 100,
    cells: [
        // { type: "header", nonEditable: true, text: "LINEA", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", nonEditable: true, text: "Modelo", className: " !text-3xl font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "Plan", className: "!text-3xl font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "Real", className: "!text-3xl font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
    ]
};

const applyChangesToModels = (changes, prevModel, mod) => {


    changes.forEach((change) => {

        if (isNaN(parseInt(change.newCell.text))) {
            return
        }

        if (parseInt(change.newCell.text) < 0) {
            return
        }

        if (change.newCell.text.search(".") >= 0 && change.newCell.text.indexOf(".") >= 0) {
            return
        }

        const indexRow = change.rowId.split("|")
        const linea = indexRow[0];
        const modelo = indexRow[1];
        const fieldName = change.columnId;

        const data = prevModel.filter(p => p.modelo == modelo)

        data.forEach(m => {
            if (m.modelo == modelo) {
                m[fieldName] = change.newCell.text
                m['editado'] = true
            }
        })
    });

    return [...prevModel];
};

export default function TableModelos({ datosTablero }) {
    const [rows, setRows] = useState([])
    const [modelos, setModelos] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleChanges = (changes) => {
        setModelos((prevModel) => applyChangesToModels(changes, prevModel))
    };

    useEffect(() => {
        getRows(modelos)
    }, [modelos])

    const getRows = async (mods = []) => {
        setIsLoading(true)
        const rows = []
        let cells = []
        let totalPlan = 0, totalReal = 0
        let bgColor = ''
        rows.push(headerRow)

        let data;

        if (mods?.length > 0) {
            data = { data: mods }
        } else {
            data = await fetchModelosHoraHora({ linea: datosTablero.linea, turno: datosTablero.turno, fecha: datosTablero.fecha })
            setModelos(data?.data)
        }

        data?.data?.map((modelo, idx) => {

            if (modelo?.editado) {
                bgColor = 'bg-red-300'
            } else {
                bgColor = ''
            }

            cells.push({ type: "text", nonEditable: true, text: modelo?.modelo, editable: false, className: ` font-semibold !text-2xl` })
            cells.push({ type: "number", value: parseInt(modelo?.plan), className: `${bgColor} font-semibold !text-2xl` })
            cells.push({ type: "number", value: parseInt(modelo?.real), className: `${bgColor} font-semibold !text-2xl` })
            rows.push({ rowId: `${modelo.linea}|${modelo?.modelo}|${idx}`, cells: cells, height: 40 })
            cells = []

            totalPlan = totalPlan + parseInt(modelo?.plan)
            totalReal = totalReal + parseInt(modelo?.real)
        })

        rows.push({
            rowId: `t${1}`,
            cells: [
                { type: 'text', nonEditable: true, text: `TOTAL`, className: 'bg-slate-400 font-bold !text-2xl' },
                { type: 'number', nonEditable: true, value: totalPlan, className: 'bg-slate-400 font-bold !text-2xl' },
                { type: 'number', nonEditable: true, value: totalReal, className: 'bg-slate-400 font-bold !text-2xl' },
            ],
            height: 35
        })

        // rows.push({
        //     rowId: `s${idx}`,
        //     cells: [{ type: 'text', nonEditable: true, colspan: 4, text: '', className: 'bg-blue-400' }],
        //     height: 5
        // })


        setRows(rows)
        setIsLoading(false)
    }

    useEffect(() => {
        getRows()
    }, [datosTablero])


    const saveModels = async () => {
        setIsLoading(true)
        const data = await setModelosHoraHora({ modelos: modelos, data: datosTablero })
        // console.log(data)
        if (!data?.error) {
            const mods = modelos?.map(m => { return { ...m, editado: false } })
            setModelos(mods)
        }
        setIsLoading(false)
    }
    // const rows = getRows();

    return <div className={`flex flex-col gap-1 items-center justify-center w-full`}>

        <div className="flex items-center gap-2">
            <button onClick={() => saveModels()} className="bg-green-400 px-12pnpm run py-2 text-xl">Guardar modelos</button>
            {isLoading && <Spin size='large' />}
        </div>

        {!isLoading &&
            <ReactGrid
                className={`w-full !text-2xl`}
                rows={rows}
                columns={columns}
                onCellsChanged={handleChanges}
                disableVirtualScrolling={true}
            />
        }
    </div>
}
