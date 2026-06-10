// import { useQuery } from '@tanstack/react-query'
import { Table } from "antd";
import { useEffect, useState } from "react";
import { GrUpdate } from "react-icons/gr";
import ModalSelectLinea from "../../components/ModalSelectLinea";
import { getAndonDefectoLineaHoraHora } from "../../services/AndonService";
import { getItemLocalStorage } from "../../storage/UserAsyncStorage";


export default function AndonDefectosLineaHoraHoraPage() {

    // const query = useQuery({ queryKey: [`estado_lectra_${lectra}`], queryFn: fetchData, staleTime: 1000, refetchInterval: 60000 })
    const [dataLinea, setDataLinea] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isModalLineaVisible, setIsModalLineaVisible] = useState(false)
    const [lineaActiva, setLineaActiva] = useState(null)

    const fetchData = async (linea = null) => {
        setIsLoading(true)
        const data = await getAndonDefectoLineaHoraHora(linea ? linea : lineaActiva)
        setDataLinea(data?.data)
        setIsLoading(false)

    }

    useEffect(() => {
        verificaLineaActiva()
    }, [])

    useEffect(() => {

        if (!isModalLineaVisible) {
            verificaLineaActiva()
        }
    }, [isModalLineaVisible])

    const verificaLineaActiva = async () => {
        const data = await getItemLocalStorage("linea")
        if (!data) {
            setIsModalLineaVisible(true)
            return false
        } else {
            setLineaActiva(JSON.parse(data))
            setTimeout(() => {
                fetchData(JSON.parse(data))
            }, 200)
        }
    }

    return (
        <div>
            <ModalSelectLinea isVisible={isModalLineaVisible} setIsVisible={setIsModalLineaVisible} />

            <span className="font-bold text-center block w-full text-4xl bg-yellow-300 text-black py-2">REPORTE HORA HORA DEFECTOS</span>
            <Table
                loading={isLoading}
                rowKey={r => r.id}
                dataSource={dataLinea}
                bordered
                pagination={false}
                rowClassName="text-2xl font-semibold border-black"
                columns={[
                    {
                        className: "text-2xl",
                        title: 'INTERVALO',
                        dataIndex: 'hora_desde',
                        render: (_, r) => {

                            return `${r?.hora_desde?.substr(0, 8)} - ${r?.hora_hasta?.substr(0, 8)}`
                        }
                    },
                    {
                        className: "text-2xl",
                        title: 'INTERNOS',
                        dataIndex: 'cantidad',
                        render: (_, r) => {
                            return r?.defectos?.find(d => d?.tipo_falla != 'E')?.cantidad || 0
                        }
                    },
                    {
                        className: "text-2xl",
                        title: 'EOL',
                        dataIndex: 'cantidad2',
                        render: (_, r) => {
                            return r?.defectos?.find(d => d?.tipo_falla == 'E')?.cantidad || 0
                        }
                    },
                    {
                        className: "text-2xl bg-gray-300",
                        title: 'TOTAL',
                        dataIndex: 'total',
                        render: (_, r) => {
                            return <span className="font-bold">{r?.defectos?.reduce((p, c) => p + parseInt(c?.cantidad), 0)}</span>
                        }
                    }
                ]}

                summary={(pageData) => {
                    let totalInternos = 0;
                    let totalEOL = 0;

                    pageData.forEach(({ defectos }) => {
                        totalInternos = totalInternos + parseInt(defectos?.find(d => d?.tipo_falla != 'E')?.cantidad || 0)
                        totalEOL = totalEOL + parseInt(defectos?.find(d => d?.tipo_falla == 'E')?.cantidad || 0)
                    });

                    return (
                        <>
                            <Table.Summary.Row className="">
                                <Table.Summary.Cell className="bg-gray-300" index={0}><span className=" font-bold text-2xl">TOTALES</span></Table.Summary.Cell>
                                <Table.Summary.Cell className="bg-gray-300" align="left" index={1}><span className=" font-bold text-2xl"> {totalInternos}</span></Table.Summary.Cell>
                                <Table.Summary.Cell className="bg-gray-300" align="left" index={2}><span className=" font-bold text-2xl"> {totalEOL}</span></Table.Summary.Cell>
                                <Table.Summary.Cell className="bg-gray-300" align="left" index={3}><span className=" font-bold text-2xl"> {totalInternos + totalEOL}</span></Table.Summary.Cell>
                            </Table.Summary.Row>

                        </>
                    );
                }}
            />


            <button onClick={() => fetchData()} className="w-full text-3xl py-1 bg-orange-300 font-semibold flex items-center justify-center gap-2 mt-1">RECARGAR <GrUpdate className="text-xl" /></button>

        </div>
    )
}
