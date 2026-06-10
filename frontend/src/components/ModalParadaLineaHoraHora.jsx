import { Form, InputNumber, Modal, Popconfirm, Select, Spin, Table } from 'antd'
import { useEffect, useState } from 'react'
import { deleteParada, saveParadaLinea, searchParadasLinea } from '../services/HoraHoraService'

const motivos = [
    { label: 'RRHH - Ausentismo' },
    { label: 'RRHH - Rotación' },
    { label: 'KZN - Cuellos de Botella' },
    { label: 'KZN - Habilidad' },
    { label: 'QC - Defectos de proveedor' },
    { label: 'QC - Problemas de Calidad' },
    { label: 'MH - Falta de material en carga' },
    { label: 'MH - Retraso en abastecimiento' },
    { label: 'MTTO - Cambio de aguja' },
    { label: 'MTTO - Falla en maquina' },
]

export default function ModalParadaLineaHoraHora({ isVisible, setIsVisible, idEdit = null, dataSource = null, modoTactil = false }) {
    const [form] = Form.useForm()
    const [item, setItem] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [paradas, setParadas] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const watchMotivo = Form.useWatch('motivo', form)

    useEffect(() => {
        if (isVisible && idEdit) {
            setParadas([])
            fetchData()
            form.resetFields()
        }
    }, [isVisible, idEdit])

    const fetchData = async () => {
        setIsLoading(true)
        const activeItem = dataSource.find(item => item.id === idEdit);
        setItem(activeItem)

        const response = await searchParadasLinea({
            filtros: {
                fecha: activeItem.fecha,
                turno: activeItem.turno,
                shop: `M${activeItem.linea}`,
                area: 'COSTURA',
                intervalo: activeItem.intervalo
            }
        })

        // console.log(response.data)
        setParadas(response?.data)
        setIsLoading(false)
    }

    const handleSubmit = async (data) => {
        setIsSaving(true)
        data.area = 'COSTURA'
        data.shop = `M${item.linea}`

        // if(!data?.contramedi)
        const response = await saveParadaLinea({ data: data, item: item })
        form.resetFields()
        setIsSaving(false)
        setIsVisible(false)

    }

    return (
        <Modal
            width={modoTactil ? "70%" : "50%"}
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            className='!mt-[-70px]'
            closable={false}
            footer={[
                <div key={`div1`} className='flex items-center gap-2 justify-end mt-4'>
                    <button disabled={isSaving} className='bg-red-400 text-xl' onClick={() => setIsVisible(false)}>CANCELAR</button>
                    <button disabled={isSaving} loading={isSaving} className='bg-green-400 text-xl flex items-center gap-1' onClick={() => form.submit()}>{isSaving && <Spin />}{isSaving ? 'GUARDANDO' : 'CONFIRMAR'}</button>
                </div>
            ]}
        >
            <div className='w-full bg-white'>

                <span className={`bg-blue-400 block w-full text-center p-2 ${modoTactil ? 'text-4xl' : 'text-xl'} font-semibold`}>INFORMAR PARADA DE LINEA</span>

                <div className='flex items-center gap-2 justify-between'>
                    <span className='text-xl font-semibold block w-full text-center py-2 '>INTERVALO : {item?.intervalo}</span>
                    {item?.modelo && <span className='text-xl font-semibold block w-full text-center py-2 '>MODELO : {item?.modelo}</span>}
                </div>

                <Form onFinish={handleSubmit} form={form} layout='vertical' className='flex flex-col gap-0'>
                    <div className='flex items-center w-full justify-between gap-4'>
                        {!modoTactil ?
                            <Form.Item
                                className='w-full'
                                label='Motivo'
                                rules={[{ required: true, message: 'Seleccione un motivo' }]}
                                name='motivo'
                            >
                                <Select
                                    options={motivos.map((m) => { return { value: m?.label, label: m?.label } })}
                                />
                            </Form.Item>
                            :
                            <Form.Item
                                className='w-full'
                                rules={[{ required: true, message: 'Seleccione un motivo' }]}
                                name='motivo'
                            >
                                <div className='flex flex-col gap-2'>
                                    <span className='text-2xl font-semibold'>Motivo:</span>
                                    <div className='grid grid-cols-5 gap-2 items-center justify-center'>
                                        {motivos.map((m, idx) =>
                                            <button
                                                onClick={() => {
                                                    form.setFieldValue("motivo", m?.label)
                                                }}
                                                key={`btn_motivo_${idx}`}
                                                className={`w-full border bg-white text-black py-3 border-gray-400 text-xs min-w-[150px]  ${watchMotivo == m?.label && '!bg-orange-400'}`}>
                                                {m?.label}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Form.Item>
                        }

                        {modoTactil ?
                            <Form.Item
                                label='Minutos'
                                name='minutos'
                                rootClassName='!text-2xl'
                                // className='!text-2xl'
                                rules={[{ required: true, message: 'Ingrese los minutos' }]}
                            >
                                <InputNumber type='number' className='min-w-[200px] !text-3xl bg-white' />
                            </Form.Item>
                            :
                            <Form.Item
                                label='Minutos'
                                name='minutos'
                                rules={[{ required: true, message: 'Ingrese los minutos' }]}
                            >
                                <InputNumber type='number' className='w-full' />
                            </Form.Item>
                        }
                    </div>

                    <div className='flex items-start justify-between gap-2'>
                        <Form.Item
                            className='w-full'
                            label='Causa'
                            rules={[{ required: true, message: 'Ingrese la causa' }]}
                            name='causa'
                        >
                            <textarea rows={4} className='w-full text-xl border border-gray-300 rounded-md p-2  bg-white' />
                        </Form.Item>

                        <Form.Item
                            label='Contramedida'
                            name='contramedida'
                            rules={[{ required: true, message: 'Ingrese la contramedida' }]}
                            className='w-full '
                        >
                            <textarea rows={4} className='w-full text-xl border border-gray-300 rounded-md p-2  bg-white' />
                        </Form.Item>
                    </div>
                </Form>


                <Table
                    loading={isLoading}
                    pagination={false}
                    size='small'
                    rowKey={r => r.id}
                    // className='!mb-2'
                    columns={[
                        {
                            title: 'Motivo',
                            dataIndex: 'grupo',
                            render: (_, r) => r?.grupo + ' - ' + r?.categoria
                        },
                        {
                            title: 'Minutos',
                            dataIndex: 'minutos'
                        },
                        {
                            title: 'Contramedida',
                            dataIndex: 'contramedida'
                        },
                        {
                            title: 'Causa',
                            dataIndex: 'causa'
                        },
                        {
                            title: 'Acciones',
                            render: (_, r) => {
                                return <div className='flex items-center gap-4'>
                                    {/* <button className='text-xs p-0 bg-transparent text-blue-500'>EDITAR</button> */}

                                    <Popconfirm
                                        okButtonProps={{ className: 'bg-red-400' }}
                                        okText='Eliminar'
                                        onConfirm={async () => {
                                            await deleteParada(r?.id)
                                            await fetchData()
                                        }}
                                        title='¿Esta seguro que desea eliminar?'
                                    >
                                        <button className='text-xs py-1 px-2 rounded-none text-white bg-red-500'>ELIMINAR</button>
                                    </Popconfirm>
                                </div>
                            }
                        }
                    ]}
                    dataSource={paradas}
                />
            </div >

        </Modal >
    )
}
