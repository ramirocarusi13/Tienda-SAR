import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { formatDate } from "@utils/Utils";
import { formatDateTime, formatTime, getFullDay, getFullMonth } from "../../utils/Utils";

const columns = [
    { columnId: "lectra", width: 60, editable: false },
    { columnId: "dado", width: 210, editable: false },
    { columnId: "material", width: 260, editable: false },
    { columnId: "duracion", width: 90, editable: false },
    { columnId: "fin_estimado", width: 150, editable: false },
    { columnId: "inicio", width: 150 },
    { columnId: "fin", width: 150 },
    { columnId: "demora", width: 120},
];

const headerRow = {
    rowId: "header",
    height: 50,
    cells: [
        { type: "header", nonEditable: true, text: "LECTRA", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", nonEditable: true, text: "DADO", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", nonEditable: true, text: "MATERIAL", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", nonEditable: true, text: "DURACIÓN", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", nonEditable: true, text: "FIN ESTIMADO", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "INICIO", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "FIN", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
        { type: "header", text: "DEMORA (MIN.)", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-400 !text-white" },
    ]
};

const applyChangesToModels = (changes, prevData) => {


    changes.forEach((change) => {

        if (isNaN(parseInt(change.newCell.text))) {
            return
        }

        const indexRow = change.rowId
        const fieldName = change.columnId;

        let dataToChange;
        if (fieldName == 'inicio' || fieldName == 'fin') {
            const [dia, mes, anioHora] = change.newCell.text.split("/");
            const [anio, hora] = [anioHora.split(" ")[0], anioHora.split(" ")[1]];
            const fecha = new Date(`${anio}-${mes}-${dia}T${hora}:00`);

            dataToChange = `${fecha.getFullYear()}-${getFullMonth(fecha)}-${getFullDay(fecha, true)} ${formatTime(fecha)}:00.000`
        } else {
            dataToChange = change.newCell.text
        }

        const data = prevData.find(p => p.id == indexRow)
        if (data) {
            data[fieldName] = dataToChange
            data['edito'] = true
        }
    });

    return [...prevData];
};

export default function TableModificarTiempos({ plan, setPlan, title = '' }) {

    const handleChanges = (changes) => {
        setPlan((prevData) => applyChangesToModels(changes, prevData))
    };

    const getRows = () => {

        const rows = []
        rows.push(headerRow)

        plan?.map((dado, idx) => {

            rows.push({
                rowId: dado?.id,
                cells: [
                    { type: 'text', nonEditable: true, text: dado.lectra + "", className: 'bg-slate-300  !text-center flex items-center justify-center' },
                    { type: 'text', nonEditable: true, text: dado?.dado, className: 'bg-slate-300 flex items-center justify-center' },
                    { type: 'text', nonEditable: true, text: dado?.material, className: 'bg-slate-300 flex items-center justify-center' },
                    { type: 'text', nonEditable: true, text: dado?.duracion, className: 'bg-slate-300 flex items-center justify-center' },
                    { type: 'text', nonEditable: true, text: dado?.fin_estimado ? formatDateTime(dado?.fin_estimado) : '', className: 'bg-slate-300 flex items-center justify-center' },
                    { type: 'text', text: dado?.inicio ? formatDateTime(dado?.inicio) : '', className: 'bg-green-200 flex items-center justify-center' },
                    { type: 'text', text: dado?.fin ? formatDateTime(dado?.fin) : '', className: 'bg-green-200 flex items-center justify-center' },
                    { type: 'text',  text: dado?.demora ? dado?.demora : '', className: 'bg-green-200 flex items-center justify-center' },
                ],
                height: 25
            })

            // rows.push({
            //     rowId: `s${idx}`,
            //     cells: [{ type: 'text', nonEditable: true, colspan: 4, text: '', className: 'bg-blue-400' }],
            //     height: 5
            // })

            // totalTm = 0
            // totalTt = 0
        })

        return rows
    }

    const rows = getRows();

    return <div className={`p-0 w-full`}>
        <span className={`text-sm font-bold block w-full py-1 text-center mb-1`}>{title}</span>
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
