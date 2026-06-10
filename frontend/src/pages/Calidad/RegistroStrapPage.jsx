import useStrap from "@hooks/useStrap";
import InputUseForm from "@components/InputUseForm";

import { formatDateTime } from "@utils/Utils";
import { Table } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import SelectUseForm from "@components/SelectUseForm";
import { Tag } from "antd";
import { formatDateEn } from "../../utils/Utils";

const columns = [
    {
        title: 'Fecha',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (text) => formatDateTime(text)
    },
    {
        title: 'Fh. Entrega',
        dataIndex: 'fecha_entrega',
        key: 'fecha_entrega',
        render: (text) => formatDateTime(text)
    },
    {
        title: 'Cod. Barras',
        dataIndex: 'codigo_barra',
        key: 'codigo_barra',
    },
    {
        title: 'Part Num.',
        dataIndex: 'part_number',
        key: 'part_number',
    },
    {
        title: 'Pos.',
        dataIndex: 'posicion',
        key: 'posicion',
    },
    {
        title: 'Lote',
        dataIndex: 'lote',
        key: 'lote',
    },
    // {
    //     title: 'Solicita',
    //     dataIndex: 'solicitante',
    //     key: 'solicitante',
    //     // render: (_, r) => r?.user_out?.name.toUpperCase()
    // },
    {
        title: 'Autoriza',
        dataIndex: 'autoriza',
        key: 'autoriza',
        // render: (_, r) => r?.user_out?.name.toUpperCase()
    },
    {
        title: 'Modelo',
        dataIndex: 'modelo',
        key: 'modelo',
    },
    {
        title: 'Kanban',
        dataIndex: 'kanban',
        key: 'kanban',
    },
    {
        title: 'Evento',
        dataIndex: 'evento',
        key: 'evento',
        render: (text) => {
            if (text == "RETIRO STRAP") {
                return <Tag color="orange">{text}</Tag>
            } else if (text == "ERROR EN FIFO LOTE" || text == "EL STRAP INDICADO NO EXISTE O YA FUE EGRESADO") {
                return <Tag color="red-inverse">{text}</Tag>
            } else if (text == "INGRESO STRAP") {
                return <Tag color="green">{text}</Tag>
            } else {
                return text
            }
        }
    },
    {
        title: 'Remanente',
        dataIndex: 'remanente',
        key: 'remanente',
        render: (_, record) => {
            if (record?.remanente == 1 || record?.remanente == "1") {
                return <Tag color='green'>Sí</Tag>
            } else {
                return <Tag color='green'>No</Tag>
            }
        }
    },

]

const partNumbers = [
    { value: 'X7A13-A2900A', name: 'X7A13-A2900A | A1' },
    { value: 'X7A14-A2901A', name: 'X7A14-A2901A | A2' },
    { value: 'X7A15-A2902A', name: 'X7A15-A2902A | B1' },
    { value: 'X7A16-A2903A', name: 'X7A16-A2903A | B2' },
    { value: 'X7A19-A2917B', name: 'X7A19-A2917B | D1' },
    { value: 'X7A20-A2918B', name: 'X7A20-A2918B | D2' },
    { value: 'X7A17-A2904A', name: 'X7A17-A2904A | C1' },
    { value: 'X7A18-A2905A', name: 'X7A18-A2905A | C2' },
]

