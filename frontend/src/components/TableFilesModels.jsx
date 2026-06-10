import SelectUseForm from "@components/SelectUseForm";
import useArchivosModelos from "@hooks/useArchivosModelos";
import useTables from "@hooks/useTables";
import { uploadImage } from "@services/UploadFile";
import { Image, Modal, Popconfirm, Spin, Table, Upload, message } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

const beforeUpload = (file) => {

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('Solo puede subir imágenes en formato JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('La imagen no puede pesar más de 2MB!');
    }
    return isJpgOrPng && isLt2M;
};

export default function TableFilesModels({ modelId }) {
    const { isLoading, fetchImagenesFallas, deleteImageFalla, response: archivos, storeImagenFallaModelo } = useArchivosModelos()
    const { isLoading: isLoadingTipos, response: tipos } = useTables("tipo_partes", true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { register, control, handleSubmit, formState: { errors }, reset, getValues, setFocus, setValue, watch } = useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();

    const uploadButton = (
        <div className='flex flex-col items-center justify-center'>
            {loading ? <Spin /> : <FaPlus className='text-xl fill-green-700' />}
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Seleccionar imagen
            </div>
        </div>
    );

    const columns = [
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            render: (_, record) => record?.tipo?.tipo
        },
        {
            title: 'Detalle',
            dataIndex: 'imagen',
            key: 'imagen',
            render: (text) => {
                // return <a href={`${PUBLIC_URI}uploads/${text}`} target='_blank'>{text}</a>
                return <Image
                    width={50}
                    src={`${PUBLIC_URI}uploads/${text}`}
                />
            }
        },
        {
            dataIndex: 'delete',
            key: 'delete',
            render: (_, record) => <Popconfirm
                title="Eliminar"
                description="¿Confirma la eliminación del archivo?"
                okText="Si"
                onConfirm={() => setDeleteImageFalla(record.id)}
                okButtonProps={{
                    className: "bg-green-500"
                }}
                cancelText="No"
            >
                <button className="m-0 p-0 hover:border-0 border-0 outline-none"><MdDelete className="text-red-500 text-lg hover:opacity-70" /></button>
            </Popconfirm>
        }
    ];

    const setDeleteImageFalla = async (id) => {

        const data = await deleteImageFalla(id)
        if (!data?.error) {
            message.success("Eliminada correctamente")
            fetchImagenesFallas(modelId)
        } else {
            message.error(data.message)
        }
    }

    useEffect(() => {
        if (modelId) {
            fetchImagenesFallas(modelId)
        }
    }, [modelId])

    const onSubmit = async (data) => {
        data.modelo_id = modelId

        await storeImagenFallaModelo(data, (res) => {
            if (!res.error) {
                reset({
                    imagen: null,
                    tipo_id: null
                })
                setImageUrl(null)
                setIsModalOpen(false)
                fetchImagenesFallas(modelId)

                message.success("Subida correctamente")
            } else {
                message.error(res.message)
            }

        })
    }

    const uploadFile = async (file) => {
        setLoading(true);
        setImageUrl(null);

        const formData = new FormData();
        formData.append("image", file.file);

        const response = await uploadImage("file/upload", formData)

        if (!response?.error) {
            if (response?.data?.image) {
                setValue("imagen", response?.data?.image)
                getBase64(file.file, (url) => {
                    setLoading(false);
                    setImageUrl(url);
                });
            }
        }
    }

    return (
        <div>
            {contextHolder}

            <button className='bg-green-500 px-4 py-1 text-xs text-white hover:opacity-80' onClick={() => setIsModalOpen(true)}>Agregar archivo +</button>
            <Table
                size="small"
                title={() => <span className='text-xl'>Archivos</span>}
                locale={{
                    emptyText: "No se encontraron registros",
                }}
                className="w-full mt-4"
                pagination={false}
                bordered={true}
                columns={columns}
                dataSource={archivos}
                loading={isLoading}
                rowKey={(item) => item.id}
            />

            <div className="my-4"></div>

            <Modal
                footer={
                    <div className='flex w-full justify-between items-center gap-3'>
                        <button onClick={() => setIsModalOpen(false)} className='bg-red-400'>Cancelar</button>
                        <button onClick={handleSubmit(onSubmit)} className='bg-green-400'>Confirmar</button>
                    </div>
                }
                open={isModalOpen}
                className='p-4'
            >
                <SelectUseForm
                    label="Tipo"
                    name="tipo_id"
                    placeholder="Seleccione un tipo"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el tipo" }}
                    className="w-full "
                    loading={isLoadingTipos}
                    search={true}
                    control={control}
                    options={tipos.map((tipo) => { return { value: tipo.id, label: tipo.tipo } })}
                />

                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader flex items-center justify-center w-full h-full "
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    customRequest={uploadFile}
                >
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="avatar"
                            className="object-contain w-[90%] h-full z-0"
                        />
                    ) : (
                        <div className='flex items-center justify-center w-full'>
                            {uploadButton}
                        </div>
                    )}
                </Upload>
            </Modal>
        </div>
    )
}