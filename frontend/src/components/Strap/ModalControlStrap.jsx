import InputUseForm from "@components/InputUseForm";
import { Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { verificaUsuarioValidoStrap, modificaStrap } from "@services/StrapService";
import { validaUsuarioPorCodigoValidacion } from "@services/AuthService";

import Loader from "@components/Loader";
import useStrap from "@hooks/useStrap";
import { Tag } from "antd";
import SelectUseForm from "@components/SelectUseForm";
import { jerarquias } from "../../utils/Constants";

const posiciones = [
    {
        value: 'A1',
        label: 'A1'
    },
    {
        value: 'A2',
        label: 'A2'
    },
    {
        value: 'B1',
        label: 'B1'
    },
    {
        value: 'B2',
        label: 'B2'
    },
    {
        value: 'C1',
        label: 'C1'
    },
    {
        value: 'C2',
        label: 'C2'
    },
    {
        value: 'D1',
        label: 'D1'
    },
    {
        value: 'D2',
        label: 'D2'
    }
]

const partsNumber = [
    {
        value: 'X7A13-A2900A',
        label: 'X7A13-A2900A'
    },
    {
        value: 'X7A14-A2901A',
        label: 'X7A14-A2901A'
    },
    {
        value: 'X7A15-A2902A',
        label: 'X7A15-A2902A'
    },
    {
        value: 'X7A16-A2903A',
        label: 'X7A16-A2903A'
    },
    {
        value: 'X7A19-A2917B',
        label: 'X7A19-A2917B'
    },
    {
        value: 'X7A20-A2918B',
        label: 'X7A20-A2918B'
    },
    {
        value: 'X7A17-A2904A',
        label: 'X7A17-A2904A'
    },
    {
        value: 'X7A18-A2905A',
        label: 'X7A18-A2905A'
    }
]

export default function ModalControlStrap({ isVisible, setIsVisible }) {

    const [user, setUser] = useState(null)
    const [userError, setUserError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const { isLoading: isLoadingStrap, response: straps, anular: anularStrap, filterData: fetchStraps } = useStrap()

    const { register, handleSubmit, control, formState: { errors }, setFocus, setValue } = useForm();

    const columns = [
        {
            title: 'Codigo Barra',
            dataIndex: 'codigo_barra',
            key: 'codigo_barra'
        },
        {
            title: 'Part Number',
            dataIndex: 'part_number',
            key: 'part_number'
        },
        {
            title: 'Lote',
            dataIndex: 'lote',
            key: 'lote'
        },
        {
            title: 'Box',
            dataIndex: 'posicion',
            key: 'posicion'
        },
        {
            title: 'Cantidad',
            dataIndex: 'cantidad',
            key: 'cantidad'
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (_, record) => {
                if (record.anulado == "1") {
                    return <Tag color="red-inverse">Anulado</Tag>
                } else if (record.entregado == "1") {
                    return <Tag color="orange-inverse">Entregado</Tag>
                } else if (record.remanente == "1") {
                    return <Tag color="blue-inverse">Reposición</Tag>
                }
            }
        },
        {
            title: 'Acciones',
            dataIndex: 'acciones',
            key: 'acciones',
            render: (_, record) => {
                if (record.anulado == "0" && record.remanente == "0" && record.entregado == "0") {
                    return <button
                        onClick={async () => {
                            const data = await modificaStrap(record.id, {
                                user: user.id,
                                anulado: true
                            })
                            if (!data?.error) {
                                handleSubmit(onSubmit)()
                            }
                        }}
                        className="text-xs bg-red-500 text-white">Anular</button>
                } else if (record.remanente == "1") {
                    return <button
                        onClick={async () => {
                            const cantidad = prompt("Ingrese la cantidad", record.cantidad)
                            // console.log(cantidad)
                            const data = await modificaStrap(record.id, {
                                cantidad: cantidad,
                                user: user.id
                            })
                            if (!data?.error) {
                                handleSubmit(onSubmit)()
                            }
                        }}
                        className="text-xs bg-blue-500 text-white">Modificar cantidad</button>
                } else if (record.anulado == "1") {
                    return <button
                        onClick={async () => {
                            const data = await modificaStrap(record.id, {
                                user: user.id,
                                anulado: false
                            })
                            if (!data?.error) {
                                handleSubmit(onSubmit)()
                            }
                        }}
                        className="text-xs bg-green-500 text-white">Reactivar</button>
                }
            }
        }
    ]

    const onSubmit = async (data) => {
        data.user = user.id
        fetchStraps(data)
    }

    useEffect(() => {
        if (isVisible) {
            setUser(null)
            setValue("autorizacion", null)
            setTimeout(() => setFocus("autorizacion"), [50])
        }
    }, [isVisible])

    useEffect(() => {
        if (user) {
            fetchStraps({ lote: null, posicion: null, part_number: null })
        }
    }, [user])

    if (!user && isVisible) {
        return <Modal
            closable={false}
            footer={[]}
            open={true}
        >
            <InputUseForm
                name="autorizacion"
                label="Ingrese el código de autorización"
                className="w-full"
                register={register}
                type="password"
                errors={errors}
                placeholder="Código de autorización"
                classNameInput="!text-3xl !py-4 !border-2 !border-black"
                onKeyPress={async (e) => {
                    if (e.key == 'Enter' && e.target.value != '') {
                        setUserError(null)
                        setIsLoading(true)
                        const response = await validaUsuarioPorCodigoValidacion(e.target.value)
                        e.target.value = ''
                        if (response?.error) {
                            setUserError(response.message)
                        } else {
                            //Verifico que sea TL o GL
                            if (response?.data?.rol < jerarquias.TEAM_LEADER) {
                                setUserError("No tiene permisos suficientes.")
                            } else {
                                setUser(response?.data)
                            }
                        }
                        setIsLoading(false)
                    }
                }}
            />

            <div className="flex flex-col gap-2">

                {isLoading && <div className="flex items-center justify-center mt-5"><Loader /></div>}
                {userError && <span className="text-red-500 font-semibold">{userError}</span>}

                <button className="bg-red-500" onClick={() => {
                    setUserError(null)
                    setIsVisible(false)
                }}>SALIR</button>
            </div>
        </Modal>

    }

    return (

        <Modal
            title="Utilice los filtros para mejores resultados"
            width="100%"
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            onOk={() => {
                setUser(null)
                setIsVisible(false)
            }}
            style={{
                top: 10
            }}
            cancelButtonProps={{
                className: "bg-red-500"
            }}
            okButtonProps={{
                className: "bg-success"
            }}
        >
            <div className="flex items-center gap-2">
                <SelectUseForm
                    label="Box"
                    name="posicion"
                    placeholder="Seleccione una posición"
                    register={register}
                    errors={errors}
                    className="w-full "
                    search={true}
                    control={control}
                    options={posiciones}
                />

                <SelectUseForm
                    label="Part Number"
                    name="part_number"
                    placeholder="Seleccione un part number"
                    register={register}
                    errors={errors}
                    className="w-full "
                    search={true}
                    control={control}
                    options={partsNumber}
                />

                <InputUseForm
                    name="lote"
                    label="Lote"
                    className="w-full"
                    register={register}
                    errors={errors}
                    placeholder="Número de lote"
                    classNameLabel="!mb-0 !mt-2"
                    classNameInput="!py-2 !mt-4"
                />

                <button onClick={handleSubmit(onSubmit)} className="mt-10 bg-green-500">Buscar</button>
            </div>

            <Table
                loading={isLoadingStrap}
                size="small"
                columns={columns}
                dataSource={straps}
                rowKey={r => r.id}
                rowClassName={(r) => {
                    if (r.anulado == "1") {
                        return "bg-red-200"
                    }
                }}
                pagination={{
                    pageSize: 8
                }}
            />

        </Modal>
    )
}
