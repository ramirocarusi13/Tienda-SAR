import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

const columns = [
    { columnId: "MODELO", width: 150, editable: false },
    { columnId: "consumo", width: 150 }
];

const headerRow = {
    rowId: "header",
    cells: [
        { type: "header", text: "MODELO" },
        { type: "header", text: "CONSUMO" }
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
export default function TableExcel({ modelos, setModelos }) {

    const handleChanges = (changes) => {
        setModelos((prevModel) => applyChangesToModels(changes, prevModel))
    };

    const getRows = () => [
        headerRow,
        ...modelos?.map((modelo, idx) => ({
            rowId: idx,
            cells: [
                { type: "text", text: modelo?.modelo },
                { type: "text", text: modelo?.consumo }
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
