import InputUseForm from "@components/InputUseForm";
import SelectUseForm from "@components/SelectUseForm";
import useModels from '@hooks/useModels';
import useTables from "@hooks/useTables";
import { Popconfirm, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";


export default function KanbanPapaItems({ modelId }) {
    const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const { response: materiales, isLoading: isLoadingMats, saveTable, getData, deleteTable } = useTables(`materiales_piezas/@`, true)

    const { isLoading, response, fetchKanbanPapa, fetchDadoById, saveDataDado, deleteDado } = useModels(false)

    const [orden, setOrden] = useState("C")
    const [editId, setEditId] = useState(null)
    const [messageResult, setMessageResult] = useState(null)
    const [esCompartido, setEsCompartido] = useState(false)

    useEffect(() => {
        fetchKanbanPapa(modelId)
        setOrden("C")
    }, [modelId])

    const columns = [
        {
            title: 'Consumo',
            key: 'consumo',
            dataIndex: 'consumo',
            render: (text) => parseFloat(text).toFixed(1)
        },
        {
            title: 'Cod',
            key: 'cod_interno',
            dataIndex: 'cod_interno',
            render: (_, record) => record?.material?.codigo_interno
        },
        {
            title: 'Descripción',
            key: 'descripcion',
            dataIndex: 'descripcion',
            render: (_, record) => record?.material?.nombre
        },
        {
            title: 'Dado',
            key: 'dado',
            dataIndex: 'dado'
        },
        {
            title: 'Veces',
            key: 'corte',
            dataIndex: 'corte'
        },
        {
            title: 'Lec 1 y 2',
            key: 't_lectra1',
            dataIndex: 't_lectra1'
        },
        // {
        //     title: 'Lectra 2',
        //     key: 't_lectra2',
        //     dataIndex: 't_lectra2'
        // },
        {
            title: 'Lec 3 y 4',
            key: 't_lectra3',
            dataIndex: 't_lectra3'
        },
        // {
        //     title: 'Lectra 4',
        //     key: 't_lectra4',
        //     dataIndex: 't_lectra4'
        // },
        // {
        //     title: 'Pos',
        //     key: 't_posicionamiento',
        //     dataIndex: 't_posicionamiento'
        // },
        {
            title: 'A',
            key: 'tipo',
            render: (_, record) => {
                if (record?.modelo_dado?.esA == "1") {
                    return <span className={`bg-yellow-300 px-2 font-semibold`}>A</span>
                } else {
                    return ''
                }
            }
        },
        {
            title: 'B',
            key: 'tipo',
            render: (_, record) => {
                if (record?.modelo_dado?.esB == "1") {
                    return <span className={`bg-blue-300 px-2 font-semibold`}>B</span>
                } else {
                    return ''
                }
            }
        },
        {
            title: 'Acciones',
            key: 'acciones',
            dataIndex: 'acciones',
            render: (_, record) => {
                return <div key={record.id} className='flex items-center gap-3'>
                    <button onClick={() => fetchDado(record.id)} className='text-sm text-blue-600 py-1 px-0 bg-transparent active:border-none border-none focus:border-none outline-none'>Editar</button>
                    <Popconfirm
                        description="¿Está seguro que desea eliminarlo?"
                        title="Eliminar"
                        okText="Si"
                        cancelText="No"
                        okButtonProps={{ className: "bg-green-500" }}
                        onConfirm={async () => {
                            await deleteDado(record.id, true)
                            fetchKanbanPapa(modelId)

                        }}
                    >
                        <button className='active:border-none border-none focus:border-none outline-none text-sm text-red-500 py-1 px-0 bg-transparent'>Eliminar</button>
                    </Popconfirm>
                </div>
            }

        }
    ]

    const onSubmit = async (data) => {

        data.t_lectra2 = data.t_lectra1
        data.t_lectra4 = data.t_lectra2
        // data.tipo = valueRadio
        data.t_posicionamiento = "00:02:00"
        data.modeloId = modelId
        data.modeloCompartido = esCompartido
        data.id = editId

        const response = await saveDataDado(data, true)

        if (!response.error) {
            fetchKanbanPapa(modelId)
            resetearCampos()
        } else {
            setMessageResult(response?.message)
        }

    }

    const fetchDado = async (id) => {
        const data = await fetchDadoById(id, true)

        setValue("consumo", data?.data?.consumo)
        setValue("corte", data?.data?.corte)
        setValue("dado", data?.data?.dado)
        setValue("material", parseInt(data?.data?.material_id) ? parseInt(data?.data?.material_id) : null)
        setValue("t_lectra1", data?.data?.t_lectra1)
        setValue("t_lectra2", data?.data?.t_lectra2)
        setValue("t_lectra3", data?.data?.t_lectra3)
        setValue("t_lectra4", data?.data?.t_lectra4)
        // setValue("t_posicionamiento", data?.data?.t_posicionamiento)

        setValue("ordenA", data?.data?.modelo_dado?.ordenA)
        setValue("ordenB", data?.data?.modelo_dado?.ordenB)
        setValue("ordenCompleto", data?.data?.modelo_dado?.ordenCompleto)

        setValue("esA", data?.data?.modelo_dado?.esA == "1")
        setValue("esB", data?.data?.modelo_dado?.esB == "1")

        setEditId(id)
    }

    const resetearCampos = () => {
        reset({ dado: null, ordenCompleto: null, esA: false, esB: false, ordenA: null, ordenB: null, consumo: null, corte: null, material: null, t_lectra1: null, t_lectra2: null, t_lectra3: null, t_lectra4: null, t_posicionamiento: null })
        setEditId(null)
        setMessageResult(null)
    }

    // console.log(response)

    const BotonesMostrar = () => {
        return <div className="flex items-center gap-2 justify-end">
            <span className="font-semibold">MOSTRAR</span>
            <button onClick={() => setOrden("C")} className={`text-xs ${orden == "C" ? "!bg-green-400" : "!bg-slate-500"}`}>TODO</button>
            <button onClick={() => setOrden("A")} className={`text-xs ${orden == "A" ? "!bg-yellow-300" : "!bg-slate-500"}`}>DADOS A</button>
            <button onClick={() => setOrden("B")} className={`text-xs ${orden == "B" ? "!bg-blue-300" : "!bg-slate-500"}`}>DADOS B</button>
        </div>
    }

    return (
        <div className='flex items-start'>

            <div className="w-full flex flex-col gap-2">
                {response?.filter(d => d?.compartido_id != null)?.length > 0 ?
                    <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setEsCompartido(false)} className={`text-sm ${!esCompartido ? 'bg-green-500' : 'bg-gray-400'}`}>Normal</button>
                            <button onClick={() => setEsCompartido(true)} className={`text-sm ${esCompartido ? 'bg-green-500' : 'bg-gray-400'}`}>{response?.find(d => d?.compartido_id != null)?.compartido?.name}</button>
                        </div>

                        <BotonesMostrar />
                    </div>
                    :
                    <BotonesMostrar />
                }

                <Table
                    loading={isLoading}
                    className='w-full'
                    columns={columns}
                    dataSource={response?.filter(r => {
                        if (orden == "A") {
                            return r?.modelo_dado?.esA == true
                        } else if (orden == "B") {
                            return r?.modelo_dado?.esB == true
                        } else {
                            return r
                        }
                    })?.sort((a, b) => {
                        if (orden == "A") {
                            return parseInt(a?.modelo_dado?.ordenA) - parseInt(b?.modelo_dado?.ordenA)
                        } else if (orden == "B") {
                            return parseInt(a?.modelo_dado?.ordenB) - parseInt(b?.modelo_dado?.ordenB)
                        } else {
                            return parseInt(a?.modelo_dado?.ordenCompleto) - parseInt(b?.modelo_dado?.ordenCompleto)
                        }
                    }).filter(d => {
                        return !esCompartido ? d?.compartido_id == null : d?.compartido_id != null
                    })}
                    pagination={false}
                    size="small"
                    rowKey={k => k.id}
                />

                <div className="grid w-full grid-cols-3 gap-2 mt-2">
                    <div className="w-full flex flex-col bg-white border border-gray-500">
                        <span className="block w-full text-xl py-1 font-semibold text-center border-b border-black">ESTÁNDAR</span>

                        <table className="border-collapse">
                            <thead>
                                <tr className="border-gray-500 border-b">
                                    <th className="text-start border-r border-gray-500 pl-2">CÓDIGO</th>
                                    <th className="text-start border-r border-gray-500">MATERIAL</th>
                                    <th className="text-center border-gray-500">ML</th>
                                </tr>
                            </thead>
                            <tbody>
                                {response?.filter(d => {
                                    return !esCompartido ? d?.compartido_id == null : d?.compartido_id != null
                                })?.sort((a, b) => { return parseInt(a?.modelo_dado?.ordenCompleto) - parseInt(b?.modelo_dado?.ordenCompleto) }).map((d, idx) => (
                                    <tr key={`C-${idx}`} className="border-gray-500 border-b">
                                        <td className="border-gray-500 border-r pl-2">{d?.material?.codigo_interno}</td>
                                        <td className="border-gray-500 border-r">{d?.material?.nombre ? d?.material?.nombre : d?.dado}</td>
                                        <td className="text-center">{d?.consumo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full flex flex-col bg-yellow-300 border border-gray-500">
                        <span className="block w-full text-xl py-1 font-semibold text-center border-b border-black">A</span>

                        <table className="border-collapse">
                            <thead>
                                <tr className="border-gray-500 border-b">
                                    <th className="text-start border-r border-gray-500 pl-2">CÓDIGO</th>
                                    <th className="text-start border-r border-gray-500">MATERIAL</th>
                                    <th className="text-center border-gray-500">ML</th>
                                </tr>
                            </thead>
                            <tbody>
                                {response?.filter(d => {
                                    return !esCompartido ? d?.compartido_id == null : d?.compartido_id != null
                                }).filter(d => d?.modelo_dado?.esA == true).sort((a, b) => { return parseInt(a?.modelo_dado?.ordenA) - parseInt(b?.modelo_dado?.ordenA) }).map((d, idx) => (
                                    <tr key={`A-${idx}`} className="border-gray-500 border-b">
                                        <td className="border-gray-500 border-r pl-2">{d?.material?.codigo_interno}</td>
                                        <td className="border-gray-500 border-r">{d?.material?.nombre ? d?.material?.nombre : d?.dado}</td>
                                        <td className="text-center">{d?.consumo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="w-full flex flex-col bg-blue-300 border border-gray-500">
                        <span className="block w-full text-xl py-1 font-semibold text-center border-b border-black">B</span>

                        <table className="border-collapse">
                            <thead>
                                <tr className="border-gray-500 border-b">
                                    <th className="text-start border-r border-gray-500 pl-2">CÓDIGO</th>
                                    <th className="text-start border-r border-gray-500">MATERIAL</th>
                                    <th className="text-center border-gray-500">ML</th>
                                </tr>
                            </thead>
                            <tbody>
                                {response?.filter(d => {
                                    return !esCompartido ? d?.compartido_id == null : d?.compartido_id != null
                                }).filter(d => d?.modelo_dado?.esB == "1").sort((a, b) => { return parseInt(a?.modelo_dado?.ordenB) - parseInt(b?.modelo_dado?.ordenB) }).map((d, idx) => (
                                    <tr key={`B-${idx}`} className="border-gray-500 border-b">
                                        <td className="border-gray-500 border-r pl-2">{d?.material?.codigo_interno}</td>
                                        <td className="border-gray-500 border-r">{d?.material?.nombre ? d?.material?.nombre : d?.dado}</td>
                                        <td className="text-center">{d?.consumo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <span className="bg-yellow-200 p-2 text-[90%] font-semibold">EL ORDEN ESTABLECIDO EN LAS TARJETAS, ES EL ORDEN DE CORTE DE CADA UNA. POR LO TANTO, EL QUE VISUALIZARÁ PC PARA ABASTECER.</span>
            </div>

            <div className='flex flex-col items-start justify-start px-4 max-w-[40%] !w-[40%]'>

                {/* <button className="text-white bg-green-500 text-sm p-2 w-full">Nuevo Dado</button> */}
                <InputUseForm
                    label="Consumo"
                    name="consumo"
                    className="w-full !bg-white"
                    classNameInput='!bg-white'
                    register={register}
                    errors={errors}
                    placeholder="Consumo"
                    rules={{ required: "Ingrese el consumo del material" }}
                />

                <SelectUseForm
                    label="Material"
                    name="material"
                    size="default"
                    loading={isLoadingMats}
                    placeholder="Seleccione un material"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el material" }}
                    className="w-full"
                    search={true}
                    control={control}
                    options={materiales.map((mat) => { return { value: mat.id, label: `${mat.codigo_interno} | ${mat.codigo} | ${mat.nombre} | ${mat.color || ""}`, className: "!text-sm" } })}
                />

                <InputUseForm
                    label="Dado"
                    name="dado"
                    className="w-full"
                    classNameInput='!bg-white'
                    register={register}
                    rules={{ required: "Debe ingresar el dado" }}
                    errors={errors}
                    placeholder="Dado"
                />

                <InputUseForm
                    label="Veces"
                    name="corte"
                    className="w-full"
                    register={register}
                    classNameInput='!bg-white'
                    errors={errors}
                    placeholder="Cant. de veces"
                    rules={{ required: "Ingrese la cantidad de veces a cortar" }}
                />

                <InputUseForm
                    label="Tiempo Lectra 1 y 2"
                    name="t_lectra1"
                    className="w-full"
                    register={register}
                    classNameInput='!bg-white'
                    errors={errors}
                    placeholder="Tiempo"
                />

                <InputUseForm
                    label="Tiempo Lectra 3 y 4"
                    name="t_lectra3"
                    className="w-full"
                    register={register}
                    classNameInput='!bg-white'
                    errors={errors}
                    placeholder="Tiempo"
                />

                {/* <InputUseForm
                    label="Tiempo Posicionamiento"
                    name="t_posicionamiento"
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Tiempo"
                /> */}

                <div className="flex flex-col gap-1">

                    <InputUseForm
                        label="Orden dado completo"
                        name="ordenCompleto"
                        className="w-full"
                        classNameInput='!bg-white'
                        register={register}
                        errors={errors}
                        type="number"
                        placeholder="Orden completo"
                    />

                    <div className="flex items-center">
                        <div className="flex items-center gap-1 w-full">
                            <input type="checkbox" {...register('esA')} />
                            <label>Es A</label>
                        </div>

                        <InputUseForm
                            label=""
                            name="ordenA"
                            className="w-full"
                            register={register}
                            classNameInput='!bg-white'
                            errors={errors}
                            placeholder="Orden"
                            type="number"
                        />
                    </div>


                    <div className="flex items-center">

                        <div className="flex items-center gap-1 w-full">
                            <input type="checkbox" {...register('esB')} />
                            <label>Es B</label>
                        </div>
                        <InputUseForm
                            label=""
                            name="ordenB"
                            className="w-full"
                            register={register}
                            type="number"
                            classNameInput='!bg-white'
                            errors={errors}
                            placeholder="Orden"
                        />
                    </div>


                    {/* <Radio.Group onChange={(e) => setValueRadio(e.target.value)} value={valueRadio}>
                        <Radio value="A">Es A</Radio>
                        <Radio value="B">Es B</Radio>
                    </Radio.Group> */}
                </div>

                <div className='flex items-center gap-4 w-full'>
                    {!editId && <button onClick={handleSubmit(onSubmit)} className='bg-green-500 py-1 px-10 mt-4'>Crear dado</button>}
                    {editId && <button onClick={handleSubmit(onSubmit)} className='bg-green-500 py-1 px-10 mt-4'>Grabar</button>}
                    <button onClick={() => {
                        resetearCampos()
                    }} className='bg-red-500 py-1 px-10 mt-4'>Cancelar</button>
                </div>

                {messageResult && <span className='block w-full bg-red-500 mt-2 p-1 font-semibold rounded-md'>{messageResult}</span>}
            </div>
        </div>
    )
}