export default function RegistroStrapPage() {
    const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm();

    const { response: strap, isLoading: isLoadingStrap, filterMovimientos } = useStrap(false)
    const [strapData, setStrapData] = useState([])
    // const [filters, setFilters] = useState([])

    const totalRegistros = strapData?.length || 0
    const totalRemanente1 = strapData?.filter(r => String(r?.remanente) === "1").length || 0
    const totalRemanente0 = strapData?.filter(r => String(r?.remanente) === "0").length || 0
    const totalPorPosicion = (strapData || []).reduce((acc, r) => {
        const key = r?.posicion || "SIN POSICION"
        acc[key] = (acc[key] || 0) + 1
        return acc
    }, {})

    const fetchStrap = async (filters) => {

        const data = await filterMovimientos(filters, true)
        // console.log(data)
        setStrapData(data)

    }

    // useEffect(() => {
    //     fetchStrap([])
    // }, [])

    const onSubmit = async (data) => {
        // console.log(data)
        if (data?.fecha_entrega) {
            // const date = new Date(data?.fecha_entrega[0])
            data.fecha_entrega_desde = new Date(data?.fecha_entrega[0])
            data.fecha_entrega_hasta = new Date(data?.fecha_entrega[1])

            data.fecha_entrega_desde = formatDateEn(data.fecha_entrega_desde)
            data.fecha_entrega_hasta = formatDateEn(data.fecha_entrega_hasta)
        }

        fetchStrap(data)
    }

    return (
        <div className="w-full">

            <div className="w-full flex items-center gap-2">

                <InputUseForm
                    type="range"
                    label="Fecha Entrega"
                    name="fecha_entrega"
                    className="w-full"
                    register={register}
                    control={control}
                    errors={errors}
                    placeholder="Fecha"
                />



                <SelectUseForm
                    label="Part Number"
                    name="part_number"
                    size="default"
                    loading={isLoadingStrap}
                    placeholder="Seleccione un part number"
                    register={register}
                    errors={errors}
                    className="w-full"
                    search={true}
                    control={control}
                    options={partNumbers.map(pn => {
                        return {
                            value: pn.value,
                            label: pn.name
                        }
                    })}
                />

                <InputUseForm
                    label="Lote"
                    name="lote"
                    className="w-full !bg-white"
                    classNameInput='!bg-white'
                    register={register}
                    errors={errors}
                    placeholder="Lote"
                />

                <SelectUseForm
                    label="Remanente"
                    name="remanente"
                    size="default"
                    loading={isLoadingStrap}
                    // placeholder="Seleccione un remanente"
                    register={register}
                    errors={errors}
                    className="w-full"
                    search={true}
                    control={control}
                    options={[
                        { label: 'Sí', value: '1' },
                        { label: 'No', value: '0' },
                    ]}
                />

                <InputUseForm
                    label="Kanban"
                    name="kanban"
                    className="w-full !bg-white"
                    classNameInput='!bg-white'
                    register={register}
                    errors={errors}
                    placeholder="Kanban"
                />

                <button className="mt-5 bg-orange-300 px-8" onClick={handleSubmit(onSubmit)}>Filtrar</button>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-3 my-3">
                <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-transparent border-t-4 border-t-slate-300">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">Total registros</div>
                    <div className="text-3xl font-semibold text-gray-900 mt-1">{totalRegistros}</div>
                </div>
                <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-transparent border-t-4 border-t-emerald-300">
                    <div className="text-[11px] uppercase tracking-wide text-emerald-500">Total remanente</div>
                    <div className="text-3xl font-semibold text-gray-900 mt-1">{totalRemanente1}</div>
                </div>
                <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-transparent border-t-4 border-t-rose-300">
                    <div className="text-[11px] uppercase tracking-wide text-rose-500">Total paquetes</div>
                    <div className="text-3xl font-semibold text-gray-900 mt-1">{totalRemanente0}</div>
                </div>
                <div className="bg-white/70 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-transparent border-t-4 border-t-amber-300">
                    <div className="text-[11px] uppercase tracking-wide text-amber-500">Total por posicion</div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                        {Object.keys(totalPorPosicion).length === 0 && (
                            <div className="text-gray-400">Sin datos</div>
                        )}
                        {Object.entries(totalPorPosicion).map(([posicion, total]) => (
                            <div key={posicion} className="flex items-center justify-between border border-gray-200 rounded-lg px-2 py-1.5 bg-white/80">
                                <span className="truncate text-gray-600">{posicion}</span>
                                <span className="font-semibold text-gray-900">{total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Table
                loading={isLoadingStrap}
                dataSource={strapData}
                columns={columns}
                size="small"
                rowKey={row => row.id}
                pagination={{
                    pageSize: 40
                }}
            />
        </div>
    )
}
