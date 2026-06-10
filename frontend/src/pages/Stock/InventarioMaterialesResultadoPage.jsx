import InputUseForm from "@components/InputUseForm";
import SelectUseForm from "@components/SelectUseForm";
import TableInventario from "@components/TableInventario";
import { useAuth } from "@hooks/useAuth";
import { getInventarioMaterialesData, updateInventarioMaterialesResultado } from "@services/StockService";
import { TIPO_MATERIALES } from "@utils/Constants";
import { InputNumber, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sectoresInventario } from "../../utils/Constants";
import { formatDateTime } from "../../utils/Utils";

export default function InventarioMaterialesResultadoPage() {
    const { register, control, watch, formState: { errors }, getValues } = useForm();
    const { userData } = useAuth();

    const [inventario, setInventario] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [editingRowId, setEditingRowId] = useState(null)
    const [isSavingResultado, setIsSavingResultado] = useState(false)
    const [draftResultado, setDraftResultado] = useState({
        subtotal_kg: null,
        densidad: null,
        total_m2: null,
        ancho: null,
        total_ml: null,
    })

    const watchFecha = watch('fecha', null)
    const watchSector = watch('sector', null)
    const watchDetallado = watch('detallado', null)
    const watchPorSector = watch('por_sector', null)
    const isDevUser = (userData?.name || '').toString().trim().toLowerCase() === 'dev'

    const toNumber = (value, fallback = 0) => {
        if (value === null || value === undefined || value === '') {
            return fallback
        }
        const parsed = Number.parseFloat(`${value}`.replace(',', '.'))
        return Number.isFinite(parsed) ? parsed : fallback
    }

    const toView = (value, decimals = 2) => {
        const parsed = toNumber(value, 0)
        return parsed.toFixed(decimals)?.replaceAll(".", ",")
    }

    const toNullableNumber = (value) => {
        if (value === null || value === undefined || value === '') {
            return null
        }
        const parsed = Number.parseFloat(`${value}`.replace(',', '.'))
        return Number.isFinite(parsed) ? parsed : null
    }

    const formatDateForApi = (date) => {
        if (!date) return null
        if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
            return date
        }

        const tmp = new Date(date)
        if (Number.isNaN(tmp.getTime())) return null

        const month = `${tmp.getMonth() + 1}`.padStart(2, '0')
        const day = `${tmp.getDate()}`.padStart(2, '0')
        return `${tmp.getFullYear()}-${month}-${day}`
    }


    const fetchInventario = async (date) => {
        setIsLoading(true)
        const data = await getInventarioMaterialesData(date, getValues("detallado") || watchPorSector, TIPO_MATERIALES.TELA, watchSector)
        setInventario(data.data)
        setIsLoading(false)
    }

    const changeDate = (date) => {
        if (!date) {
            setInventario([])
            return
        }
        const formattedDate = formatDateForApi(date)
        if (!formattedDate) {
            setInventario([])
            return
        }
        fetchInventario(formattedDate)
    }

    const startEditResultado = (record) => {
        setEditingRowId(record.id)
        setDraftResultado({
            subtotal_kg: toNumber(record?.subtotal_kg, 0),
            densidad: toNumber(record?.densidad, 0),
            total_m2: toNumber(record?.total_m2, 0),
            ancho: toNumber(record?.ancho, 0),
            total_ml: toNumber(record?.total_ml, 0),
        })
    }

    const cancelEditResultado = () => {
        setEditingRowId(null)
        setDraftResultado({
            subtotal_kg: null,
            densidad: null,
            total_m2: null,
            ancho: null,
            total_ml: null,
        })
    }

    const saveResultado = async (record) => {
        const fecha = formatDateForApi(watchFecha)
        if (!fecha) {
            message.error("Debe seleccionar una fecha válida")
            return
        }

        const payload = {
            fecha: fecha,
            subtotal_kg: toNullableNumber(draftResultado.subtotal_kg),
            densidad: toNullableNumber(draftResultado.densidad),
            total_m2: toNullableNumber(draftResultado.total_m2),
            ancho: toNullableNumber(draftResultado.ancho),
            total_ml: toNullableNumber(draftResultado.total_ml),
        }

        setIsSavingResultado(true)
        const response = await updateInventarioMaterialesResultado(record.id, payload)
        setIsSavingResultado(false)

        if (response?.error) {
            message.error(response?.message || "No se pudo guardar el resultado")
            return
        }

        message.success("Resultado actualizado")
        setEditingRowId(null)
        fetchInventario(fecha)
    }

    const makeColumns = () => {

        const detallado = getValues("detallado")
        // const porSector = getValues("por_sector")

        const colsTmp = [
            {
                title: 'Orden',
                dataIndex: 'orden',
                key: 'orden',
            },
            {
                title: 'Código',
                dataIndex: 'codigo',
                key: 'codigo',
                className: 'min-w-[150px] !border-b !border-b-gray-300',
                fixed: 'left'

            },
            {
                title: 'Descripción',
                dataIndex: 'nombre',
                key: 'nombre',
                className: 'min-w-[300px]',
            },
            {
                title: 'Color',
                dataIndex: 'color',
                key: 'color',
                className: 'min-w-[150px]',
            },
            // {
            //     title: <span >Cajas<br /> Cerradas KG</span>,
            //     dataIndex: 'codigo_proveedor',
            //     key: 'codigo_proveedor',
            //     className: 'min-w-[150px]',
            // },
        ]

        if (watchPorSector) {
            sectoresInventario?.forEach(sector => {

                colsTmp.push({
                    title: sector.label,
                    key: sector.value,
                    align: 'center',
                    dataIndex: Math.random(),
                    render: (_, record) => {
                        if (record?.inventario?.filter(i => i?.sector == sector.value)?.length > 0) {
                            return parseFloat(record?.inventario?.filter(i => i?.material_id == record.id && i?.sector == sector.value)?.reduce((prev, cur) => prev + parseFloat(cur?.cantidad), 0)).toFixed(2)?.replaceAll(".", ",")

                        } else {
                            return "-"
                        }
                    }
                })
            });
        }

        if (detallado && !watchPorSector) {
            let limit = 0;

            inventario.map(i => {
                if (i?.inventario?.length > limit) {
                    limit = i?.inventario?.length
                }
            })

            for (let i = 0; i < limit; i++) {

                colsTmp.push({
                    title: `${i + 1}`,
                    key: i,
                    align: "center",
                    dataIndex: Math.random(),
                    render: (_, record) => {
                        if (record?.inventario?.length > 0) {
                            if (record?.inventario?.length > i) {
                                return <Tooltip title={<div className="flex flex-col gap-0 items-start">
                                    <span>Usuario: {record?.inventario[i]?.user?.name}</span>
                                    <span>Hora: {formatDateTime(record?.inventario[i]?.created_at)}</span>
                                    <span>Sector: {sectoresInventario?.find(u => u?.value == record?.inventario[i]?.sector).label}</span>
                                </div>}>
                                    <span className={`${record?.inventario[i]?.confirmado == 0 && "bg-red-500 p-2 font-semibold"}`}>
                                        {parseFloat(record?.inventario[i]?.cantidad).toFixed(2)?.replaceAll(".", ",")}
                                    </span>
                                </Tooltip>
                            } else {
                                return "-"
                            }
                        } else {
                            return "-"
                        }
                    }
                })
            }
        }


        colsTmp.push(
            {
                title: 'SubTotal KG',
                dataIndex: 'inventario_sum_cantidad',
                key: 'inventario_sum_cantidad',
                align: "right",
                className: "min-w-[100px] bg-slate-300 font-semibold",
                render: (text, record) => {
                    const total = toNumber(record?.subtotal_kg, toNumber(text || 0) + toNumber(record.codigo_proveedor || 0))
                    if (isDevUser && editingRowId === record.id) {
                        return <InputNumber
                            min={0}
                            step={0.01}
                            value={draftResultado.subtotal_kg}
                            onChange={(value) => setDraftResultado(prev => ({ ...prev, subtotal_kg: value }))}
                            style={{ width: "100%" }}
                        />
                    }
                    return toView(total, 2)
                }
            },
            {
                title: 'Densidad',
                dataIndex: 'densidad',
                key: 'densidad',
                align: "right",
                className: "min-w-[60px]",
                render: (text, record) => {
                    const total = toNumber(record?.densidad, text)
                    if (isDevUser && editingRowId === record.id) {
                        return <InputNumber
                            min={0}
                            step={0.01}
                            value={draftResultado.densidad}
                            onChange={(value) => setDraftResultado(prev => ({ ...prev, densidad: value }))}
                            style={{ width: "100%" }}
                        />
                    }
                    return toView(total, 2)
                }
            },
            {
                title: 'Total M2',
                dataIndex: 'm2',
                key: 'm2',
                align: "right",
                className: "min-w-[100px] bg-slate-300 font-semibold",
                render: (_, record) => {
                    const total = toNumber(record?.total_m2, 0)
                    if (isDevUser && editingRowId === record.id) {
                        return <InputNumber
                            min={0}
                            step={0.01}
                            value={draftResultado.total_m2}
                            onChange={(value) => setDraftResultado(prev => ({ ...prev, total_m2: value }))}
                            style={{ width: "100%" }}
                        />
                    }
                    return toView(total, 3)
                }
            },
            {
                title: 'Ancho',
                dataIndex: 'ancho',
                align: "right",
                key: 'ancho',
                className: "min-w-[80px]",
                render: (text, record) => {
                    const total = toNumber(record?.ancho, text)
                    if (isDevUser && editingRowId === record.id) {
                        return <InputNumber
                            min={0}
                            step={0.01}
                            value={draftResultado.ancho}
                            onChange={(value) => setDraftResultado(prev => ({ ...prev, ancho: value }))}
                            style={{ width: "100%" }}
                        />
                    }
                    return toView(total, 2)
                }
            },
            {
                title: 'Total ML',
                dataIndex: 'ml',
                align: "right",
                className: "min-w-[100px] bg-slate-300 font-semibold",
                key: 'ml',
                render: (_, record) => {
                    const total = toNumber(record?.total_ml, 0)
                    if (isDevUser && editingRowId === record.id) {
                        return <InputNumber
                            min={0}
                            step={0.01}
                            value={draftResultado.total_ml}
                            onChange={(value) => setDraftResultado(prev => ({ ...prev, total_ml: value }))}
                            style={{ width: "100%" }}
                        />
                    }
                    return toView(total, 2)
                }
            },
        )

        if (isDevUser) {
            colsTmp.push({
                title: 'Edición',
                key: 'edicion',
                className: 'min-w-[170px]',
                fixed: 'right',
                render: (_, record) => {
                    if (editingRowId === record.id) {
                        return <div className="flex items-center gap-2 justify-end">
                            <button
                                disabled={isSavingResultado}
                                onClick={() => saveResultado(record)}
                                className="bg-green-500 text-white text-xs px-2 py-1 disabled:opacity-50"
                            >
                                Guardar
                            </button>
                            <button
                                disabled={isSavingResultado}
                                onClick={() => cancelEditResultado()}
                                className="bg-slate-400 text-white text-xs px-2 py-1 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    }

                    return <div className="flex justify-end">
                        <button
                            onClick={() => startEditResultado(record)}
                            className="bg-blue-500 text-white text-xs px-2 py-1"
                        >
                            Editar
                        </button>
                    </div>
                }
            })
        }

        return colsTmp
    }

    useEffect(() => {

        if (watchFecha) {
            const formattedDate = formatDateForApi(watchFecha)
            if (formattedDate) {
                fetchInventario(formattedDate)
            }
        }
    }, [watchSector, watchDetallado, watchPorSector])

    return (
        <div className="w-full p-2">
            <div className="flex items-center w-full gap-2">
                <InputUseForm
                    name="fecha"
                    classNameInput="!text-2xl"
                    type="date"
                    control={control}
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Fecha inventario"
                    onChangeFn={(date) => {
                        changeDate(date)
                    }}
                />

                <SelectUseForm
                    // label="Sector"
                    name="sector"
                    size="large"
                    placeholder="Seleccione un sector"
                    register={register}
                    errors={errors}
                    // rules={{ required: "Debe seleccionar el material" }}
                    className="w-full"
                    search={true}
                    control={control}
                    options={sectoresInventario}
                />


                <button onClick={() => {
                    if (watchFecha) {
                        const formattedDate = formatDateForApi(watchFecha)
                        if (formattedDate) {
                            fetchInventario(formattedDate)
                        }
                    }
                }} className="bg-green-400 py-1">RECARGAR</button>


                <div className="w-[400px] flex flex-col gap-0">
                    <Controller
                        name="detallado"
                        control={control}
                        render={({ field }) =>
                            <div className="flex gap-2 items-center">
                                <input id="chkDetallado" type="checkbox" {...field} />
                                <label htmlFor="chkDetallado" className="text-lg font-semibold">Detallado</label>
                            </div>
                        }
                    />

                    <Controller
                        name="por_sector"
                        control={control}
                        render={({ field }) =>
                            <div className="flex gap-2 items-center">
                                <input id="chkPorSector" type="checkbox" {...field} />
                                <label htmlFor="chkPorSector" className="text-lg font-semibold">Por Sector</label>
                            </div>
                        }
                    />
                </div>
            </div>
            <TableInventario data={inventario} columns={makeColumns()} loading={isLoading} />
        </div>
    )
}
