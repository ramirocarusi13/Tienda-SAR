
import reversoKanbanImg from "@assets/reverso_kanban.jpg"

export default function KanbanReversoPrint({ kanban }) {

    // if (!kanban) {
    //     return <></>
    // }

    return (
        <>
            <style>
                {`@media print {body{margin:auto;  margin:0; margin-left:20px;  padding-top:10px;} div.saltopagina{display:block; page-break-before:always}}`}
            </style>

            <div className=' flex-col items-start justify-center  print:flex'>
                <img src={reversoKanbanImg} className="w-full bg-red-500" />
                <img src={reversoKanbanImg} className="w-full bg-yellow-500" />
                <img src={reversoKanbanImg} className="w-full bg-sky-500" />
                <img src={reversoKanbanImg} className="w-full bg-success" />
            </div>

        </>
    )
}
