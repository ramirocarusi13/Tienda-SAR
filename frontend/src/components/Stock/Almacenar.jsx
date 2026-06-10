import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import { almacenarEnDeposito } from "@services/DepositoService";
import { depositos } from "@utils/Constants";
import { normalizePositionText, toCanonicalRackPosition } from "@utils/positionFormat";
import { Radio, Table } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { Controller, useForm } from 'react-hook-form';

export default function Almacenar() {
    const { register, watch, control, handleSubmit, formState: { errors }, getValues, setFocus, setValue } = useForm({ defaultValues: { tipo: 'KANBAN' } });
    const [status, setStatus] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [productos, setProductos] = useState([])

    const watchTipoProducto = watch('tipo', 'KANBAN')

    useEffect(() => {
        setProductos([])
    }, [watchTipoProducto])

    const onSubmit = async (data) => {
        // console.log(data)
        setStatus(null)
        setIsLoading(true)

        const res = await almacenarEnDeposito({
            productos: productos,
            automatico: data?.posicion ? false : true,
            producto: data.kanban,
            tipoProducto: data?.tipo, //'KANBAN',
            deposito: data.deposito, //depositos.RACKS,
            posicion: '',
            posicionName: data.deposito == depositos.RACKS
                ? (toCanonicalRackPosition(data.posicion) || normalizePositionText(data.posicion))
                : ''
        })

        setStatus(res)
        setIsLoading(false)

        if (data.deposito == depositos.RACKS) {
            setValue("posicion", null)
            setValue("kanban", null)

            setTimeout(() => {
                setFocus("posicion")
            }, 50)

        } else {
            setValue("kanban", null)

            setTimeout(() => {
                setFocus("kanban")
            }, 50)
        }

        setValue("producto", null)
        setValue("lote", null)
        setProductos([])

    }

    const agregaProducto = () => {

        // const tmp = productos
        setProductos([...productos, {
            producto: getValues("producto"),
            lote: getValues("lote"),
        }])

        setValue("producto", null)
        setValue("lote", null)

        setTimeout(() => {
            setFocus("producto")
        }, [50])
    }

    return (
        <div>
            <SelectUseForm
                label="Deposito"
                name="deposito"
                placeholder="Seleccione un deposito"
                register={register}
                errors={errors}
                rules={{ required: "Debe seleccionar el deposito" }}
                className="w-full"
                search={true}
                control={control}
                options={[{ value: 8, label: 'RACKS' }, { value: 9, label: 'DOLLYS' }, { value: 10, label: 'TEMPO A' }, { value: 11, label: 'TEMPO B' }]}
                onSelect={(val) => {
                    if (val == depositos.RACKS) {
                        setValue('kanban', null)
                        setValue('posicion', null)
                        setTimeout(() => {
                            setFocus('posicion')
                        }, 50)
                    } else {
                        setValue('posicion', '.')
                        setTimeout(() => {
                            setFocus('kanban')
                        }, 50)

                    }
                }}
            />

            <InputUseForm
                control={control}
                // type="number"
                label="Posición"
                // rules={{ required: "Debe ingresar la posición" }}
                name="posicion"
                className="w-full "
                register={register}
                size="large"
                errors={errors}
                placeholder="Posición"
                onKeyPress={(e) => {
                    if (e.key == 'Enter') {
                        setTimeout(() => {
                            setFocus("kanban")
                        }, 50)
                    }
                }}
            />

            <div className="flex flex-col mt-4">
                <span className="font-semibold block mb-2">Contenido</span>

                <Controller
                    name="tipo"
                    control={control}
                    render={({ field: { onChange, value, ref } }) =>
                        <Radio.Group onChange={onChange} value={value} ref={ref}>
                            <Radio value="KANBAN">Kanban</Radio>
                            <Radio value="PRODUCTO">Producto</Radio>
                        </Radio.Group>
                    }
                />
            </div>

            <InputUseForm
                control={control}
                label="Kanban"
                // rules={watchTipoProducto == 'KANBAN' ? { required: "Debe ingresar el kanban" } : null}
                name="kanban"
                className={`w-full ${watchTipoProducto == 'PRODUCTO' && 'hidden'}`}
                register={register}
                size="large"
                errors={errors}
                placeholder="Kanban"
                onKeyPress={(e) => {
                    if (e.key == 'Enter') {
                        handleSubmit(onSubmit)()
                    }
                }}
            />

            <div className={`w-full flex gap-2 items-start ${watchTipoProducto == 'KANBAN' && 'hidden'}`}>
                <div className="flex flex-col gap-1 w-full">
                    <InputUseForm
                        control={control}
                        label="Producto"
                        // rules={{ required: "Debe ingresar el kanban" }}
                        // rules={watchTipoProducto == 'PRODUCTO' && { required: "Debe ingresar el producto" }}
                        name="producto"
                        className={`w-full`}
                        register={register}
                        size="large"
                        errors={errors}
                        placeholder="Producto"
                        onKeyPress={(e) => {
                            if (e.key == 'Enter') {
                                setTimeout(() => {
                                    setFocus("lote")
                                }, [50])
                                // handleSubmit(onSubmit)()
                            }
                        }}
                    />

                    <InputUseForm
                        control={control}
                        label="Lote"
                        // rules={watchTipoProducto == 'PRODUCTO' && { required: "Debe ingresar el lote" }}
                        name="lote"
                        className={`w-full`}
                        register={register}
                        size="large"
                        errors={errors}
                        placeholder="Lote"
                        onKeyPress={(e) => {
                            if (e.key == 'Enter') {
                                const producto = getValues("producto")
                                if (producto == '' || e.target.value == '') {
                                    setStatus({ error: true, message: 'Debe informar el producto y el lote' })
                                    return
                                }
                                // handleSubmit(onSubmit)()
                                agregaProducto()
                            }
                        }}
                    />

                    <button onClick={handleSubmit(onSubmit)} className="w-full bg-green-400 mt-4">ALMACENAR</button>

                </div>

                <div className="flex items-start  flex-col w-full">
                    <span className="font-semibold text-xl block mb-2">Contenido</span>

                    <Table
                        dataSource={productos}
                        className="w-full"
                        columns={[
                            {
                                dataIndex: 'producto',
                                title: 'Producto'
                            },
                            {
                                dataIndex: 'lote',
                                title: 'Lote'
                            }
                        ]}
                        pagination={false}
                        rowKey={r => r.lote + r.producto}
                    />

                </div>
            </div>

            {isLoading && <div className="w-full flex items-center justify-center mt-10"><Loader fontSize={50} /></div>}

            {status &&
                <div className="mt-10">
                    {status.error && <span className="bg-red-500 text-white font-bold  p-2 text-6xl text-center block">{status.message?.toUpperCase()}</span>}
                    {!status.error && <span className="bg-green-500 text-white font-bold p-2  text-6xl text-center block">GUARDADO CORRECTAMENTE</span>}
                </div>
            }
        </div>
    )
}
