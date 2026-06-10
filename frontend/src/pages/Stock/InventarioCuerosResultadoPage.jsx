import InputUseForm from "@components/InputUseForm";
import SelectUseForm from "@components/SelectUseForm";
import TableInventario from "@components/TableInventario";
import { getInventarioMaterialesData } from "@services/StockService";
import { TIPO_MATERIALES } from "@utils/Constants";
import { Tooltip } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { sectoresInventarioCueros } from "../../utils/Constants";
import { formatDateTime } from "../../utils/Utils";
// import { Excel } from "antd-table-saveas-excel";
// import { FaRegFileExcel } from "react-icons/fa";

export default function InventarioCuerosResultadoPage() {
    const { register, control, watch, formState: { errors }, getValues } = useForm();

    const [inventario, setInventario] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const watchFecha = watch('fecha', null)
    const watchSector = watch('sector', null)
    const watchDetallado = watch('detallado', null)
    const watchPorSector = watch('por_sector', null)


    const fetchInventario = async (date) => {
        setIsLoading(true)
        const data = await getInventarioMaterialesData(date, getValues("detallado") || watchPorSector, TIPO_MATERIALES.CUERO, watchSector)

        // console.log(data)
        setInventario(data.data)
        setIsLoading(false)
    }

    const changeDate = (date) => {
        if (!date) {
            setInventario([])
            return
        }
        const temp = new Date(date)
        fetchInventario(`${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()}`)
    }

    const makeColumns = () => {

        const detallado = getValues("detallado")

        const colsTmp = [
            // {
            //     title: 'Orden',
            //     dataIndex: 'orden',
            //     key: 'orden',
            // },
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
            // {
            //     title: 'Color',
            //     dataIndex: 'color',
            //     key: 'color',
            //     className: 'min-w-[150px]',
            // },
        ]

        if (watchPorSector) {
            sectoresInventarioCueros?.forEach(sector => {

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
                                    <span>Sector: {sectoresInventarioCueros?.find(u => u?.value == record?.inventario[i]?.sector).label}</span>
                                </div>}>{parseFloat(record?.inventario[i]?.cantidad).toFixed(2)}</Tooltip>
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
                title: 'Total',
                dataIndex: 'inventario_sum_cantidad',
                key: 'inventario_sum_cantidad',
                align: "right",
                className: "min-w-[100px] bg-slate-300 font-semibold",
                render: (text) => {
                    return text ? parseFloat(text).toFixed(2) : 0
                }
            },
        )

        // setColumns(colsTmp)
        return colsTmp
    }

    useEffect(() => {
        if (watchFecha) {
            const temp = new Date(watchFecha)
            fetchInventario(`${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()}`)
        }
    }, [watchSector, watchDetallado, watchPorSector])

    return (
        <div className="w-full">

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
                    options={sectoresInventarioCueros}
                />
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
