import DrawItem from '@components/DrawItem';
import InputUseForm from '@components/InputUseForm';
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import useKanbanFallas from '@hooks/useKanbanFallas';
import { validaUsuarioPorCodigoValidacion } from "@services/AuthService";
import { retrabajarFunda, setearOperador } from '@services/FallasService';
import { estadosRetrabajo } from '@utils/Constants';
import { Modal, Popconfirm, Switch } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { jerarquias } from '../../utils/Constants';

const members = [
    { id: 1, email: 'QUIROGA AGUSTIN(M1-B/OP1)' },
    { id: 2, email: 'MEIANA LAZARO' },
    { id: 3, email: 'PERICHON. F   (M1-B/OP3)' },
    { id: 4, email: 'TOLAVA BRIAN (M1-B/OP4)' },
    { id: 5, email: 'MENDOZA GONZALO(M1 OP5)' },
    { id: 6, email: 'SANCHEZ MELANIE (M1-C/OP1)' },
    { id: 7, email: 'BERTI AGUSTINA (M1-C/OP2)' },
    { id: 8, email: 'CONTRERAS. B  (M1-C/OP3)' },
    { id: 9, email: 'VIDELA JULIAN (M1-C/OP4)' },
    { id: 10, email: 'MAGGIONI VISTORIA (S1/OP1)' },
    { id: 11, email: 'GUERRERO JULIAN (S1-OP2)' },
    { id: 12, email: 'RAMIREZ SONIA (S1-OP3)' },
    { id: 13, email: 'PELAYO PAMELA  (S1-OP4)' },
    { id: 14, email: 'SANFELIPE PABLO (S1-OP5)' },
    { id: 15, email: 'HERNANDEZ EZEQUIEL (S1-OP6)' },
    { id: 16, email: 'TORRES JOSE (S1-OP7)' },
    { id: 17, email: 'DORRONZORO KARINA' },
    { id: 18, email: 'LABORDE ROCIO  (S1-OP9)' },
    { id: 19, email: 'ROMERLO LEANDRO (S1-OP10)' },
]

