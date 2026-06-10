import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import useMenu from "@hooks/useMenu";
import useUsers from "@hooks/useUsers";
import { message, Table } from "antd";
import { useForm } from "react-hook-form";
import InputUseForm from "@components/InputUseForm";
import { Tabs } from 'antd';
import QRCode from "react-qr-code";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useState } from "react";
import { Input } from "antd";
import { createUser } from "../services/UserService";
import { getOperaciones } from "../services/LineaOperacionesService";
import { useEffect } from "react";

const lineas = [
    { label: '', value: null },
    { label: 'M1', value: 'M1' },
    { label: 'S1', value: 'S1' },
    { label: 'M2', value: 'M2' },
    { label: 'S2', value: 'S2' },
    { label: 'M3', value: 'M3' },
    { label: 'S3', value: 'S3' },
    { label: 'M4', value: 'M4' },
    { label: 'S4', value: 'S4' },
    { label: 'M5', value: 'M5' },
    { label: 'S5', value: 'S5' },
    { label: 'M6', value: 'M6' },
    { label: 'S6', value: 'S6' },
    { label: 'M7', value: 'M7' },
    { label: 'S7', value: 'S7' },
    { label: 'M8', value: 'M8' },
    { label: 'S8', value: 'S8' },
    { label: 'M9', value: 'M9' },
    { label: 'S9', value: 'S9' },
    { label: 'M10', value: 'M10' },
    { label: 'S10', value: 'S10' },
    { label: 'M11', value: 'M11' },
    { label: 'S11', value: 'S11' },
]

