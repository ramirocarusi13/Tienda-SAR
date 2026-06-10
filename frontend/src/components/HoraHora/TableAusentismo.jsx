
import { ReactGrid } from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";
import { useEffect, useState } from "react";
import { siglaJerarquia } from "../../utils/Constants";

const columns = [
    { columnId: "rol", width: 50, editable: false },
    { columnId: "email", width: 200, editable: false },
    { columnId: "linea_id", width: 90, editable: false },
    { columnId: "estado", width: 50 },
    { columnId: "comentario", width: 250 },
];

const headerRow = {
    rowId: "header",
    height: 30,
    cells: [
        { type: "header", nonEditable: true, text: "Rol", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-gray-100 !text-black" },
        { type: "header", nonEditable: true, text: "Apellido y Nombre", className: " !text-sm font-semibold text-center flex items-center justify-center !bg-gray-100 !text-black" },
        { type: "header", nonEditable: true, text: "Linea", className: " !text-sm font-semibold text-center flex items-center justify-center !bg-gray-100 !text-black" },
        { type: "header", text: "O/X/L", className: "!text-sm font-semibold !text-center flex items-center justify-center !bg-gray-100 !text-black" },
        { type: "header", text: "Comentario", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-gray-100 !text-black" },
    ]
};

const applyChangesToModels = (changes, prevModel, linea = false) => {


    changes.forEach((change) => {

        const indexRow = change.rowId
        const fieldName = change.columnId;
        // const temp = indexRow?.split("_") 

        const data = prevModel.filter(p => p.id == parseInt(indexRow))

        if (fieldName == 'estado' && (change.newCell.text?.toUpperCase() != 'X' && change.newCell.text?.toUpperCase() != 'O' && change.newCell.text?.toUpperCase() != 'L')) {
            return [...prevModel]
        }
        // console.log(fieldName)

        data.forEach(m => {
            m[fieldName] = change.newCell.text?.toUpperCase()
        })
    });



    return [...prevModel];
};

export default function TableAusentismo({ users, setUsers, usersCompleto, withHeader = true, linea = false, headerName = '' }) {

    const [rows, setRows] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const handleChanges = (changes) => {
        setUsers((prevModel) => applyChangesToModels(changes, prevModel, linea, usersCompleto))
    };

    const getRows = async () => {
        setIsLoading(true)
        const rows = []
        let cells = []
        let bgColor = ''

        if (headerName != '') {
            rows.push({
                rowId: `header_${headerName}`,
                height: 20,
                cells: [
                    { type: "header", nonEditable: true, colspan: 5, text: headerName, className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-600 !text-white" },
                ]
            })
        }

        if (withHeader) {
            rows.push(headerRow)
        }

        let lineaActual = '', lineaAnterior = ''

        users?.map((modelo, idx) => {

            lineaActual = (modelo?.sublinea == 1 ? "S" : "M") + modelo?.linea_id

            if (withHeader && (lineaActual != lineaAnterior && lineaAnterior != '')) {
                rows.push({
                    rowId: `header_${idx}`,
                    height: 20,
                    cells: [
                        { type: "header", nonEditable: true, colspan: 5, text: lineaActual, className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-600 !text-white" },
                        { type: "header", nonEditable: true, text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-600 !text-white" },
                        { type: "header", nonEditable: true, text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-600 !text-white" },
                        { type: "header", nonEditable: true, text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-600 !text-white" },
                        { type: "header", nonEditable: true, text: "", className: "!text-sm font-semibold text-center flex items-center justify-center !bg-blue-600 !text-white" },
                    ]
                })
            }

            if (modelo?.estado?.toUpperCase() == 'O') {
                bgColor = 'bg-green-500'
            } else if (modelo?.estado?.toUpperCase() == 'X') {
                bgColor = 'bg-red-500'
            } else if (modelo?.estado?.toUpperCase() == 'L') {
                bgColor = 'bg-yellow-400'
            } else {
                bgColor = ''
            }

            const rol = siglaJerarquia[parseInt(modelo?.rol)]

            cells.push({ type: "text", nonEditable: true, text: rol, editable: false, className: ` font-semibold !text-sm` })
            cells.push({ type: "text", nonEditable: true, text: modelo?.email?.toUpperCase(), editable: false, className: ` font-semibold !text-sm` })
            if (linea) {
                cells.push({ type: "text", nonEditable: true, text: modelo?.operacion, editable: false, className: ` font-semibold !text-sm` })
            } else {
                cells.push({ type: "text", nonEditable: true, text: modelo?.linea_id ? ((modelo?.sublinea == "1" ? "S" : "M") + modelo?.linea_id) : "", editable: false, className: ` font-semibold !text-sm` })
            }
            cells.push({ type: "text", text: modelo?.estado || "", className: `${bgColor} !text-center font-semibold !text-sm` })
            cells.push({ type: "text", text: modelo?.comentario || "", className: ` font-semibold !text-sm` })
            rows.push({ rowId: `${modelo?.id}_${modelo?.user_id}`, cells: cells, height: 20 })
            cells = []

            lineaAnterior = lineaActual
        })

        setRows(rows)
        setIsLoading(false)
    }

    useEffect(() => {
        getRows()
    }, [users])


    return <div className={`flex flex-col gap-1 items-start w-full`}>

        {/* <div className="flex items-center gap-2">
            <button onClick={() => saveModels()} className="bg-green-400 px-4 py-1">Guardar modelos</button>
            {isLoading && <Spin size='large' />}
        </div> */}

        {!isLoading &&
            <ReactGrid
                className={`!w-full `}
                rows={rows}
                columns={columns}
                onCellsChanged={handleChanges}
                disableVirtualScrolling={true}
            />
        }
    </div>
}
