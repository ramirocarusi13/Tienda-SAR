import Loader from "@components/Loader";
import useKanban from '@hooks/useKanban';
import { estados } from '@utils/Constants';
import { formatDate } from '@utils/Utils';
import { Table, Tag } from "antd";
import React, { useEffect } from 'react';
import { useLocation } from "react-router-dom";

const columns = [
    {
        title: 'Kanban',
        dataIndex: 'codigo',
        key: 'codigo',
    },
    {
        title: 'Modelo',
        dataIndex: 'modelo',
        key: 'modelo',
        render: (_, record) => record.modelo.nombre
    },
    {
        title: 'Fecha',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (_, record) => {
            return formatDate(record.created_at)
        }
    },
    {
        title: 'Fecha ingreso',
        dataIndex: 'buffer',
        key: 'buffer',
        render: (_, record) => {
            return formatDate(record?.estado?.created_at)
        }
    },
    {
        title: 'Línea',
        dataIndex: 'linea',
        key: 'linea',
        render: (_, record) => {
            return record?.estado?.linea?.codigo
        }
    },
    {
        title: 'Estado',
        key: 'estado',
        render: (_, record) => (
            <Tag color="blue">{record.estado.estado.descripcion}</Tag>
        ),
    },
];

const getTitle = (status) => {
    if (status == estados.EN_BUFFER) {
        return "Buffer"
    } else if (status == estados.SUB_ASSY) {
        return "Pre Ensamble"
    } else if (status == estados.EN_CORTE) {
        return "Corte"
    } else if (status == estados.COSTURA) {
        return "Ensamble"
    }
}

const getBackgroundColor = (status) => {
    if (status == estados.EN_BUFFER) {
        return "bg-orange-400"
    } else if (status == estados.SUB_ASSY) {
        return "bg-violet-400"
    } else if (status == estados.EN_CORTE) {
        return "bg-yellow-400"
    } else if (status == estados.COSTURA) {
        return "bg-red-400"
    }
}

export default function TableKanbansStatus({ status, reload = false }) {
    const { isLoading, filterKanban, response } = useKanban(false)

    useEffect(() => {
        // if (reload) {
        filterKanban({ status: status })
        // }
    }, [reload, useLocation().pathname])


    return (

        <Table
            title={() => <span className={`text-xl font-semibold ${getBackgroundColor(status)} px-2 py-1 rounded-md`}>Kanbans en {getTitle(status)} : {response?.length}</span>}
            locale={{
                emptyText: "No se encontraron registros",
            }}
            pagination={{
                pageSize: 20,
                defaultPageSize: 20
            }}
            columns={columns}
            dataSource={response}
            loading={{
                indicator: <Loader />,
                spinning: isLoading
            }}
            rowKey={(item) => item.id}
            size="small"
        />

    )
}
