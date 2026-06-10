import InputUseForm from "@components/InputUseForm";
import ModalEditPesaje from "@components/ModalEditPesaje";
import SelectUseForm from "@components/SelectUseForm";
import { useAuth } from "@hooks/useAuth";
import useTables from "@hooks/useTables";
import { updatePesaje, setConfirmarPesaje } from "@services/StockService";
import { TIPO_MATERIALES } from "@utils/Constants";
import { Popconfirm, Table, message } from "antd";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useModels from "@hooks/useModels";
import { sectoresInventario, sectoresInventarioCueros } from "../../utils/Constants";

export default function InventarioMaterialesPage({ tipoMaterial }) {
    const { register, control, watch, handleSubmit, formState: { errors }, setFocus, setValue, getValues } = useForm();
    const [pesajes, setPesajes] = useState([])
    const { isLoading: isLoadingModels, response: models, getData: getModels } = useModels(false)

    const [statusResponse, setStatusResponse] = useState({ error: false, message: null })
    const { response: materiales, isLoading, saveTable, getData, deleteTable } = useTables(`materiales_piezas/${tipoMaterial}`, true)
    const [messageApi, contextHolder] = message.useMessage();
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pesaje, setPesaje] = useState(0)
    const [editId, setEditId] = useState(null)
    const { userData } = useAuth()
    const [mats, setMats] = useState([])

    const watchModelo = watch("modelo", null)
    const watchSector = watch('sector', null)

    const columns = [
        {
            title: 'Cod. Material',
            dataIndex: 'cod_material',
            key: 'cod_material',
            render: (_, record) => record?.material?.codigo
        },
        {
            title: 'Material',
            dataIndex: 'material',
            key: 'material',
            render: (_, record) => record?.material?.nombre
        },
        {
            title: 'Usuario',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => record?.user?.name
        },
        {
            title: tipoMaterial == TIPO_MATERIALES.TELA ? 'Pesaje' : 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad',
            render: (text) => parseFloat(text).toFixed(2)
        },
        {
            title: 'Modelo',
            dataIndex: 'modelo',
            key: 'modelo',
            render: (_, record) => record?.material?.modelo
        },
        {
            title: 'Sector',
            dataIndex: 'sector',
            key: 'sector',
            render: (text) => {
                if (tipoMaterial == TIPO_MATERIALES.TELA) {
                    return sectoresInventario?.find(s => s?.value == text)?.label?.toUpperCase()
                } else {
                    return sectoresInventarioCueros?.find(s => s?.value == text)?.label?.toUpperCase()
                }
            }
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (_, record) => <div className="flex items-center gap-2">
                <button
                    onClick={() => {
                        setPesaje(parseFloat(record?.cantidad).toFixed(3))
                        setEditId(record.id)
                        setIsModalOpen(true)
                    }} className="text-sm px-4 py-1 bg-blue-400"
                >
                    Editar
                </button>
                <Popconfirm
                    title={tipoMaterial == TIPO_MATERIALES.TELA ? 'Eliminar pesaje' : 'Eliminar conteo'}
                    description={`¿Está seguro que desea eliminar el ${tipoMaterial == TIPO_MATERIALES.TELA ? 'pesaje' : 'conteo'}? No se podrá recuperar`}
                    onConfirm={() => { deletePesaje(record?.id) }}
                    okButtonProps={{
                        className: "bg-green-500"
                    }}
                    okText="Si"
                    cancelText="No"
                >
                    <button className="text-sm px-4 py-1 bg-red-500"
                    >
                        Eliminar
                    </button>
                </Popconfirm>

                {record?.confirmado == 0 && <button onClick={async () => {
                    await setConfirmarPesaje(record.id)
                    fetchCurrentStock()
                }} className="text-sm px-4 py-1 bg-green-500">Confirmar</button>}
            </div>
        },
    ];

    const handleOk = async () => {

        if (parseFloat(pesaje) == 0 || pesaje == "") {
            return
        }

        const response = await updatePesaje(editId, { cantidad: pesaje })
        if (!response.error) {
            setIsModalOpen(false)
            fetchCurrentStock()
            setEditId(null)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const deletePesaje = async (id) => {
        const response = await deleteTable({ id: id, table: "inventario_materiales_piezas" })
        fetchCurrentStock()
    }

    const successMessage = (text) => {
        messageApi.success({ content: text, className: "text-xl" });
    };

    const errorMessage = (text) => {
        messageApi.error({ content: text, duration: 4, className: "text-xl flex items-center justify-center" });
    };

    const keyPressEnter = (item) => {
        if (!item) {
            setStatusResponse({ error: true, message: "Debe informar el material" })
            return
        }

        setStatusResponse({ error: false, message: null })

        setTimeout(() => { setFocus("pesaje") }, 50)
    }

    const fetchCurrentStock = async () => {
        const data = await getData(`inventario_materiales_piezas/${tipoMaterial}`, true)
        setPesajes(data?.data)
    }

    const fetchMateriales = async (modelo = null) => {
        const data = await getData(null, true)

        if (modelo) {
            const tmp = data?.data?.filter(m => m.nombre?.toUpperCase().includes(watchModelo.trim().toUpperCase()))
            setMats(tmp)
        } else {
            setMats(data?.data)
        }
    }

    // useEffect(() => {
    //     if (watchModelo) {
    //         fetchMateriales(watchModelo)
    //     }
    // }, [watchModelo])

    useEffect(() => {
        fetchMateriales()
        fetchCurrentStock()

        if (tipoMaterial == TIPO_MATERIALES.CUERO) {
            getModels()
        }

        setValue("sector", null)

        setTimeout(() => {
            setFocus("material")
        }, 50)
    }, [tipoMaterial])

    const keyPressEnterQty = async (e) => {
        if (e.key == 'Enter') {
            const material = getValues("material")

            const pesaje = getValues("pesaje")
            if (!material || pesaje <= 0) {
                setStatusResponse({ error: true, message: "Debe informar los campos" })
                return
            }

            setStatusResponse({ error: false, message: null })
            const today = new Date()
            const key = `${today.getHours()}${today.getMinutes()}${today.getSeconds()}${today.getMilliseconds()}`

            const item = {
                key: key,
                id: Math.floor(Math.random() * 300),
                material: mats.filter(m => m.id == material)[0],
                cantidad: parseFloat(pesaje).toFixed(3),
                sector: watchSector,
                user: {
                    name: userData?.name
                }
            }

            await saveTable(item, (res) => {

                if (res.error) {
                    errorMessage(res.message)
                } else {
                    fetchCurrentStock()
                    successMessage("Correcto")
                }
            }, "inventario_materiales_piezas")


            const mantener = getValues("mantener")
            setValue("pesaje", "")

            if (!mantener) {
                setValue("material", null)
                setTimeout(() => {
                    setFocus("material")
                }, 50)
            }
        }
    }

    const cargarModelo = async () => {
        const cantidad = getValues("cantidad")

        const item = {
            cantidad: parseFloat(cantidad).toFixed(3),
            sector: watchSector,
            modelo: watchModelo
        }

        await saveTable(item, (res) => {

            if (res.error) {
                errorMessage(res.message)
            } else {
                fetchCurrentStock()
                successMessage("Correcto")
            }
        }, "inventario_materiales_piezas")

        setValue("cantidad", "")
        setValue("modelo", "")


        setTimeout(() => {
            setFocus("material")
        }, 50)


    }

    return (
        <div>
            {contextHolder}
            {watchSector &&
                <div className="w-full flex items-center gap-2">
                    <span className={`block w-full ${tipoMaterial == TIPO_MATERIALES.TELA ? 'bg-green-400' : 'bg-yellow-400'} rounded-md text-center py-1 font-semibold`}>{tipoMaterial == TIPO_MATERIALES.TELA ? 'PESAJE TELAS' : 'CONTEO CUEROS'}</span>
                    <div className="flex items-center gap-2 w-full">
                        {tipoMaterial == TIPO_MATERIALES.TELA ?
                            <span className={`block animate-pulse w-full bg-orange-400 rounded-md text-center py-1 font-semibold`}>PESANDO EN {sectoresInventario?.find(s => s?.value == watchSector)?.label?.toUpperCase()}</span>
                            :
                            <span className={`block animate-pulse w-full bg-orange-400 rounded-md text-center py-1 font-semibold`}>CONTANDO EN {sectoresInventarioCueros?.find(s => s?.value == watchSector)?.label?.toUpperCase()}</span>
                        }
                        <button onClick={() => setValue("sector", null)} className="text-xs bg-blue-300">CAMBIAR SECTOR</button>
                    </div>

                </div>
            }

            {(watchSector && tipoMaterial == TIPO_MATERIALES.CUERO) &&
                <div className="w-full flex items-center gap-2">
                    <SelectUseForm
                        className="w-full"

                        name="modelo"
                        placeholder="Seleccione un modelo"
                        register={register}
                        errors={errors}
                        // className="flex items-center justify-center"
                        rules={{ required: "Debe seleccionar el modelo" }}
                        onSelect={() => {
                            setTimeout(() => { setFocus("cantidad") }, 50)
                        }}
                        classNameSelect="!h-10 mt-2 !text-2xl w-full"
                        loading={isLoadingModels}
                        search={true}
                        control={control}
                        options={models.map((model) => { return { value: model.nombre, label: model.nombre } })}
                    />

                    <InputUseForm
                        name="cantidad"
                        className="w-full"
                        // className={`${tipoMaterial == TIPO_MATERIALES.TELA ? 'w-full' : '!w-[300px]'} mt-2`}
                        register={register}
                        classNameInput="!text-lg !py-1"
                        errors={errors}
                        placeholder={"Conteo"}
                        rules={{ required: `Ingrese la cantidad` }}
                        // onKeyPress={keyPressEnterQty}
                        type="number"
                    />

                    <button onClick={() => cargarModelo()} disabled={!watchModelo} className="bg-cyan-400 min-w-[200px] py-2 px-4 disabled:opacity-70 disabled:cursor-not-allowed">CARGAR MODELO</button>

                </div>
            }
            {/* {tipoMaterial == TIPO_MATERIALES.CUERO &&
                <div className="w-full flex items-center gap-2">

                    <SelectUseForm
                        onClear={() => {
                            fetchMateriales()
                            setValue("material", null)
                            setTimeout(() => { setFocus("material") }, 50)
                        }}
                        onSelect={() => {
                            setValue("material", null)
                            setTimeout(() => { setFocus("material") }, 50)
                        }}
                        // label="Modelo"
                        name="modelo"
                        placeholder="Seleccione un modelo"
                        register={register}
                        errors={errors}
                        // className="flex items-center justify-center"
                        rules={{ required: "Debe seleccionar el modelo" }}
                        classNameSelect="!h-10 mt-2 !text-2xl !w-[200px]"
                        loading={isLoadingModels}
                        search={true}
                        control={control}
                        options={models.map((model) => { return { value: model.nombre, label: model.nombre } })}
                    />

                </div>
            } */}

            {!watchSector &&

                <SelectUseForm
                    label="Seleccione un sector para comenzar"
                    name="sector"
                    size="large"
                    placeholder="Seleccione un sector"
                    register={register}
                    errors={errors}
                    // rules={{ required: "Debe seleccionar el material" }}
                    className="w-full"
                    search={true}
                    control={control}
                    options={tipoMaterial == TIPO_MATERIALES.CUERO ? sectoresInventarioCueros : sectoresInventario}
                />
            }



            {watchSector &&
                <div className="w-full flex items-center gap-2">
                    <SelectUseForm
                        name="material"
                        placeholder="Seleccione un material"
                        register={register}
                        errors={errors}
                        classNameSelect="!h-16 mt-2 !text-2xl"
                        className="w-full !text-2xl"
                        rules={{ required: "Debe seleccionar el material" }}
                        loading={isLoading}
                        search={true}
                        onSelect={keyPressEnter}
                        control={control}
                        options={mats.map((mat) => { return { value: mat.id, label: `${mat.codigo} | ${mat.nombre} | ${mat.color || ""}`, className: "!text-xl" } })}
                    />

                    <InputUseForm
                        name="pesaje"
                        className={`${tipoMaterial == TIPO_MATERIALES.TELA ? 'w-full' : '!w-[300px]'} mt-2`}
                        register={register}
                        classNameInput="!text-2xl !py-4 !bg-white !text-black"
                        errors={errors}
                        placeholder={tipoMaterial == TIPO_MATERIALES.TELA ? "Pesaje" : "Conteo"}
                        rules={{ required: `Ingrese ${tipoMaterial == TIPO_MATERIALES.TELA ? 'el pesaje' : 'la cantidad'}` }}
                        onKeyPress={keyPressEnterQty}
                        type="number"
                    />

                    <Controller
                        name="mantener"
                        control={control}
                        render={({ field }) =>
                            <div className="flex gap-1 !text-black">
                                <input type="checkbox" {...field} />
                                <label>Mantener material</label>
                            </div>
                        }
                    />
                </div>
            }

            {statusResponse.message && <span className={`${statusResponse.error ? "bg-main" : "bg-success"} text-xl w-full block rounded-md p-2 text-white mb-1`}>{statusResponse.message}</span>}

            {watchSector &&

                <ModalEditPesaje
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    isModalOpen={isModalOpen}
                    pesaje={pesaje}
                    setPesaje={setPesaje}
                    tipoMaterial={tipoMaterial}
                />

            }

            {watchSector &&
                <Table
                    size="small"
                    locale={{
                        emptyText: "No se encontraron registros",
                    }}
                    loading={isLoading}
                    className="w-full"
                    rowClassName={(record) => {
                        if (record?.confirmado == 0) {
                            return "bg-red-400 font-semibold"
                        }
                    }}
                    pagination={{
                        pageSize: 30,
                        showSizeChanger: false,
                    }}
                    bordered={true}
                    columns={columns}
                    dataSource={pesajes}
                    rowKey={(item) => item.id}
                />
            }
        </div>
    )
}