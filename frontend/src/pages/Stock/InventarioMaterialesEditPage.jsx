import InputUseForm from "@components/InputUseForm";
import ModalEditPesaje from "@components/ModalEditPesaje";
import SelectUseForm from "@components/SelectUseForm";
import { useAuth } from "@hooks/useAuth";
import useTables from "@hooks/useTables";
import useUsers from "@hooks/useUsers";
import { getInventarioMaterial, updatePesaje } from "@services/StockService";
import { ROLES } from "@utils/Constants";
import { formatDateTime } from "@utils/Utils";
import { Popconfirm, Table } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function InventarioMaterialesEditPage() {
    const { response: materiales, isLoading: isLoadingMats, deleteTable } = useTables("materiales_piezas/TELA", true)
    const { register, control, watch, formState: { errors } } = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pesaje, setPesaje] = useState(0)
    const [editId, setEditId] = useState(null)
    const { userData } = useAuth()

    const { isLoading: isLoadingUsers, response: users } = useUsers(true)

    const [movimientos, setMovimientos] = useState([])
    const watchMaterial = watch("material", '')
    const watchFecha = watch("fecha", '')
    const watchUser = watch("user", '')

    const columns = [
        {
            title: 'Cod. Material',
            dataIndex: 'cod_material',
            key: 'cod_material',
            render: (_, record) => record.material.codigo
        },
        {
            title: 'Material',
            dataIndex: 'material',
            key: 'material',
            render: (_, record) => record.material.nombre
        },
        {
            title: 'Pesaje',
            dataIndex: 'cantidad',
            key: 'cantidad',
            align: "right",
            render: (text) => parseFloat(text).toFixed(3)
        },
        {
            title: 'Fecha',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => formatDateTime(text)
        },
        {
            title: 'Usuario',
            dataIndex: 'user',
            key: 'user',
            render: (_, record) => record?.user?.name
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (_, record) => <div className="flex items-center gap-2">
                <button
                    onClick={() => {
                        setPesaje(parseFloat(record.cantidad).toFixed(3))
                        setEditId(record.id)
                        setIsModalOpen(true)
                    }} className="text-sm px-2 py-1 bg-blue-400"
                >
                    Editar
                </button>
                <Popconfirm
                    title="Eliminar pesaje"
                    description="¿Está seguro que desea eliminar el pesaje? No se podrá recuperar"
                    onConfirm={() => { deletePesaje(record.id) }}
                    okButtonProps={{
                        className: "bg-green-500"
                    }}
                    // onCancel={cancel}
                    okText="Si"
                    cancelText="No"
                >
                    <button className="text-sm px-2 py-1 bg-red-500"
                    >
                        Eliminar
                    </button>
                </Popconfirm>
            </div>
        },

    ];

    const fetchMovimientos = async () => {
        setIsLoading(true)
        const temp = new Date(watchFecha)

        const data = await getInventarioMaterial(watchMaterial, `${temp.getFullYear()}-${temp.getMonth() + 1}-${temp.getDate()}`, watchUser)
        setMovimientos(data.data)
        setIsLoading(false)
    }

    const deletePesaje = async (id) => {
        const response = await deleteTable({ id: id, table: "inventario_materiales_piezas" })
        fetchMovimientos()
    }

    useEffect(() => {
        if (watchMaterial && watchFecha) {
            fetchMovimientos()
        }
    }, [watchMaterial, watchFecha, watchUser])


    const handleOk = async () => {

        if (parseFloat(pesaje) == 0 || pesaje == "") {
            return
        }

        const response = await updatePesaje(editId, { cantidad: pesaje })
        if (!response.error) {
            setIsModalOpen(false)
            fetchMovimientos()
            setEditId(null)
        }
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }


    return (
        <div>
            <div>
                <div className="flex items-center gap-2">
                    <SelectUseForm
                        name="material"
                        placeholder="Seleccione un material"
                        register={register}
                        errors={errors}
                        classNameSelect="!h-16 mt-2 !text-2xl"
                        className="w-full !text-2xl"
                        rules={{ required: "Debe seleccionar el material" }}
                        loading={isLoadingMats}
                        search={true}
                        control={control}
                        options={materiales.map((mat) => { return { value: mat.id, label: `${mat.codigo} | ${mat.nombre} | ${mat.color || ""}`, className: "!text-xl" } })}
                    />

                    <InputUseForm
                        name="fecha"
                        classNameInput="!h-16 mt-2 !text-2xl"
                        type="date"
                        control={control}
                        className="w-full"
                        register={register}
                        errors={errors}
                        placeholder="Fecha inventario"
                        rules={{ required: "La fecha de inventario es requerida" }}
                    />

                    {(userData?.rol?.id == ROLES.DESARROLLO || userData?.rol?.id == ROLES.IT || userData?.rol?.id == ROLES.ADMINISTRADOR) &&
                        <SelectUseForm
                            name="user"
                            placeholder="Seleccione un usuario"
                            register={register}
                            errors={errors}
                            classNameSelect="!h-16 mt-2 !text-2xl"
                            className="w-full !text-2xl"
                            loading={isLoadingUsers}
                            search={true}
                            control={control}
                            options={users?.data?.map((user) => { return { value: user.id, label: user.name } })}
                        />
                    }
                </div>


                <Table
                    size="small"
                    locale={{
                        emptyText: "No se encontraron registros",
                    }}
                    className="w-full"
                    pagination={false}
                    bordered={true}
                    columns={columns}
                    dataSource={movimientos}
                    loading={isLoading}
                    rowKey={(item) => item.id}
                    summary={(pageData) => {
                        let totalKg = 0;
                        pageData.forEach(({ cantidad }) => {
                            totalKg = totalKg + parseFloat(cantidad || 0)
                        });
                        return (
                            <>
                                <Table.Summary.Row className="bg-green-300">
                                    <Table.Summary.Cell index={0}><span className=" font-bold">TOTALES</span></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                                    <Table.Summary.Cell align="right" index={2}><span className=" font-bold">KG {totalKg.toFixed(3)}</span></Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={5}></Table.Summary.Cell>
                                </Table.Summary.Row>
                            </>
                        );
                    }}
                />

                <ModalEditPesaje
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    isModalOpen={isModalOpen}
                    pesaje={pesaje}
                    setPesaje={setPesaje}
                />

            </div>
        </div>
    )
}
