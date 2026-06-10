import DrawItem from '@components/DrawItem';
import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { Modal, Table } from "antd";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
import EtiquetaQr from "../../components/EtiquetaQr";
import { getDataQr } from "../../services/QrService";
import { formatDateTime } from "../../utils/Utils";

export default function ReporteEtiquetaQrPage() {

    const [dataQr, setDataQr] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentImage, setCurrentImage] = useState({
        image: null,
        typeId: null,
        id: null
    })
    const [circlesData, setCirclesData] = useState([])

    const { register, control, formState: { errors } } = useForm();

    const keyPressEnter = async (e) => {
        if (e.key == 'Enter') {
            setIsLoading(true)
            const data = await getDataQr({ qr: e.target.value })
            if (data?.error) {
                setDataQr([])
            } else {
                setDataQr(data?.data)
            }
            setIsLoading(false)
            e.target.value = ""
        }
    }

    return (
        <div className="px-4">
            <InputUseForm
                label="Escanee el código QR"
                name="qr"
                className="w-full"
                register={register}
                classNameInput="!text-2xl !py-4"
                errors={errors}
                placeholder="Código QR"
                rules={{ required: "Ingrese o escanee el qr" }}
                onKeyPress={keyPressEnter}
            />

            <Modal
                footer={[
                    <button onClick={() => setIsModalOpen(false)} className='w-full font-bold text-sm bg-orange-400 py-2'>CERRAR</button>
                ]}
                closable={false}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                className='h-20 w-full'
            >
                <div className='w-full h-[70vh] flex flex-col items-start gap-2 mt-2'>
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
                    <DrawItem image={currentImage} circles={circlesData} addCircle={() => { }} deleteCircle={() => { }} />
                </div>
            </Modal>

            {(!isLoading && (dataQr?.id == null || dataQr?.length == 0)) && <span className="w-full block text-center font-semibold mt-2">No hay datos para mostrar</span>}

            {isLoading && <div className="w-full flex items-center justify-center"><Loader fontSize={100} /></div>}

            {(!isLoading && dataQr?.id > 0) &&
                <div className="flex items-start justify-between w-full gap-4 mt-4">
                    <EtiquetaQr etiqueta={dataQr} />
                    <div className=" flex flex-col w-full">
                        <div className="w-full flex flex-col">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Datos de etiqueta</span>
                            <div className="flex items-center gap-4">
                                <span>Estado: <span className="font-bold">{dataQr?.estado}</span></span>
                                <span>Línea: <span className="font-bold">M{dataQr?.linea_real}</span></span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span>Modelo:<span className="font-bold">{dataQr?.modelo}</span></span>
                                <span>Componente: <span className="font-bold">{dataQr?.tipo}</span></span>
                                <span>Kanban: <span className="font-bold">{dataQr?.kanban}</span></span>
                            </div>
                        </div>

                        <div className="w-full flex flex-col mt-6">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Datos de impresión</span>
                            <span>Usuario: <span className="font-bold">{dataQr?.user_impresion?.email}</span></span>
                            <span>Fecha: <span className="font-bold">{formatDateTime(dataQr?.created_at)}</span></span>
                        </div>

                        <div className="w-full flex flex-col mt-6">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Datos de QC</span>
                            <div className="grid grid-cols-2 pt-2">

                                {dataQr?.hora_validacion ?
                                    <div className="flex flex-col">
                                        <span className="font-semibold">VALIDACIÓN CARA A</span>
                                        <span>Usuario: <span className="font-bold">{dataQr?.user_validacion?.email}</span></span>
                                        <span>Fecha: <span className="font-bold">{formatDateTime(dataQr?.hora_validacion)}</span></span>
                                    </div>
                                    :
                                    <div className="flex flex-col">
                                        <span className="font-semibold">VALIDACIÓN CARA A</span>
                                        <span>SIN CONTROL CARA A</span>
                                    </div>
                                }

                                {dataQr?.hora_validacion_carab ?
                                    <div className="flex flex-col">
                                        <span className="font-semibold">VALIDACIÓN CARA B</span>
                                        <span>Usuario: <span className="font-bold">{dataQr?.user_validacion_cara_b?.email}</span></span>
                                        <span>Fecha: <span className="font-bold">{formatDateTime(dataQr?.hora_validacion_carab)}</span></span>
                                    </div>
                                    :
                                    <div className="flex flex-col">
                                        <span className="font-semibold">VALIDACIÓN CARA B</span>
                                        <span>SIN CONTROL CARA B</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="w-full flex flex-col mt-6">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Defectos</span>
                            <Table
                                rowKey={r => r.id}
                                size="small"
                                dataSource={dataQr?.reparaciones}
                                columns={[
                                    {
                                        title: 'Falla',
                                        key: 'falla',
                                        render: (_, r) => r?.falla?.nombre
                                    },
                                    {
                                        title: 'Estado',
                                        key: 'estado',
                                        dataIndex: 'estado'
                                    },
                                    {
                                        title: 'Fecha Carga',
                                        key: 'created_at',
                                        dataIndex: 'created_at',
                                        render: (_, r) => formatDateTime(r?.created_at, true)
                                    },
                                    {
                                        title: 'Retrabajado por',
                                        key: 'retrabajado',
                                        dataIndex: 'retrabajado',
                                        render: (_, r) => r?.user_retrabajo?.email
                                    },
                                    {
                                        title: 'Fecha retrabajo',
                                        key: 'fecha_retrabajo',
                                        dataIndex: 'fecha_retrabajo',
                                        render: (_, r) => r?.fecha_retrabajo ? formatDateTime(r?.fecha_retrabajo, true) : ''
                                    },
                                    {
                                        title: 'Imagen',
                                        dataIndex: 'imagen',
                                        key: 'imagen',
                                        render: (_, r) => {
                                            if (r.tipo_falla == 'E') {
                                                return <button onClick={() => {
                                                    // console.log(r)
                                                    let circle = {
                                                        id: r?.id,
                                                        x: parseInt(r?.x),
                                                        y: parseInt(r?.y),
                                                        screenX: event.screenX,
                                                        screenY: event.screenY,
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
                                ]}
                            />
                        </div>

                        <div className="w-full flex flex-col mt-6">
                            <span className="text-2xl pl-1 block w-full border-b pb-1 font-bold bg-orange-200">Historial</span>
                            <Table
                                rowKey={r => r.id}
                                size="small"
                                dataSource={dataQr?.historial}
                                columns={[
                                    {
                                        title: 'Kanban',
                                        key: 'kanban',
                                        render: (_, r) => r?.kanban
                                    },
                                    {
                                        title: 'Validación',
                                        key: 'hora_validacion',
                                        dataIndex: 'hora_validacion',
                                        render: (_, r) => r?.hora_validacion ? formatDateTime(r?.hora_validacion, true) : null
                                    },
                                    {
                                        title: 'Validado por',
                                        key: 'validado',
                                        dataIndex: 'validado',
                                        render: (_, r) => r?.user_validacion?.email
                                    },
                                    {
                                        title: 'Kanban Cara B',
                                        key: 'kanban_carab',
                                        render: (_, r) => r?.kanban_carab
                                    },
                                    {
                                        title: 'Validación Cara B',
                                        key: 'hora_validacion_carab',
                                        dataIndex: 'hora_validacion_carab',
                                        render: (_, r) => r?.hora_validacion_carab ? formatDateTime(r?.hora_validacion_carab, true) : null
                                    },
                                    {
                                        title: 'Validado Cara B por',
                                        key: 'validado2',
                                        dataIndex: 'validado2',
                                        render: (_, r) => r?.user_validacion_cara_b?.email
                                    },
                                    {
                                        title: 'Linea',
                                        key: 'linea',
                                        render: (_, r) => r?.linea?.nombre ? r?.linea?.nombre : `${r?.linea?.codigo}`
                                    }
                                ]}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