export default function RetrabajoPage() {
    const { register, setFocus, getValues, control, watch, handleSubmit, setValue, formState: { errors } } = useForm();
    const { isLoading, response, fetchDataReporteInternoFallas, clearResponse } = useKanbanFallas()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userVigente, setUserVigente] = useState(null)
    const [userError, setUserError] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(false)
    const [errorOperacion, setErrorOperacion] = useState(null)
    const [editId, setEditId] = useState(null)

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

        setTimeout(() => {
            if (userVigente) {
                setFocus("qr")
            } else {
                setFocus("cod_autorizacion")
            }
        }, 50)
    }, [])

    const onSubmit = async (data) => {
        fetchDataReporteInternoFallas(data)
    }

    const clear = (withUser = true) => {
        setValue("qr", null)

        clearResponse()
        if (withUser) {
            setUserVigente(null)
            setTimeout(() => { setFocus("cod_autorizacion") }, [50])

        } else {
            setTimeout(() => { setFocus("qr") }, [50])
        }
    }

    const retrabajar = async (idRetrabajo, estado) => {

        const payload = {
            estado: estado,
            id: idRetrabajo,
            user: userVigente?.id
        }

        const data = await retrabajarFunda(payload)

        if (!data?.error) {
            handleSubmit(onSubmit)()
        }
    }

    const setOperacion = async () => {
        const member = getValues("member")
        const linea = getValues("main")

        if (member == '' || member == null) {
            setErrorOperacion("Debe informar el operario")
            return
        }

        setErrorOperacion(null)

        const payload = {
            operario: member,
            main: linea,
            id: editId
        }

        const res = await setearOperador(payload)

        if (!res?.error) {
            setEditId(null)
            setIsModalOpen(false)
            handleSubmit(onSubmit)()
        }

    }

    useEffect(() => {
        if (response?.data?.length == 0) {
            setValue("qr", null)

            setTimeout(() => {
                setFocus("qr")
            }, 50)
        }
    }, [response])



    return (
        <div className='flex flex-col gap-2 w-full px-1'>

            <Modal
                open={isModalOpen}
                title="Asignación de operación y operador"
                onCancel={() => setIsModalOpen(false)}
                okButtonProps={{ className: 'bg-green-400' }}
                okText="Confirmar"
                onOk={() => setOperacion()}
            >
                <div className='flex flex-col items-center gap-2'>
                    <span className='w-full text-start'>Seleccione el operador y la operación donde se genero el defecto</span>

                    <div className='flex items-center gap-2'>
                        <span className='font-semibold text-xl'>SUB</span>
                        <Controller
                            name="main"
                            control={control}
                            render={({ field }) =>
                                <Switch defaultChecked {...field} />
                            }
                        />
                        <span className='font-semibold text-xl'>MAIN</span>
                    </div>

                    <SelectUseForm
                        label="Operario"
                        name="member"
                        size="default"
                        placeholder="Seleccione un operario"
                        register={register}
                        errors={errors}
                        className="w-full"
                        search={true}
                        control={control}
                        options={members.map((m) => { return { value: m.id, label: m.email, className: "!text-sms" } })}
                    />

                    {errorOperacion && <span className='block text-sm mb-4 font-semibold text-center text-red-500'>{errorOperacion?.toUpperCase()}</span>}
                </div>
            </Modal>

            <Modal
                closable={false}
                footer={[]}
                open={!userVigente}
            >
                <InputUseForm
                    name="cod_autorizacion"
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
                            setIsLoadingUser(true)
                            const response = await validaUsuarioPorCodigoValidacion(e.target.value)
                            e.target.value = ''

                            if (response?.error) {
                                setUserError(response.message)

                                setIsLoadingUser(false)
                                setValue("cod_autorizacion", null)
                                setTimeout(() => { setFocus("cod_autorizacion") }, [50])
                            } else {
                                setUserVigente(response?.data)
                                setIsLoadingUser(false)
                                setTimeout(() => { setFocus("qr") }, [50])
                            }
                        }
                    }}
                />

                {isLoadingUser && <div className="flex items-center justify-center mt-5"><Loader /></div>}
                {userError && <span className="text-red-500 font-semibold">{userError}</span>}
            </Modal>

            <span className='w-full bg-orange-800 text-white text-center py-2 text-5xl font-bold'>ÁREA DE RETRABAJOS</span>
            <div className='flex items-center w-full gap-2'>
                <InputUseForm
                    disabled={response?.data?.length > 0}
                    label="Escanear etiqueta"
                    name="qr"
                    size="large"
                    className="w-full"
                    classNameLabel="!mt-0 !mb-0"
                    classNameInput="!py-4 !text-2xl"
                    rules={{ required: 'Debe escanear un etiqueta' }}
                    register={register}
                    control={control}
                    errors={errors}
                    placeholder="Qr"
                    onKeyPress={async (e) => {
                        if (e.key == 'Enter' && e.target.value != '') {
                            handleSubmit(onSubmit)()
                        }
                    }}
                />
                <button onClick={handleSubmit(onSubmit)} className='bg-green-400 mt-8 text-2xl py-4 w-[200px] hover:opacity-70'>BUSCAR</button>
                <button onClick={() => clear(false)} className='bg-orange-400 mt-8 text-2xl py-4 w-[200px] hover:opacity-70'>CANCELAR</button>
            </div>

            {isLoading &&
                <div className='flex items-center justify-center'>
                    <Loader fontSize={100} />
                </div>
            }

            {!isLoading && response?.data?.length == 0 && <div className='w-full text-center mt-10'><span className='text-4xl text-gray-600 font-bold'>NO HAY DATOS PARA MOSTRAR</span></div>}

            {userVigente &&
                <div className='w-full bg-yellow-400 text-center flex items-center justify-center gap-2 left-0 bottom-0 fixed z-20'>
                    <span className='block p-2 text-lg text-black font-semibold'>USUARIO : {userVigente?.email?.toUpperCase()}</span>
                    <button onClick={() => clear()} className='p-0 px-4 text-lg'>SALIR</button>
                </div>
            }

            <div className='grid grid-cols-4 gap-2 mb-20 '>
                {!isLoading && response?.data?.map((r, idx) => {
                    return <div key={`r_${idx}`} className='w-full h-[70vh] border-2 border-gray-400 rounded-md p-2 flex flex-col items-start gap-2 mt-1'>
                        <div className='flex flex-col gap-0 w-full'>
                            <div className='flex items-center justify-between border-b pb-1'>
                                <span className='font-bold text-xl '>{r?.etiqueta?.modelod?.nombre}</span>
                            </div>
                            <span className='font-bold text-lg block'>{r?.falla?.codigo} - {r?.falla?.nombre?.toUpperCase()}</span>

                            <div className='flex items-center w-full justify-between'>
                                <span className='text-sm font-semibold'>CANTIDAD : {r?.cantidad}</span>
                                <span className='text-sm font-semibold'>TIPO : {r?.tipo?.tipo} {r?.lado?.lado}</span>
                            </div>
                        </div>

                        <div className='w-full h-full relative'>
                            {(r?.estado != estadosRetrabajo.PENDIENTE) &&
                                <div className={`absolute z-20 mt-10 text-center w-full ${r?.estado == estadosRetrabajo.RETRABAJADO && 'bg-green-500'} ${r?.estado == estadosRetrabajo.RECHAZADO && 'bg-red-500'}`}>
                                    <span className='px-2 py-4 block text-3xl font-semibold text-white'>{r?.estado}</span>
                                </div>
                            }
                            <DrawItem
                                image={{
                                    id: r?.imagen?.id,
                                    image: r?.imagen?.imagen,
                                    typeId: r?.tipo_id,
                                    type: r?.tipo?.tipo
                                }}
                                circles={[{
                                    id: r?.id,
                                    x: parseInt(r?.x),
                                    y: parseInt(r?.y),
                                    screenX: event?.screenX,
                                    screenY: event?.screenY,
                                    falla: r?.falla,
                                    cantidad: r?.cantidad,
                                    color: r?.color,
                                    type: r?.tipo_id,
                                    lado: r?.lado_id,
                                    typeName: r?.tipo?.tipo,
                                    ladoName: r?.lado?.lado,
                                    imageId: r?.imagen?.id,
                                    qr: r?.qr,
                                    linea: r?.etiqueta?.linea,
                                    modelo: r?.etiqueta?.modelod?.nombre
                                }]}
                                addCircle={() => { }}
                                deleteCircle={() => { }}
                            />
                        </div>

                        {r?.user_operacion_id != null ?
                            <div className='flex items-center justify-between w-full gap-4'>
                                <Popconfirm
                                    disabled={r?.estado != estadosRetrabajo.PENDIENTE}
                                    onConfirm={() => retrabajar(r?.id, estadosRetrabajo.RECHAZADO)}
                                    okText='Rechazar'
                                    okButtonProps={{ className: 'bg-red-500 ' }}
                                    title='¿Está seguro que desea rechazar este retrabajo?'
                                >
                                    <button disabled={r?.estado != estadosRetrabajo.PENDIENTE} className='disabled:opacity-70 py-2 disabled:cursor-not-allowed px-3 text-lg bg-red-400 w-full'>RECHAZAR</button>
                                </Popconfirm>

                                <Popconfirm
                                    disabled={r?.estado != estadosRetrabajo.PENDIENTE}
                                    onConfirm={() => retrabajar(r?.id, estadosRetrabajo.RETRABAJADO)}
                                    okText='Confirmar'
                                    okButtonProps={{ className: 'bg-green-500 ' }}
                                    title='¿Está seguro que desea confirmar este retrabajo?'
                                >
                                    <button disabled={r?.estado != estadosRetrabajo.PENDIENTE} className='disabled:opacity-70 py-2 disabled:cursor-not-allowed px-3 text-lg bg-green-400 w-full'>RETRABAJADO</button>
                                </Popconfirm>
                            </div>
                            :
                            <div className='w-full'>
                                {userVigente?.rol >= jerarquias.TEAM_LEADER ?
                                    <button onClick={() => {
                                        setEditId(r?.id)
                                        setValue("member", null)
                                        setIsModalOpen(true)
                                    }} className='w-full text-lg py-2 bg-blue-300 '>ASIGNAR OPERACIÓN</button>
                                    :
                                    <span className='bg-red-300 animate-pulse w-full block text-center font-semibold text-lg'>TL DEBE ASIGNAR OPERACIÓN</span>
                                }
                            </div>
                        }
                    </div>
                })}
            </div>

            {/* <Table
                loading={isLoading}
                dataSource={response?.data}
                columns={columns}
                rowKey={row => row.id}
                pagination={{
                    pageSize: 40
                }}
                size='small'
                rowClassName={(r, id) => {
                    if (id % 2 == 0) {
                        return "bg-slate-200"
                    }
                }}
                scroll={{
                    // x: 520,
                    y: 700
                }}
            /> */}

        </div>
    )
}
