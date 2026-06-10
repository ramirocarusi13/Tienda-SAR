import usePartes from "@hooks/usePartes";
import { Table } from "antd";
import Loader from "@components/Loader";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaFilePdf } from "react-icons/fa";
const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

const columnsPiezas = [
    {
        title: 'N Pieza',
        dataIndex: 'codigo',
        key: 'codigo',
        render: (_, record) => record?.pieza?.codigo
    },
    {
        title: 'Cod. Int. Mat.',
        dataIndex: 'lado',
        key: 'lado',
        render: (_, record) => record?.material?.codigo_interno
    },
    {
        title: 'Cod. Mat.',
        dataIndex: 'tipo',
        key: 'tipo',
        render: (_, record) => record?.material?.codigo
    },
    {
        title: 'Nombre Mat.',
        dataIndex: 'tipo',
        key: 'tipo',
        render: (_, record) => record?.material?.nombre
    },
    {
        title: 'Kanban',
        dataIndex: 'kanban',
        key: 'kanban',
        render: (_, record) => {
            if (record?.pieza?.kanban_reposicion) {
                return <Link target="_blank" to={`${PUBLIC_URI}kanban_reposicion/${record?.pieza?.modelo?.nombre}/${record?.pieza?.kanban_reposicion}`} className="bg-transparent m-0 p-0"><FaFilePdf className="text-main" /></Link>
            }
            return ""
        }
    }

];

export default function TablePartes({ modelId }) {
    const { isLoading: isLoadingPartes, response: partes, getPartesByModel, getPiezasByParte } = usePartes()
    const [parteSeleccionada, setParteSeleccionada] = useState(null)
    const [piezas, setPiezas] = useState(null)
    const [isLoadingPiezas, setIsLoadingPiezas] = useState(false)

    useEffect(() => {
        if (modelId) {
            getPartesByModel(modelId)
            setPiezas(null)
        }
    }, [modelId])

    // console.log(partes)

    const fetchPiezas = async () => {
        setIsLoadingPiezas(true)
        const data = await getPiezasByParte(parteSeleccionada.id, true)
        // console.log(data)
        setPiezas(data)
        setIsLoadingPiezas(false)
    }

    useEffect(() => {
        if (parteSeleccionada) {
            fetchPiezas()
        }
    }, [parteSeleccionada])

    const data = [
        {
            nombre: 'Pendrive',
        }
    ]

    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
        },
        {
            title: 'Vehiculo',
            dataIndex: 'vehiculo',
            key: 'vehiculo',
            render: (_, record) => record?.vehiculo?.codigo
        },
        {
            title: 'Lado',
            dataIndex: 'lado',
            key: 'lado',
            render: (_, record) => record?.lado?.lado
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            render: (_, record) => record?.tipo?.tipo
        },
        {
            title: 'Piezas',
            dataIndex: 'piezas',
            key: 'piezas',
            render: (_, record) => <button onClick={() => setParteSeleccionada(record)} className="text-xs text-sky-600  p-1">Ver piezas</button>
        }
    ];


    return (
        <div className="flex items-start w-full gap-2">
            <Table
                size="small"
                title={() => <span className='text-xl'>Fundas</span>}
                locale={{
                    emptyText: "No se encontraron registros",
                }}
                className="w-full"
                pagination={false}
                bordered={true}
                columns={columns}
                dataSource={partes}
                loading={{
                    indicator: <Loader />,
                    spinning: isLoadingPartes
                }}
                rowKey={(item) => item.id}
            />

            <Table
                bordered={true}
                size="small"
                title={() => <span className='text-xl'>Piezas {parteSeleccionada?.codigo}</span>}
                locale={{
                    emptyText: "No se encontraron registros",
                }}
                className="w-full"
                pagination={false}
                columns={columnsPiezas}
                dataSource={piezas}
                loading={{
                    indicator: <Loader />,
                    spinning: isLoadingPiezas
                }}
                rowKey={(item) => item.id}
            />
        </div>
    )
}
