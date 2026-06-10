import InputUseForm from "@components/InputUseForm";
import SelectUseForm from "@components/SelectUseForm";
import usePiezas from '@hooks/usePiezas';
import { ingresoTienda } from "@services/StockService";
import { Switch } from "antd";
import { Table } from "antd";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function TiendaIngresoPage() {

    const { isLoading: isLoadingPiezas, response: piezas } = usePiezas(true)
    const { register, control, handleSubmit, watch, setValue, setFocus, formState: { errors } } = useForm({
        defaultValues: {
            tipo_movimiento: false
        }
    });
    const [piezasIngresar, setPiezasIngresar] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [statusResponse, setStatusResponse] = useState({ error: true, message: null })

    const watchTipoMovimiento = watch('tipo_movimiento', false)

    const confirmarIngreso = async () => {
        setIsLoading(true)

        const data = {
            piezas: piezasIngresar,
            kanban: null,
            egreso: watchTipoMovimiento
        }

        setIsLoading(false)
        // console.log(data)
        // return
        const response = await ingresoTienda(data);
        setStatusResponse({ error: response.error, message: response.message })
        setIsLoading(false)

        if (!response.error) {
            setPiezasIngresar([])

            setValue("pieza", null)
            setValue("cantidad", "")

            setTimeout(() => {
                setFocus("pieza")
            }, 50)

            setTimeout(() => {
                setStatusResponse({ error: false, message: null })

            }, 1000)

        }
    }

    const onSubmit = async (data) => {

        //Verifico si ya existe
        const piezaEx = piezasIngresar.filter(p => p.id == data.pieza)
        const pPiezas = piezasIngresar.filter(p => p.id != data.pieza)

        if (piezaEx.length > 0) {
            piezaEx[0].cantidad = parseInt(data.cantidad) + parseInt(piezaEx[0].cantidad)

            pPiezas.push(piezaEx[0])
        } else {
            pPiezas.push({ pos: Math.floor(Math.random() * 300), 'id': data.pieza, pieza: piezas.filter(p => p.id == data.pieza)[0], 'cantidad': data.cantidad })

        }

        setPiezasIngresar(pPiezas)
        setValue("pieza", null)
        setValue("cantidad", "")
        setFocus("pieza")
    }

    const keyPressEnter = (e) => {
        if (e.key == 'Enter') {
            handleSubmit(onSubmit)()
        }
    }

    return (
        <div className="flex w-full flex-col items-start gap-3">

            <div className={`items-center justify-between w-full rounded-md flex gap-2`}>
                <span className={`items-center justify-center ${!watchTipoMovimiento ? 'bg-green-300' : 'bg-red-300'} p-2 w-full text-lg rounded-md flex font-semibold`}>{!watchTipoMovimiento ? 'INGRESO' : 'EGRESO'} MANUAL DE PIEZAS A TIENDA</span>

                <div className='flex items-center gap-2'>
                    <span className='font-semibold text-xl'>INGRESO</span>
                    <Controller
                        name="tipo_movimiento"
                        control={control}
                        render={({ field }) =>
                            <Switch disabled={piezasIngresar?.length > 0} className="bg-gray-300" {...field} />
                        }
                    />
                    <span className='font-semibold text-xl'>EGRESO</span>
                </div>
            </div>

            <div className="w-full flex items-start justify-center gap-2 border-r">

                <SelectUseForm
                    loading={isLoadingPiezas}
                    label="Pieza"
                    name="pieza"
                    placeholder="Seleccione una pieza"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar una pieza" }}
                    className="w-full "
                    search={true}
                    control={control}
                    onKeyPress={(e) => {
                        if (e.key == 'Enter') {
                            setFocus("cantidad")
                        }
                    }}
                    onSelect={(item) => {
                        setFocus("cantidad")
                    }}
                    options={piezas.map((model) => { return { value: model.id, label: `${model.codigo} - ${model?.parte?.codigo} - ${model?.parte?.modelo[0]?.nombre}` } })}
                />



                <InputUseForm
                    size="large"
                    type="number"
                    label="Cantidad"
                    name="cantidad"
                    className="w-[20%] mt-3 "
                    rules={{ required: "Debe ingresar la cantidad", min: { value: 1, message: "El valor debe ser mayor a cero" } }}
                    register={register}
                    control={control}
                    errors={errors}
                    placeholder="Cantidad"
                    onKeyPress={keyPressEnter}

                />

                <button onClick={handleSubmit(onSubmit)} className="text-sm mt-12 bg-sky-500 px-10">Agregar</button>
            </div>

            <div className="w-full">
                {/* <span className="text-xl mb-4 block">Detalle ingreso a tienda</span> */}
                <div className="flex items-center gap-2">
                    {piezasIngresar?.length > 0 && !isLoading && <button onClick={() => confirmarIngreso()} className={`${watchTipoMovimiento ? 'bg-red-500' : 'bg-success'} w-full my-2 text-white hover:opacity-90`}>Confirmar {watchTipoMovimiento ? 'egreso' : 'ingreso'}</button>}
                    {piezasIngresar?.length > 0 && !isLoading && <button onClick={() => setPiezasIngresar([])} className={`bg-orange-400 w-full my-2 text-white hover:opacity-90`}>Cancelar carga</button>}
                </div>
                {statusResponse?.message && <span className={`block p-2 rounded-md w-full text-white ${statusResponse.error ? 'bg-error' : 'bg-success'}`}>{statusResponse.message}</span>}

                <Table
                    locale={{
                        emptyText: "Seleccione una pieza para comenzar"
                    }}
                    rowKey={item => item.pos}
                    size="small"
                    className="w-full"
                    loading={isLoading}
                    pagination={false}
                    dataSource={piezasIngresar}
                    columns={[
                        {
                            title: 'Pieza',
                            dataIndex: 'pieza',
                            key: 'pieza',
                            render: (_, record) => record?.pieza.codigo
                        },
                        {
                            title: 'Modelo',
                            key: 'modelo',
                            dataIndex: 'modelo',
                            render: (_, record) => record?.pieza.parte?.modelo[0]?.nombre
                        },
                        // {
                        //     title: 'Funda',
                        //     key: 'funda',
                        //     dataIndex: 'funda',
                        //     render: (_, record) => {
                        //         console.log(record?.pieza?.material_pieza)
                        //         return record?.pieza.parte?.codigo
                        //     }
                        // },
                        {
                            title: 'Material',
                            key: 'mat',
                            dataIndex: 'mat',
                            render: (_, record) => `(${record?.pieza?.material_pieza?.codigo_interno}) ${record?.pieza?.material_pieza?.codigo} - ${record?.pieza?.material_pieza?.nombre}`
                        },
                        {
                            title: 'Funda',
                            key: 'funda',
                            dataIndex: 'funda',
                            render: (_, record) => `${record?.pieza.parte?.tipo?.tipo} - ${record?.pieza.parte?.lado?.lado}`
                        },
                        {
                            title: 'Cantidad',
                            dataIndex: 'cantidad',
                            key: 'cantidad'
                        },
                        {
                            title: 'Acciones',
                            dataIndex: 'acciones',
                            key: 'acciones',
                            render: (_, record) => {
                                return <button onClick={() => setPiezasIngresar(piezasIngresar.filter(p => p.pos != record.pos))} className="p-0 text-main">X</button>
                            }
                        }
                    ]}
                />


            </div>
        </div>
    )
}
