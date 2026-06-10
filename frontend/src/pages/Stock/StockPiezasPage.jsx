import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import usePiezas from '@hooks/usePiezas';
import useStockPiezas from '@hooks/useStockPiezas';
import useTables from '@hooks/useTables';
import { Table } from 'antd';
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const columns = [
    {
        title: 'Pieza',
        dataIndex: 'pieza',
        key: 'pieza',
        render: (_, record) => record?.pieza?.codigo
    },
    {
        title: 'Dado',
        dataIndex: 'dado',
        key: 'dado',
        render: (_, record) => record?.pieza?.dado
    },
    {
        title: 'Depósito',
        dataIndex: 'deposito',
        key: 'deposito',
        render: (_, record) => record?.deposito?.descripcion
    },
    {
        title: 'Motivo',
        dataIndex: 'motivo',
        key: 'motivo',
    },
    {
        title: 'Stock',
        dataIndex: 'cantidad',
        key: 'cantidad',
    },
    {
        title: 'Modelo',
        dataIndex: 'modelo',
        key: 'modelo',
        render: (_, record) => record?.pieza?.parte?.modelo[0]?.nombre
    },
    {
        title: 'Mat. Código',
        dataIndex: 'material_codigo',
        key: 'material_codigo',
        render: (_, record) => record?.pieza?.material[0]?.material?.codigo
    },
    {
        title: 'Mat. Cod. Int.',
        dataIndex: 'material',
        key: 'material',
        render: (_, record) => record?.pieza?.material[0]?.material?.codigo_interno
    },
    {
        title: 'Material',
        dataIndex: 'material_nombre',
        key: 'material_nombre',
        render: (_, record) => record?.pieza?.material[0]?.material?.nombre
    },
    {
        title: 'Color',
        dataIndex: 'material_color',
        key: 'material_color',
        render: (_, record) => record?.pieza?.material[0]?.material?.color
    }
];


const getStockDepositos = (stock) => {

    let stockDepositos = []

    stock?.data?.forEach(stk => {

        let res = stockDepositos.filter(s => s.name == stk.deposito.descripcion)
        if (res.length > 0) {
            stockDepositos = stockDepositos.filter(s => s.name != stk.deposito.descripcion)
            stockDepositos.push({
                name: stk.deposito.descripcion,
                stock: parseInt(stk.cantidad) + res[0].stock
            })
        } else {
            stockDepositos.push({
                name: stk.deposito.descripcion,
                stock: parseInt(stk.cantidad)
            })
        }
    });

    let html = "<div class='grid grid-cols-2 gap-4'>";

    stockDepositos.map((item, idx) => {
        html += `<span class='block w-full text-sm'>${item.name} : ${item.stock}</span>`
    })

    html += "</div>"

    return html

}

export default function StockPiezasPage() {
    const { register, control, handleSubmit, getValues, formState: { errors } } = useForm();
    const { isLoading: isLoadingDepositos, response: depositos } = useTables("depositos", true)
    const { isLoading: isLoadingPiezas, response: piezas } = usePiezas(true)
    const { isLoading: isLoadingStock, response: stock, getData: fetchStock } = useStockPiezas()
    const [error, setError] = useState(null)

    const onSubmit = async (data) => {
        setError(null)

        if (data?.detallado && !data?.codigo) {
            setError("Para el reporte detallado se debe informar la pieza")
            return;
        }

        await fetchStock(data)
    }

    return (
        <div>
            <div className='flex items-center justify-center gap-2'>

                <InputUseForm
                    type="range"
                    label="Fecha"
                    name="fecha"
                    className="w-full"
                    register={register}
                    control={control}
                    errors={errors}
                    placeholder="Fecha"
                />

                <SelectUseForm
                    label="Pieza"
                    name="codigo"
                    placeholder="Seleccione una pieza"
                    register={register}
                    errors={errors}
                    className="w-full "
                    search={true}
                    loading={isLoadingPiezas}
                    control={control}
                    options={piezas.map((model) => { return { value: model.id, label: `${model.codigo} - ${model?.parte?.codigo} - ${model?.parte?.modelo[0]?.nombre}` } })}
                />

                <SelectUseForm
                    label="Depósito"
                    name="deposito"
                    placeholder="Seleccione un deposito"
                    register={register}
                    errors={errors}
                    className="w-full "
                    search={true}
                    control={control}
                    options={depositos.map((model) => { return { value: model.id, label: model.descripcion } })}
                />

                <Controller
                    name="detallado"
                    control={control}
                    // rules={rules}
                    render={({ field }) =>
                        <div className="flex gap-1 mt-10">
                            <input type="checkbox" {...field} />
                            <label>Detallado</label>
                        </div>

                    }
                />

                <button className="bg-main text-white mt-11" onClick={handleSubmit(onSubmit)}>Buscar</button>
            </div>

            {error && <span className="bg-error rounded-lg text-white p-2 block my-2">{error}</span>}

            <div>

                {getValues("detallado") && !isLoadingStock && stock?.data?.length > 0 && !error &&
                    <div className="mb-3 flex items-center justify-start gap-2">
                        <div className="flex gap-2 flex-col items-center rounded-lg min-w-40 justify-start bg-white border p-4 min-h-36">
                            <span className="text-2xl h-7">Stock</span>
                            <div className="border-b h-1 w-full border-black"></div>
                            <span className={`text-5xl font-semibold`}>{stock?.data?.reduce((acum, cur) => parseInt(acum) + parseInt(cur.cantidad), 0)}</span>
                            {/* <div className="flex gap-2">
                                <span className="text-xs">Mínimo: {stock?.data[0].pieza?.minimo}</span>
                                <span className="text-xs">Máximo: {stock?.data[0].pieza?.maximo}</span>
                            </div> */}
                        </div>

                        <div className="flex gap-2 flex-col items-center rounded-lg min-w-40 justify-start bg-white border p-4 min-h-36">
                            <span className="text-2xl h-7">Depósitos</span>
                            <div className="border-b h-1 w-full border-black"></div>
                            <div dangerouslySetInnerHTML={{ __html: getStockDepositos(stock) }}></div>
                        </div>
                    </div>
                }

                <Table
                    size="small"
                    title={() => <span className='text-xl'>{getValues("detallado") ? "Detallado - Pieza" : "Piezas"}</span>}
                    locale={{
                        emptyText: "No se encontraron registros",
                    }}
                    className="w-full"
                    pagination={{
                        pageSize: 20
                    }}
                    bordered={true}
                    columns={getValues("detallado") ? columns : columns.filter(c => c.key != 'motivo')}
                    dataSource={stock?.data}
                    loading={{
                        indicator: <Loader />,
                        spinning: isLoadingStock
                    }}
                    rowKey={(item) => Math.random()}
                />
            </div>
        </div>
    )
}
