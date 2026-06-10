import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

const columns = [
    { columnId: "modelo1", width: 100, editable: false },
    // { columnId: "minimo", width: 180 },
    { columnId: "ptopedido", width: 180 },
    { columnId: "consumo", width: 180 },
];

const headerRow = {
    rowId: "header",
    cells: [
        { type: "header", text: "MODELO" },
        // { type: "header", text: "MINIMO BUFFER" },
        { type: "header", text: "PTO. PED. BUFFER SETS" },
        { type: "header", text: "CONSUMO DIARIO SETS" },
    ]
};

const applyChangesToModels = (changes, prevModel) => {
    changes.forEach((change) => {
        const modelIndex = change.rowId;
        const fieldName = change.columnId;
        prevModel[modelIndex][fieldName] = change.newCell.text;
    });

    return [...prevModel];
};

export default function TableMinimosModelo({ modelos, setModelos }) {

    const handleChanges = (changes) => {
        setModelos((prevModel) => applyChangesToModels(changes, prevModel))
    };

    const getRows = () => [
        headerRow,
        ...modelos?.map((modelo, idx) => ({
            rowId: idx,
            cells: [
                { type: "text", text: modelo?.modelo },
                // { type: "text", text: modelo?.minimo },
                { type: "text", text: modelo?.ptopedido },
                { type: "text", text: modelo?.consumo },
            ]
        }))
    ];

    const rows = getRows();

    return <ReactGrid
        rows={rows}
        columns={columns}
        // stickyLeftColumns={1}
        onCellsChanged={handleChanges}
    // onContextMenu={}
    />;
}
