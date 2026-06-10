import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { formatDate } from "@utils/Utils";

const columns = [
    { columnId: "linea", width: 50, editable: false },
    { columnId: "modelo", width: 80, editable: false },
    { columnId: "tm", width: 50 },
    { columnId: "tt", width: 50 },
];

const headerRow = {
    rowId: "header",
    height: 50,
    cells: [
        { type: "header", nonEditable: true, text: "LINEA", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", nonEditable: true, text: "MODELO", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "TM", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "TT", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
    ]
};

const applyChangesToModels = (changes, prevModel, fecha) => {


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

        const modelos = prevModel.find(p => p.fecha == fecha && p.linea == linea)

        modelos?.modelos.forEach(m => {
            if (m.modelo == modelo) {
                m[fieldName] = change.newCell.text
            }
        })
    });

    return [...prevModel];
};

export default function TablePlanSemanal({ plan, setPlan, fecha, title = '' }) {

    const handleChanges = (changes) => {
        setPlan((prevModel) => applyChangesToModels(changes, prevModel, fecha))
    };

    const getRows = () => {

        const rows = []
        let cells = []
        let totalTm = 0, totalTt = 0
        let bgColor = ''
        rows.push(headerRow)

        plan?.map((modelo, idx) => {
            modelo?.modelos?.map((m, idxx) => {
                bgColor = idxx % 2 == 0 ? 'bg-slate-300' : ''
                if (idxx == 0) {
                    cells.push({
                        type: "text", nonEditable: true, text: modelo.linea, rowspan: modelo?.modelos?.length, editable: false, className: "text-center font-semibold !text-sm flex items-center justify-center"
                    })
                } else {
                    cells.push({ type: "text", nonEditable: true, text: modelo.linea })
                }

                cells.push({ type: "text", nonEditable: true, text: m?.modelo, editable: false, className: `${bgColor} font-semibold !text-sm` })
                cells.push({ type: "text", text: m?.tm, className: `${bgColor} font-semibold !text-sm` })
                cells.push({ type: "text", text: m?.tt, className: `${bgColor} font-semibold !text-sm` })
                rows.push({ rowId: `${modelo.linea}|${m?.modelo}|${idxx}`, cells: cells, height: 20 })
                cells = []

                totalTm = totalTm + parseInt(m?.tm)
                totalTt = totalTt + parseInt(m?.tt)
            })

            rows.push({
                rowId: `t${idx}`,
                cells: [
                    { type: 'text', nonEditable: true, text: '', className: 'bg-slate-400' },
                    { type: 'text', nonEditable: true, text: `TOTAL`, className: 'bg-slate-400 font-bold' },
                    { type: 'text', nonEditable: true, text: `${totalTm}`, className: 'bg-slate-400 font-bold' },
                    { type: 'text', nonEditable: true, text: `${totalTt}`, className: 'bg-slate-400 font-bold' },
                ],
                height: 25
            })

            rows.push({
                rowId: `s${idx}`,
                cells: [{ type: 'text', nonEditable: true, colspan: 4, text: '', className: 'bg-blue-400' }],
                height: 5
            })

            totalTm = 0
            totalTt = 0
        })

        return rows
    }

    const rows = getRows();

    return <div className={`p-1`}>
        <span className={`text-sm font-bold block w-full ${fecha == formatDate(new Date()) ? ' bg-orange-500' : 'bg-yellow-100'} py-1 text-center mb-1`}>{title}</span>
        <ReactGrid
            // hideRowIndicators={false}
            className='w-full'
            rows={rows}
            columns={columns}
            onCellsChanged={handleChanges}
            disableVirtualScrolling={true}
        />
    </div>
}
