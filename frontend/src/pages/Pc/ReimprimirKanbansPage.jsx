import { Select, Table, Tag } from 'antd';
import { useRef, useState } from 'react';
import { TiPrinter } from "react-icons/ti";
import { useReactToPrint } from 'react-to-print';
import KanbanPrintV2 from "../../components/KanbanPrintV2";
import KanbanPrint from "../../components/KanbanPrint";
import SelectModelo from '../../components/SelectModelo';
import { filterKanbansDia } from '../../services/PcService';
import { diferenciaTiempo, formatDateTime } from '../../utils/Utils';

const toTime = o => {
    const s = o?.estado?.updated_at;
    return s ? new Date(s).getTime() : 0;
};

const drawEstado = (estado) => {
    let color = ''
    let newEstado = ''

    if (estado == 'GENERADO') {
        color = 'cyan-inverse'
        newEstado = 'EN CORTE'
    } else if (estado == 'EN BUFFER') {
        color = 'orange-inverse'
        newEstado = 'EN BUFFER COSTURA'
    } else if (estado == 'SUB ASSY') {
        color = 'blue-inverse'
        newEstado = 'EN LINEA'
    } else if (estado == 'FINALIZADO') {
        color = 'green-inverse'
        newEstado = 'FINISH GOOD'
    }

    return <Tag color={color}>{newEstado}</Tag>
}

export default function ReimprimirKanbansPage() {

    const [kanbans, setKanbans] = useState([])
    const [kanbanPrint, setKanbanPrint] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filters, setFilters] = useState({
        modelo: null,
        estado: 3
    })

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const fetchKanbans = async () => {
        setIsLoading(true)
        const data = await filterKanbansDia(filters)
        const kanbansData = data?.data?.sort((a, b) => toTime(b) - toTime(a))
        console.log(kanbansData)

        setKanbans(kanbansData)
        setIsLoading(false)
    }

    const printKanban = () => {
        setTimeout(() => {
            handlePrint()
        }, [200])
    }

    return (
        <div className='flex flex-col w-full'>

            <div className='flex items-center gap-2 border-b-2 border-gray-100 pb-2 mb-2'>
                <div className='flex items-center gap-2 w-full'>
                    <span>Modelo</span>
                    <SelectModelo
                        allowClear={true}
                        className='w-full !py-0'
                        classNameSelect='!h-8 !py-0 !text-xl'
                        modoTactil={false}
                        defaultValue={filters.modelo}
                        onChange={value => setFilters({ ...filters, modelo: value })}
                    />
                </div>

                {/* <div className='flex items-center gap-2 w-full'>
                    <span>Estado</span>
                    <Select
                        allowClear
                        className='w-full !py-0'
                        classNameSelect='!h-14 !py-0 !text-xl'
                        options={[
                            { label: '', value: null },
                            // { label: 'EN CORTE', value: 7 },
                            // { label: 'EN BUFFER COSTURA', value: 2 },
                            { label: 'EN LINEA', value: 3 },
                            // { label: 'FINISH GOOD', value: 6 },
                        ]}
                        defaultValue={filters.estado}
                        onChange={value => setFilters({ ...filters, estado: value })}
                    />
                </div> */}
                <button className='py-2 px-10 bg-orange-300' onClick={() => fetchKanbans()}>Buscar</button>
            </div>

            <Table
                dataSource={kanbans}
                loading={isLoading}
                rowKey={r => r?.codigo}
                size="small"
                pagination={false}
                columns={[
                    {
                        title: 'Código',
                        dataIndex: 'codigo',
                        key: 'codigo'
                    },
                    {
                        title: 'Estado',
                        dataIndex: 'estado',
                        key: 'estado',
                        render: (_, r) => {
                            return drawEstado(r?.estado?.estado?.descripcion)
                        }
                    },
                    {
                        title: 'Modelo',
                        dataIndex: 'modelo',
                        key: 'modelo',
                        render: (_, r) => {
                            return r?.modelo?.nombre
                        }
                    },
                    {
                        title: 'Salida Buffer',
                        dataIndex: 's_buffer',
                        key: 's_buffer',
                        render: (_, r) => {
                            return formatDateTime(r?.estado?.updated_at)
                        }
                    },
                    {
                        title: 'Tiempo',
                        dataIndex: 'tiempo',
                        key: 'tiempo',
                        render: (_, r) => {
                            return "Hace " + diferenciaTiempo(r?.estado?.updated_at)
                        }
                    },
                    // {
                    //     title: 'Lote',
                    //     dataIndex: 'lote',
                    //     key: 'lote',
                    //     render: (_, r) => `${r?.secuencia}/${r?.cantidad} ${r?.lote}`
                    // },
                    // {
                    //     title: 'Linea',
                    //     dataIndex: 'linea',
                    //     key: 'linea',
                    //     render: (text) => {
                    //         return `M${text}`
                    //     }
                    // },
                    {
                        title: 'Reimprimir',
                        dataIndex: 'reimprimir',
                        key: 'reimprimir',
                        render: (_, r) => {
                            if (r?.estado != 'FINALIZADO') {
                                return <button
                                    onClick={() => {
                                        setKanbanPrint([r])
                                        printKanban()
                                    }}
                                    className='py-0 px-4 text-sm flex items-center gap-2 font-normal bg-orange-200 hover:opacity-80 hover:cursor-pointer'><TiPrinter /> Imprimir</button>
                            }
                        }
                    }

                ]}
            />

            <div className="w-full h-full hidden print:flex" ref={componentRef}>
                {kanbanPrint?.map((k, idx) => {
                    return <KanbanPrint kanban={k} key={idx} />
                    // return <KanbanPrintV2 kanban={k} key={idx} />
                })}
            </div>
        </div>
    )
}
