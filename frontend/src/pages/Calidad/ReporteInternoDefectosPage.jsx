import DrawItem from '@components/DrawItem';
import InputUseForm from '@components/InputUseForm';
import SelectUseForm from "@components/SelectUseForm";
import useFallas from '@hooks/useFallas';
import useKanbanFallas from '@hooks/useKanbanFallas';
import useModels from "@hooks/useModels";
import { getUserProduccion } from "@services/UserService";
import { estadosRetrabajo } from '@utils/Constants';
import { Modal, Table, Tag } from 'antd';
import { Excel } from "antd-table-saveas-excel";
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { RiFileExcel2Line } from "react-icons/ri";
import { formatDate, formatTime } from '../../utils/Utils';

export default function ReporteInternoDefectosPage() {
    const [users, setUsers] = useState([])

    const { register, control, handleSubmit, formState: { errors } } = useForm();
    const { isLoading: isLoadingModels, response: models, } = useModels()
    const { isLoading: isLoadingFalla, response: fallas } = useFallas(true)
    const { isLoading, response, fetchDataReporteInternoFallas } = useKanbanFallas()

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState({
        image: null,
        typeId: null,
        id: null
    })
    const [circlesData, setCirclesData] = useState([])

    // const watchLinea = watch('linea', null)

    const columns = [
        {
            title: 'Tipo',
            dataIndex: 'tipo_falla',
            key: 'tipo_falla',
            render: (text) => {
                if (text == "I") {
                    return <Tag color='blue'>INTERNO</Tag>
                } else {
                    return <Tag color='yellow'>EOL</Tag>
                }
            }
        },
        {
            title: 'Fecha',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => formatDate(text)
        },
        {
            title: 'Hora',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => formatTime(text)
        },
        {
            title: 'Turno',
            dataIndex: 'turno',
            key: 'turno',
            render: (text) => (text == 'B') ? 'BLANCO' : (text == 'A' ? 'AMARILLO' : 'SIN INFORMAR')
            // render: (_, record) => (record?.user?.turno == 'B') ? 'BLANCO' : (record?.user?.turno == 'A' ? 'AMARILLO' : 'SIN INFORMAR')
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            render: (text) => {
                if (text == estadosRetrabajo.RECHAZADO) {
                    return <Tag color='red'>Rechazado</Tag>
                } else if (text == estadosRetrabajo.RETRABAJADO) {
                    return <Tag color='blue'>Retrabajado</Tag>
                } else if (text == estadosRetrabajo.SCRAP) {
                    return <Tag color='red-inverse'>SCRAP</Tag>
                } else {
                    return <Tag color='orange'>Pendiente</Tag>
                }
            }
        },
        {
            title: 'Pz. Scrap',
            dataIndex: 'cantidad',
            key: 'cantidad',
            render: (_, r) => {
                return r?.scrap?.length
            }
        },
        {
            title: 'Linea',
            dataIndex: 'linea',
            key: 'linea',
            render: (_, record) => {
                if (record?.tipo_linea) {
                    return `${record?.tipo_linea == 'MAIN' ? 'M' : 'S'}${record?.linea}`
                } else {
                    return record?.linea
                }
            }
        },
        {
            title: 'Inspector',
            dataIndex: 'inspector',
            key: 'Inspector',
            // render: (_, record) => record?.user?.email
        },
        {
            title: 'Modelo',
            dataIndex: 'modelo',
            key: 'modelo',
            // render: (_, record) => record?.etiqueta?.modelod?.nombre || record?.observaciones
        },
        {
            title: 'Componente',
            dataIndex: 'componente',
            key: 'componente',
            render: (_, record) => record?.tipo?.tipo + ' - ' + record?.lado?.lado
        },
        // {
        //     title: 'Cod. Defecto',
        //     dataIndex: 'defecto',
        //     key: 'defecto',
        //     render: (_, record) => record?.falla.codigo
        // },
        {
            title: 'Defecto',
            dataIndex: 'defecto_nombre',
            key: 'defecto_nombre',
            render: (_, record) => `${record?.falla.codigo} - ${record?.falla.nombre}`
        },
        {
            title: 'TL',
            dataIndex: 'autorizante',
            key: 'autorizante',
            // render: (_, record) => record?.user_tl?.email

        },
        {
            title: 'TM MFG',
            dataIndex: 'operario',
            key: 'operario',
            // render: (_, record) => record?.operador?.email

        },
        {
            title: 'OP',
            dataIndex: 'operacion',
            key: 'operacion',
            // render: (_, record) => record?.operacion?.nombre

        },
        {
            title: 'Crítico',
            dataIndex: 'es_critico',
            key: 'es_critico',
            render: (_, record) => {
                if (record?.es_critico == 0 || record?.es_critico == "0" || record?.es_critico == false || record?.es_critico == null || record?.es_critico == undefined) {
                    return <Tag color='green'>No</Tag>
                } else {
                    return <Tag color='red'>Sí</Tag>
                }
                // if (record?.es_critico || record?.es_critico == 1 || record?.es_critico == "1") {
                //     return <Tag color='red'>Sí</Tag>
                // } else {
                //     return <Tag color='green'>No</Tag>
                // }
            }

        },
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            key: 'imagen',
            render: (_, r) => {
                if (r.tipo_falla == 'E') {
                    return <button onClick={() => {

                        let circle = {
                            id: r?.id,
                            x: parseInt(r?.x) - 2,
                            y: parseInt(r?.y) - 2,
                            screenX: r?.screenX,
                            screenY: r?.screenY,
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
                        }

                        setCirclesData([circle])
                        // console.log(r?.imagen?.imagen)
                        setCurrentImage({
                            id: r?.imagen?.id,
                            image: r?.imagen?.imagen,
                            typeId: r?.tipo_id,
                            type: r?.tipo?.tipo
                        })

                        setIsModalOpen(true)
                    }}
                        className='text-xs py-0  bg-transparent'><FaImage className='text-xl' />
                    </button>
                }
            }
        }
    ]

    const columnsExcel = [
        {
            title: 'Tipo',
            dataIndex: 'tipo_falla',
            key: 'tipo_falla',
            render: (text) => {
                if (text == "I") {
                    return <Tag color='blue'>INTERNO</Tag>
                } else {
                    return <Tag color='yellow'>EOL</Tag>
                }
            }
        },
        {
            title: 'Fecha',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => formatDate(text)
        },
        {
            title: 'Hora',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => formatTime(text)
        },
        {
            title: 'Turno',
            dataIndex: 'turno',
            key: 'turno',
            render: (text) => (text == 'B') ? 'BLANCO' : (text == 'A' ? 'AMARILLO' : 'SIN INFORMAR')
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            render: (text) => {
                if (text == estadosRetrabajo.RECHAZADO) {
                    return <Tag color='red'>Rechazado</Tag>
                } else if (text == estadosRetrabajo.RETRABAJADO) {
                    return <Tag color='blue'>Retrabajado</Tag>
                } else if (text == estadosRetrabajo.SCRAP) {
                    return <Tag color='red-inverse'>SCRAP</Tag>
                } else {
                    return <Tag color='orange'>Pendiente</Tag>
                }
            }
        },
        {
            title: 'Pz. Scrap',
            dataIndex: 'cantidad',
            key: 'cantidad',
            render: (_, r) => {
                return r?.scrap?.length
            }
        },
        {
            title: 'Linea',
            dataIndex: 'linea',
            key: 'linea',
            render: (_, record) => {
                if (record?.tipo_linea) {
                    return `${record?.tipo_linea == 'MAIN' ? 'M' : 'S'}${record?.linea}`
                } else {
                    return record?.linea
                }
            }
        },
        {
            title: 'Inspector',
            dataIndex: 'inspector',
            key: 'Inspector',
            // render: (_, record) => record?.user?.email
        },
        {
            title: 'Modelo',
            dataIndex: 'modelo',
            key: 'modelo',
            // render: (_, record) => record?.etiqueta?.modelod?.nombre
        },
        {
            title: 'Componente',
            dataIndex: 'componente',
            key: 'componente',
            render: (_, record) => record?.tipo?.tipo + ' - ' + record?.lado?.lado
        },
        {
            title: 'Defecto',
            dataIndex: 'defecto',
            key: 'defecto',
            render: (_, record) => record?.falla.codigo
        },
        {
            title: 'Descripcion',
            dataIndex: 'defecto_nombre',
            key: 'defecto_nombre',
            render: (_, record) => record?.falla.nombre
        },
        {
            title: 'TL',
            dataIndex: 'autorizante',
            key: 'autorizante',
            // render: (_, record) => record?.user_tl?.email

        },
        {
            title: 'TM MFG',
            dataIndex: 'operario',
            key: 'operario',
            // render: (_, record) => record?.operador?.email

        },
        {
            title: 'OP',
            dataIndex: 'operacion',
            key: 'operacion',
            // render: (_, record) => record?.operacion?.nombre

        },
        {
            title: 'Crítico',
            dataIndex: 'es_critico',
            key: 'es_critico',
            render: (_, record) => {
                if (record?.es_critico == 0 || record?.es_critico == "0" || record?.es_critico == false || record?.es_critico == null || record?.es_critico == undefined) {
                    return "NO"
                } else {
                    return "SI"
                }
                // if (record?.es_critico || record?.es_critico == 1 || record?.es_critico == "1") {
                //     return "SI"
                // } else {
                //     return "NO"
                // }
            }

        },
    ]

    const exportExcel = () => {
        console.log(response?.data)
        const excel = new Excel();
        excel
            .addSheet("Hoja 1")
            .addColumns(columnsExcel)
            .addDataSource(response?.data, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    }

    const fetchUsuarios = async () => {
        const data = await getUserProduccion()
        setUsers(data?.data)
        // console.log(data.data)
    }

    useEffect(() => {
        // fetchDataReporteInternoFallas()
        fetchUsuarios()
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    }, [])

    const onSubmit = async (data) => {
        // console.log(data)

        fetchDataReporteInternoFallas(data)
    }

    return (
        <div className='flex flex-col gap-2 w-full'>

            <Modal
                footer={[
                    <button onClick={() => setIsModalOpen(false)} className='w-full font-bold text-sm bg-orange-400 py-2'>CERRAR</button>
                ]}
                closable={false}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
            // className=' w-full'
            // width={"350px"}
            >
                <div className='flex flex-col items-start gap-2 mt-2 !min-w-[420px] !min-h-[420px] !aspect-square '>
                    <div className='flex flex-col gap-0 w-full'>
                        <span className='font-bold text-2xl block border-b'>{circlesData[0]?.kanban?.modelo?.nombre}</span>
                        <span className='font-semibold text-xl block mb-2'>{circlesData[0]?.falla?.codigo} - {circlesData[0]?.falla?.nombre?.toUpperCase()}</span>

                        <div className='flex items-center w-full justify-between'>
                            <span className='font-semibold'>CANTIDAD : {circlesData[0]?.cantidad}</span>
                            <span className='font-semibold'>MODELO : {circlesData[0]?.modelo}</span>
                            <span className='font-semibold'>TIPO : {circlesData[0]?.typeName} {circlesData[0]?.ladoName}</span>
                        </div>

                        <div className='flex items-center w-full justify-between'>
                            <span className='font-semibold'>QR: {circlesData[0]?.qr}</span>
                            <span className='font-semibold'>LINEA: M{circlesData[0]?.linea}</span>
                        </div>
                    </div>

                    <div className='w-full h-full relative'>
                        <DrawItem image={currentImage} circles={circlesData} addCircle={() => { }} deleteCircle={() => { }} />
                    </div>
                </div>
            </Modal>

            <div className='flex items-center w-full gap-2'>
                <div className='flex items-center w-full gap-2 flex-col'>

                    <div className='flex items-center w-full gap-2'>
                        <InputUseForm
                            label="Fecha"
                            name="fecha"
                            className="!min-w-[250px]"
                            register={register}
                            control={control}
                            errors={errors}
                            type='range'
                            placeholder="Fecha"
                        // rules={{ required: "Debe ingresar la fecha" }}
                        />

                        <SelectUseForm
                            label="Linea"
                            name="linea"
                            classNameLabel="!mt-2 !mb-1"
                            className="min-w-[200px]"
                            placeholder="Seleccione una línea"
                            register={register}
                            errors={errors}
                            search={true}
                            control={control}
                            multiple={true}
                            options={[
                                { value: '1', label: 'M1' },
                                { value: '2', label: 'M2' },
                                { value: '3', label: 'M3' },
                                { value: '4', label: 'M4' },
                                { value: '5', label: 'M5' },
                                { value: '6', label: 'M6' },
                                { value: '7', label: 'M7' },
                                { value: '8', label: 'M8' },
                                { value: '9', label: 'M9' },
                                { value: '10', label: 'M10' },
                                { value: '11', label: 'M11' },
                            ]}
                        />

                        <SelectUseForm
                            label="Turno"
                            name="turno"
                            classNameLabel="!mt-2 !mb-1"
                            className="min-w-[200px] "
                            placeholder="Seleccione un turno"
                            register={register}
                            errors={errors}
                            search={true}
                            control={control}
                            multiple={true}
                            options={[
                                { value: 'B', label: 'BLANCO' },
                                { value: 'A', label: 'AMARILLO' },
                            ]}
                        />

                        <SelectUseForm
                            label="Modelo"
                            name="modelo"
                            placeholder="Seleccione un modelo"
                            register={register}
                            errors={errors}
                            classNameLabel="!mt-2 !mb-1"
                            className="!min-w-[350px] w-full"
                            loading={isLoadingModels}
                            search={true}
                            control={control}
                            multiple={true}
                            options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                        />
                    </div>

                    <div className='flex items-center w-full gap-2'>
                        <SelectUseForm
                            label=""
                            name="falla"
                            placeholder="Seleccione una falla"
                            register={register}
                            multiple={true}
                            errors={errors}
                            classNameLabel="!mt-2 !mb-1"
                            className="!min-w-[350px]"
                            loading={isLoadingFalla}
                            search={true}
                            control={control}
                            options={fallas.map((f) => { return { value: f.codigo, label: `${f.codigo} - ${f?.nombre}` } })}
                        />

                        <SelectUseForm
                            label=""
                            name="member"
                            placeholder="Seleccione un member"
                            register={register}
                            errors={errors}
                            classNameLabel="!mt-2 !mb-1"
                            multiple={true}
                            className="!min-w-[450px]"
                            loading={isLoadingFalla}
                            search={true}
                            control={control}
                            options={users.map((u) => { return { value: u.id, label: u?.email } })}
                        />

                        <SelectUseForm
                            label=""
                            name="tipo"
                            classNameLabel="!mt-2 !mb-1"
                            className="min-w-[200px] "
                            placeholder="Seleccione un tipo"
                            register={register}
                            errors={errors}
                            search={true}
                            control={control}
                            multiple={true}
                            options={[
                                { value: 'E', label: 'EOL' },
                                { value: 'I', label: 'INTERNO' },
                            ]}
                        />

                        <InputUseForm
                            className="mt-[-15px] w-full"
                            label=""
                            name="qr"
                            size="large"
                            classNameLabel="!mt-0 !mb-0"
                            register={register}
                            control={control}
                            errors={errors}
                            placeholder="Qr"
                        />
                    </div>

                </div>
                <div className='flex flex-col gap-2'>
                    <button disabled={isLoading} onClick={handleSubmit(onSubmit)} className='bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 text-xs hover:opacity-70 flex items-center gap-1 text-white'><IoIosSearch /> BUSCAR</button>
                    <button disabled={isLoading} onClick={() => exportExcel()} className='bg-green-600 disabled:cursor-not-allowed disabled:opacity-40 text-xs hover:opacity-70 flex items-center gap-1 text-white'><RiFileExcel2Line /> EXPORTAR</button>
                </div>
            </div>

            <div className='flex items-start'>
                <div className='flex flex-col items-center border-2'>
                    <span className='text-2xl font-semibold bg-gray-600 px-6 text-white'>TOTAL</span>
                    <span className='text-4xl font-bold px-4 py-2'>{response?.data?.length}</span>
                </div>
            </div>

            <Table
                loading={isLoading}
                dataSource={response?.data}
                columns={columns}
                // className='!text-xs'
                rowKey={row => row.id}
                pagination={{
                    pageSize: 40,
                    showSizeChanger: false
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
            />

        </div>
    )
}
