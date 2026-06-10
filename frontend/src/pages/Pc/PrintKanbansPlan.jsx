import KanbanPrint from "@components/KanbanPrint";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { fetchKanbansDia, getKanbansPlanificados } from "../../services/PcService";
import Loader from "@components/Loader"
import KanbanReversoPrint from "@components/KanbanReversoPrint"
import KanbanPrintV2 from "../../components/KanbanPrintV2";

export default function PrintKanbansPlan({ className = '' }) {

    const [kanbans, setKanbans] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const componentRef = useRef();
    // const componentRevRef = useRef();

    // useEffect(() => {
    //     fetchKanbans()
    // }, [])

    const fetchKanbans = async () => {
        setIsLoading(true)

        const data = await fetchKanbansDia()


        if (!data?.error) {
            setKanbans(data?.data)
        }
        setIsLoading(false)

        setTimeout(() => {
            handlePrint()
        }, [200])


    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    // const handlePrintReverso = useReactToPrint({
    //     content: () => componentRevRef.current,
    // });

    return (
        <div className={className}>
            <button disabled={isLoading} className="bg-yellow-400  text-sm disabled:opacity-70 disabled:cursor-not-allowed py-1" onClick={() => fetchKanbans()}>{isLoading ? <div className="flex gap-2 items-center">IMPRIMIENDO <Loader fontSize={15} /></div> : "IMPRIMIR KANBAN"}</button>

            <div className="hidden print:flex flex-col w-full mt-1" ref={componentRef}>
                {kanbans?.map((kanban, idx) => {
                    return <KanbanPrintV2 kanban={kanban} key={idx} />
                })}
            </div>

            {/* <div className="" ref={componentRevRef}>
                {kanbans?.map((kanban, idx) => {
                    if (idx % 4 == 0) {
                        return <KanbanReversoPrint key={`R_${idx}`} />
                    }
                })}
            </div> */}

        </div>
    )
}
