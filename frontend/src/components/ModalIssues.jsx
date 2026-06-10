import { InboxOutlined } from '@ant-design/icons';
import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { deleteIssues, getIssues, saveIssue } from "@services/OpenIssues";
import { formatDateTime } from "@utils/Utils";
import { Badge, Input, message, Modal, Popconfirm, Upload } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { CiTrash } from "react-icons/ci";

const { TextArea } = Input;
const { Dragger } = Upload;

const props = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};

export default function ModalIssues({ isVisible, setIsVisible }) {

    const [isLoading, setIsLoading] = useState(false)
    const [issues, setIssues] = useState([])
    const { register, handleSubmit, setFocus, reset, formState: { errors } } = useForm({ titulo: '', descripcion: '' });

    const fetchOpenIssues = async () => {
        setIsLoading(true)
        const data = await getIssues()
        setIssues(data.data)
        setIsLoading(false)

    }

    const onSubmit = async (data) => {
        // console.log(data)

        const res = await saveIssue(data)
        fetchOpenIssues()
        reset({ titulo: null, descripcion: null })


        // saveIssue
    }

    useEffect(() => {
        if (isVisible) {
            fetchOpenIssues()
            reset({ titulo: null, descripcion: null })
            setTimeout(() => {
                setFocus('titulo')
            }, 50)
        }
    }, [isVisible])

    return (
        <Modal
            closable={false}
            open={isVisible}

            onCancel={() => setIsVisible(false)}
            className='w-full '
            width="90%"
            cancelButtonProps={{ className: 'bg-red-600 text-white px-10' }}
            okButtonProps={{ className: 'bg-green-600 px-10' }}
            okText="Guardar"
            onOk={handleSubmit(onSubmit)}
        >

            {/* <span>Open Issues</span> */}

            <div className='flex items-start justify-start gap-4 h-full'>
                <div className='w-[40%] h-full '>
                    <div className='w-full flex items-center justify-between border-b '>
                        <span className='text-lg font-semibold'>Historial</span>
                        <button onClick={() => fetchOpenIssues()} className='py-0 hover:opacity-70 bg-green-300 px-4 text-xs'>Actualizar listado</button>
                    </div>

                    <div className='flex flex-col gap-1 items-start w-full py-2'>
                        {isLoading && <div className='flex flex-col gap-2 items-center justify-center w-full mt-10'><Loader /><span>Cargando</span></div>}

                        {!isLoading && issues?.length == 0 && <span className='text-center block w-full mt-4 text-sm'>No se encontraron problemas informados</span>}

                        {!isLoading && issues?.map((issue, idx) => (
                            <div key={`issue_${idx}`} className='flex gap-1 rounded-md min-h-14 w-full items-center justify-between border px-2 py-1'>
                                <div className='flex flex-col gap-0 items-start'>

                                    <span className='text-xs'>Creado el {formatDateTime(issue?.created_at)}</span>
                                    <span className='text-sm font-semibold text-gray-600'>{issue?.titulo}</span>
                                </div>
                                <div className='flex items-center flex-col gap-1'>
                                    <span className='text-sm font-semibold text-gray-600'><Badge status={`${issue?.abierto == 1 ? 'warning' : 'success'}`} /> {issue?.abierto == 1 ? 'Pendiente' : 'Finalizado'}</span>
                                    {issue?.abierto == 1 &&
                                        <Popconfirm
                                            okText='Eliminar'
                                            okButtonProps={{ className: 'bg-red-500' }}
                                            title='¿Está seguro que desea eliminarlo? No se podrá recuperar.'
                                            onConfirm={async () => {
                                                await deleteIssues(issue.id)
                                                fetchOpenIssues()
                                            }}
                                        >
                                            <button

                                                className='bg-transparent p-0 flex items-center gap-1 justify-center text-xs'>
                                                <CiTrash className='text-red-500 text-lg' /> Eliminar
                                            </button>
                                        </Popconfirm>
                                    }
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
                <div className='w-full  h-full'>
                    <span className='text-lg font-semibold border-b w-full block'>Carga</span>

                    <div className='flex flex-col py-2 gap-4 items-start'>
                        <div className='flex flex-col gap-0 w-full'>
                            {/* <Input placeholder='Titulo' /> */}

                            <InputUseForm
                                label=""
                                name="titulo"
                                className="w-full !bg-white"
                                classNameInput='!bg-white'
                                register={register}
                                errors={errors}
                                placeholder="Titulo"
                                rules={{ required: "Ingrese el titulo" }}
                            />
                            <span className='text-xs'>Sea breve y conciso con el título. Debe describir el problema. Por ej, "No carga el pedido"</span>
                        </div>


                        <div className='flex flex-col gap-0 w-full'>
                            <textarea {...register("descripcion", { required: "Ingrese la descripción" })} rows={6} className={`w-full rounded-md px-2 border ${errors?.descripcion && 'border-red-500'}`} placeholder='Descripción'></textarea>
                            <span className='text-xs'>Aquí puede explicar detalladamente el inconveniente. Sea lo más especifico posible.</span>
                        </div>


                        {errors?.descripcion && <div className="text-start mt-0"><span className="text-red-500 text-sm italic text-start">{errors.descripcion.message}</span></div>}



                        <div className='flex flex-col gap-1 w-full'>

                            <Dragger className='w-full' {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Haga clic o arrastre hasta aquí las imagenes</p>
                                <p className="ant-upload-hint">
                                    Cargue las imagenes que demuestren el error para una solución más inmediata. Puede subir una o varias imagenes.
                                </p>
                            </Dragger>


                        </div>
                    </div>
                </div>
            </div>

        </Modal>
    )
}