export default function ConfigurationPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const [operaciones, setOperaciones] = useState([])

    const { response: users, isLoading: isLoadingUsers, updateUserData, getData } = useUsers(true)
    const { response: menu, isLoading, getMenuUser, saveMenu, apps } = useMenu(true)
    const { register, reset, watch, control, handleSubmit, formState: { errors }, setValue } = useForm();
    const [userFilter, setUserFilter] = useState([])

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const fetchOperaciones = async () => {
        const data = await getOperaciones()
        const res = data?.data

        res?.forEach(r => {
            if (r?.operaciones?.length > 0) {
                r?.operaciones.unshift({
                    nombre: '',
                    id: null
                })
            }
        })

        // res.unshift({})
        setOperaciones(res)
    }

    const fetchMenuUser = async (userId) => {

        const data = await getMenuUser(userId, true)
        const options = []

        if (!data.error) {
            data.data.forEach((d) => {
                options.push(d.menu_id)
            })

            setValue("menu", options)

            const user = users?.data?.find(u => u.id == userId)
            setUserFilter(users?.data)

            setValue("cod_autorizacion", user?.cod_autorizacion)
            setValue("name", user?.name)
            setValue("email", user?.email)
            setValue("rol", user?.rol + "")
            setValue("turno", user?.turno + "")
            setValue("departamento", user?.departamento + "")
            setValue("area", user?.area + "")

            if (user?.linea?.linea_id) {
                if (user?.linea?.sublinea == "1") {
                    setValue("linea", "S" + user?.linea?.linea_id)
                } else {
                    setValue("linea", "M" + user?.linea?.linea_id)
                }
            } else {
                setValue("linea", null)
            }

            if (user?.operacion?.id) {
                setValue("operacion", parseInt(user?.operacion?.operacion_id))
            } else {
                setValue("operacion", null)
            }

            setValue("titular", parseInt(user?.linea?.titular))
        }
    }

    const executeUserUpdate = async (data, update = false) => {
        let sublinea = "0", linea
        let response;

        if (data?.linea) {
            linea = data?.linea?.replace("M", "").replace("S", "")
            if (data.linea.indexOf("S") >= 0) {
                sublinea = "1"
            } else {
                sublinea = "0"
            }
        } else {
            linea = ""
        }

        const payloadUser = {
            'cod_autorizacion': data?.cod_autorizacion,
            'password': data?.password,
            'name': data?.name,
            'email': data?.email,
            'rol': data?.rol,
            'turno': data?.turno,
            'departamento': data?.departamento,
            'area': data?.area,
        }

        const payloadLinea = {
            'titular': data?.titular,
            'linea': linea,
            'sublinea': sublinea,
            'operacion': data?.operacion ? data?.operacion : 0
        }

        if (update) {
            response = await updateUserData(data.user, payloadUser, payloadLinea)
        } else {
            response = await createUser({ data: payloadUser, lineaData: payloadLinea })
        }

        return response
    }

    const onSubmit = async (data) => {

        // console.log(data)
        let res, creoUsuario = false

        if (data?.user == null || data?.user?.length == 0) {
            //es creacion de usuario

            res = await executeUserUpdate(data, false)

            if (!res?.error || !res?.data?.id) {
                data.user = res.data?.id
                creoUsuario = true
            } else {
                message.error(res.message || "No se pudo crear el usuario")
                return
            }
        }

        // console.log(data.user)
        if (data.user) {
            const response = await saveMenu({ userId: data.user, menu: data.menu }, true)

            if (response.error) {
                message.error(response.message)
            } else {
                if (creoUsuario) {
                    message.success("Grabado correctamente")
                    reset({ user: null, menu: [], password: null, cod_autorizacion: null, name: null, email: null, rol: null, turno: null, departamento: null, linea: null, titular: 0, area: null, operacion: null })
                    getData()
                } else {
                    res = await executeUserUpdate(data, true)
                    if (res.error) {
                        message.error(res.message)
                    } else {
                        message.success("Grabado correctamente")
                        reset({ user: null, menu: [], password: null, cod_autorizacion: null, name: null, email: null, rol: null, turno: null, departamento: null, linea: null, titular: 0, area: null, operacion: null })
                        getData()
                    }
                }
            }
        }
    }

    const watchName = watch('email', null)
    const watchCodAutorizacion = watch('cod_autorizacion', null)
    const watchLinea = watch('linea', null)

    useEffect(() => {
        fetchOperaciones()
    }, [])

    // console.log(users?.data)
    return (
        <div className="">
            {contextHolder}

            <div className="w-full flex items-center justify-center gap-2">

                <SelectUseForm
                    name="user"
                    className="w-full"
                    placeholder="Seleccione un usuario"
                    register={register}
                    errors={errors}
                    onSelect={(option) => fetchMenuUser(option)}
                    loading={isLoadingUsers}
                    search={true}
                    control={control}
                    options={users?.data?.map((user) => { return { key: user.id, value: user.id, label: `${user?.email} - ${user.name}` } })}
                />
                {!isLoading && <div className="flex justify-end mt-[-10px]"><button onClick={handleSubmit(onSubmit)} className="bg-green-500 text-xs">GUARDAR</button></div>}
                {!isLoading && <div className="flex justify-end mt-[-10px]">
                    <button
                        onClick={() => {
                            reset({ user: null, menu: [], password: null, cod_autorizacion: null, name: null, email: null, rol: null, turno: null, departamento: null, linea: null, titular: 0, area: null })
                        }}
                        className="bg-blue-500 text-xs">NUEVO</button>
                </div>}
            </div>



            {/* {!isLoading && */}
            <div className="flex items-start gap-2 justify-between w-full h-full">

                <div className="border border-gray-300 rounded-md w-[600px] h-full p-2 flex flex-col gap-1">
                    <Input
                        placeholder="Buscar"
                        allowClear
                        className="w-full border border-gray-300 rounded-md"
                        onChange={(e) => {
                            const value = e?.target?.value?.toUpperCase()
                            const temp = users?.data?.filter(u => u?.email?.toUpperCase()?.indexOf(value) >= 0 || u?.departamento?.toUpperCase()?.indexOf(value) >= 0 || u?.area?.toUpperCase()?.indexOf(value) >= 0)
                            setUserFilter(temp)
                        }}
                    />


                    {/* <div className="flex flex-col items-center justify-center min-h-full !w-full"> */}
                    <Table
                        loading={isLoading}
                        size="small"
                        className="w-full !text-xs h-full"
                        pagination={{
                            pageSize: 20,
                            showSizeChanger: false,
                        }}
                        dataSource={userFilter}
                        rowKey={r => r.id}
                        columns={[
                            {
                                className: '!text-xs',
                                key: 'email',
                                title: 'Nombre',
                                dataIndex: 'email'
                            },
                            {
                                className: '!text-xs',
                                key: 'departamento',
                                title: 'Departamento',
                                dataIndex: 'departamento'
                            },
                            {
                                className: '!text-xs',
                                key: 'area',
                                title: 'Sector',
                                dataIndex: 'area'
                            },
                            {
                                className: '!text-xs',
                                key: 'linea',
                                title: 'Linea',
                                dataIndex: 'linea',
                                render: (_, r) => {
                                    if (r?.linea) {
                                        if (parseInt(r?.linea?.sublinea) == 1) {
                                            return 'S' + r?.linea?.linea_id
                                        } else {
                                            return 'M' + r?.linea?.linea_id
                                        }
                                    }
                                }
                            },
                            {
                                title: 'Acciones',
                                key: 'accion',
                                render: (_, r) => <button onClick={() => {
                                    setValue("user", r.id)
                                    fetchMenuUser(r.id)
                                }} className="text-xs bg-transparent !p-0 border-none">Editar</button>
                            }
                        ]}
                    />
                    {/* </div> */}
                </div>

                {isLoading ?
                    <div className="w-full flex flex-col items-center justify-center mt-10">
                        <Loader fontSize={60} />
                        <span className="font-sm font-semibold mt-2">Cargando</span>
                    </div>
                    :
                    <Tabs
                        className="w-full"
                        items={[
                            {
                                key: 't1',
                                label: 'Datos',
                                children: <div className="">
                                    <span className="font-bold text-sm border-b-2 block w-full py-2 mb-2">Datos de usuario</span>

                                    <div className="flex items-center gap-2">
                                        <InputUseForm
                                            label="Usuario"
                                            name="name"
                                            className="w-full !bg-white"
                                            classNameInput='!bg-white'
                                            register={register}
                                            errors={errors}
                                            placeholder="Usuario"
                                        />

                                        <InputUseForm
                                            label="Nombre"
                                            name="email"
                                            className="w-full !bg-white"
                                            classNameInput='!bg-white'
                                            register={register}
                                            errors={errors}
                                            placeholder="Nombre"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">

                                        <InputUseForm
                                            label="Nueva contraseña"
                                            name="password"
                                            className="w-full !bg-white"
                                            classNameInput='!bg-white'
                                            register={register}
                                            errors={errors}
                                            placeholder="Contraseña"
                                        />

                                        <InputUseForm
                                            label="Código de autorización"
                                            name="cod_autorizacion"
                                            className="w-full !bg-white"
                                            classNameInput='!bg-white'
                                            register={register}
                                            errors={errors}
                                            placeholder="Código de autorización"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <SelectUseForm
                                            name="rol"
                                            label="Rol"
                                            placeholder="Seleccione un rol"
                                            className="w-full"
                                            register={register}
                                            errors={errors}
                                            loading={isLoadingUsers}
                                            search={true}
                                            control={control}
                                            options={[
                                                {
                                                    value: '10',
                                                    label: 'TEAM MEMBER'
                                                },
                                                {
                                                    value: '15',
                                                    label: 'UTILITY'
                                                },
                                                {
                                                    value: '20',
                                                    label: 'TEAM LEADER'
                                                },
                                                {
                                                    value: '30',
                                                    label: 'GROUP LEADER'
                                                },
                                                {
                                                    value: '40',
                                                    label: 'JEFE DE TURNO'
                                                },
                                                {
                                                    value: '50',
                                                    label: 'COORDINADOR'
                                                },
                                                {
                                                    value: '60',
                                                    label: 'GERENTE'
                                                },
                                                {
                                                    value: '70',
                                                    label: 'DEV'
                                                }
                                            ]}
                                        />

                                        <SelectUseForm
                                            name="turno"
                                            label="Turno"
                                            className="w-full"
                                            placeholder="Seleccione un turno"
                                            register={register}
                                            errors={errors}
                                            loading={isLoadingUsers}
                                            search={true}
                                            control={control}
                                            options={[
                                                {
                                                    value: 'B',
                                                    label: 'BLANCO'
                                                },
                                                {
                                                    value: 'A',
                                                    label: 'AMARILLO'
                                                },
                                                {
                                                    value: 'C',
                                                    label: 'CENTRAL'
                                                },

                                            ]}
                                        />

                                        <SelectUseForm
                                            name="departamento"
                                            label="Departamento"
                                            className="w-full"
                                            placeholder="Seleccione un departamento"
                                            register={register}
                                            errors={errors}
                                            loading={isLoadingUsers}
                                            search={true}
                                            control={control}
                                            options={[
                                                {
                                                    value: 'PRODUCCION',
                                                    label: 'PRODUCCIÓN'
                                                },
                                                {
                                                    value: 'CALIDAD',
                                                    label: 'CALIDAD'
                                                },
                                                {
                                                    value: 'INGENIERIA',
                                                    label: 'INGENIERIA'
                                                },
                                                {
                                                    value: 'IT',
                                                    label: 'IT'
                                                },
                                                {
                                                    value: 'PC',
                                                    label: 'PC'
                                                },
                                                {
                                                    value: '',
                                                    label: 'OTRO'
                                                },

                                            ]}
                                        />

                                        <SelectUseForm
                                            name="area"
                                            label="Sector"
                                            className="w-full"
                                            placeholder="Seleccione un sector"
                                            register={register}
                                            errors={errors}
                                            loading={isLoadingUsers}
                                            search={true}
                                            control={control}
                                            options={[
                                                {
                                                    value: 'CORTE',
                                                    label: 'CORTE'
                                                },
                                                {
                                                    value: 'COSTURA',
                                                    label: 'COSTURA'
                                                },
                                                {
                                                    value: 'MTTO',
                                                    label: 'MTTO'
                                                },
                                                {
                                                    value: 'MH',
                                                    label: 'MH'
                                                },
                                                {
                                                    value: 'DOJO',
                                                    label: 'DOJO'
                                                }
                                            ]}
                                        />
                                    </div>

                                    <div className="flex items-center justify-center gap-2">
                                        <SelectUseForm
                                            name="linea"
                                            label="Línea"
                                            className="w-[200px]"
                                            placeholder="Seleccione una línea"
                                            register={register}
                                            errors={errors}
                                            loading={isLoadingUsers}
                                            search={true}
                                            control={control}
                                            options={lineas?.map(l => { return { value: l.value, label: l.label } })}
                                        />
                                        <SelectUseForm
                                            name="operacion"
                                            label="Operación"
                                            className="w-[200px]"
                                            placeholder="Seleccione una operación"
                                            register={register}
                                            errors={errors}
                                            loading={isLoadingUsers}
                                            search={true}
                                            control={control}
                                            options={operaciones?.find(o => o?.linea == watchLinea)?.operaciones?.map(l => { return { value: l.id, label: l.nombre } })}
                                        />

                                        <div className="flex items-center gap-1 w-full mt-10">
                                            <input type="checkbox" {...register('titular')} />
                                            <label>Es titular</label>
                                        </div>
                                    </div>

                                    {(watchCodAutorizacion && watchName) &&
                                        <button onClick={() => handlePrint()}>
                                            <div className="flex items-center flex-col" ref={componentRef}>
                                                <QRCode value={watchCodAutorizacion} size={100} bordered={false} />
                                                <span className="block text-center text-xl font-bold">{watchName}</span>
                                            </div>
                                        </button>
                                    }
                                </div>
                            },
                            {
                                key: 't2',
                                label: 'Menú',
                                children: <div>
                                    {!isLoading && apps?.map((a, idxx) => (
                                        <div key={`cont_${idxx}`}>
                                            <span key={`m_${idxx}`} className="font-bold text-sm border-b-2 block w-full py-2 mb-2">{a}</span>
                                            <div className="grid grid-cols-5 gap-1">
                                                {menu?.data?.filter(m => m?.app == a)?.map((m, idx) => (
                                                    <div key={`menu_${idx}`} className="text-xs w-full mb-2 flex items-center gap-1">
                                                        <input className="" {...register("menu")} type="checkbox" id={`menu${idx}`} value={m.id} />
                                                        <label htmlFor={`menu${idx}`} className=' font-semibold'>{m?.nombre}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            }
                        ]}
                    />
                }
            </div>


        </div>
    )
}
