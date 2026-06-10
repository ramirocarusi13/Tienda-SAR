import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import usePiezas from '@hooks/usePiezas';
import useTables from "@hooks/useTables";
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";

const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

const DEFAULT_VALUES = {
    minimo: '',
    maximo: '',
    pto_optimo: '',
    dado: '',
    t_lectra1: '',
    t_lectra2: '',
    t_lectra3: '',
    t_lectra4: '',
    consumo: '',
    material_pieza_id: null
}

export default function ModalEditPiezaTienda({ isModalOpen, setIsModalOpen, editId, onSaved = null }) {
    const { register, control, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: DEFAULT_VALUES });
    const { isLoading, getPieza, updatePieza } = usePiezas()
    const { response: materiales, isLoading: isLoadingMateriales } = useTables('materiales_piezas/@', true)

    const [responseState, setResponseState] = useState({ error: false, message: null })
    const [selectedPdf, setSelectedPdf] = useState(null)
    const [storedPdfName, setStoredPdfName] = useState(null)
    const [currentModelName, setCurrentModelName] = useState(null)
    const [fileInputKey, setFileInputKey] = useState(0)

    const resetModal = () => {
        reset(DEFAULT_VALUES)
        setSelectedPdf(null)
        setStoredPdfName(null)
        setCurrentModelName(null)
        setResponseState({ error: false, message: null })
        setFileInputKey((prev) => prev + 1)
    }

    const handleClose = () => {
        setIsModalOpen(false)
        resetModal()
    }

    const fetchPieza = async () => {
        const data = await getPieza(editId, true)

        // console.log(data?.data)

        if (data?.error) {
            setResponseState({ error: true, message: data?.message || "No fue posible cargar la pieza" })
            return
        }

        const pieza = data?.data || {}

        reset({
            minimo: pieza?.minimo ?? '',
            maximo: pieza?.maximo ?? '',
            pto_optimo: pieza?.pto_optimo ?? '',
            dado: pieza?.dado_reposicion?.dado ?? pieza?.dado ?? '',
            t_lectra1: pieza?.dado_reposicion?.t_lectra1 ?? '',
            t_lectra2: pieza?.dado_reposicion?.t_lectra2 ?? '',
            t_lectra3: pieza?.dado_reposicion?.t_lectra3 ?? '',
            t_lectra4: pieza?.dado_reposicion?.t_lectra4 ?? '',
            consumo: pieza?.dado_reposicion?.consumo ?? '',
            material_pieza_id: pieza?.material_pieza_id ? parseInt(pieza?.material_pieza_id) : null
        })

        setStoredPdfName(pieza?.kanban_reposicion || null)
        setCurrentModelName(pieza?.modelo?.nombre || pieza?.parte?.modelo?.[0]?.nombre || pieza?.parte?.modelo?.nombre || null)
        setSelectedPdf(null)
        setFileInputKey((prev) => prev + 1)
    }

    useEffect(() => {
        if (!isModalOpen) {
            resetModal()
            return
        }

        if (editId) {
            setResponseState({ error: false, message: null })
            fetchPieza()
        }
    }, [isModalOpen, editId])

    const onSubmit = async (data) => {
        if (!selectedPdf && !storedPdfName) {
            setResponseState({ error: true, message: "Debe seleccionar un PDF para el kanban de reposición" })
            return
        }

        setResponseState({ error: false, message: null })

        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('minimo', data?.minimo ?? '')
        formData.append('maximo', data?.maximo ?? '')
        formData.append('pto_optimo', data?.pto_optimo ?? '')
        formData.append('dado', data?.dado ?? '')
        formData.append('t_lectra1', data?.t_lectra1 ?? '')
        formData.append('t_lectra2', data?.t_lectra2 ?? '')
        formData.append('t_lectra3', data?.t_lectra3 ?? '')
        formData.append('t_lectra4', data?.t_lectra4 ?? '')
        formData.append('consumo', data?.consumo ?? '')
        formData.append('material_pieza_id', data?.material_pieza_id ?? '')

        if (selectedPdf) {
            formData.append('kanban_reposicion', selectedPdf)
        } else if (storedPdfName) {
            formData.append('kanban_reposicion', storedPdfName)
        }

        await updatePieza(editId, formData, (response) => {
            if (response?.error) {
                setResponseState({ error: true, message: response?.message })
                return
            }

            onSaved?.()
            handleClose()
        })
    }

    return (
        <Modal
            destroyOnClose
            title="Editar pieza"
            open={isModalOpen}
            onCancel={handleClose}
            footer={[
                <button key="cancel" onClick={handleClose} className="bg-red-400 me-2 text-sm">Cancelar</button>,
                <button key="save" onClick={handleSubmit(onSubmit)} className="bg-emerald-500 text-sm">Grabar</button>
            ]}
        >
            {isLoading && <div className="flex items-center justify-center"> <Loader /></div>}
            {!isLoading &&
                <div>
                    <div className="grid grid-cols-2 gap-2">
                        <InputUseForm
                            label="Dado"
                            name="dado"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="Dado"
                            rules={{ required: "Ingrese el dado" }}
                        />

                        <InputUseForm
                            label="Mínimo"
                            type="number"
                            name="minimo"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="Mínimo"
                            rules={{ required: "Ingrese el mínimo" }}
                        />

                        <InputUseForm
                            label="Máximo"
                            type="number"
                            name="maximo"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="Máximo"
                            rules={{ required: "Ingrese el máximo" }}
                        />

                        <InputUseForm
                            label="Punto óptimo corte"
                            type="number"
                            name="pto_optimo"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="Punto óptimo"
                            rules={{ required: "Ingrese el punto óptimo" }}
                        />
                    </div>

                    <SelectUseForm
                        label="Material"
                        name="material_pieza_id"
                        placeholder="Seleccione un material"
                        register={register}
                        errors={errors}
                        className="w-full"
                        loading={isLoadingMateriales}
                        search={true}
                        control={control}
                        rules={{ required: "Seleccione un material" }}
                        options={materiales.map((mat) => {
                            return { value: mat.id, label: `${mat.codigo_interno || ''} | ${mat.codigo || ''} | ${mat.nombre || ''} | ${mat.color || ''}` }
                        })}
                    />

                    <InputUseForm
                        label="Consumo (Utilizado por PC para abastecer)"
                        name="consumo"
                        className="w-full"
                        register={register}
                        errors={errors}
                        placeholder="Consumo"
                        rules={{ required: "Ingrese el consumo" }}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <InputUseForm
                            label="Tiempo Lectra 1"
                            name="t_lectra1"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="00:00:00"
                        />

                        <InputUseForm
                            label="Tiempo Lectra 2"
                            name="t_lectra2"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="00:00:00"
                        />

                        <InputUseForm
                            label="Tiempo Lectra 3"
                            name="t_lectra3"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="00:00:00"
                        />

                        <InputUseForm
                            label="Tiempo Lectra 4"
                            name="t_lectra4"
                            className="w-full"
                            register={register}
                            errors={errors}
                            placeholder="00:00:00"
                        />
                    </div>


                    <div className="mt-3">
                        <label className="text-start block font-semibold mb-1 mt-2">Kanban reposición PDF <span className="text-red-500">*</span></label>
                        <input
                            key={fileInputKey}
                            type="file"
                            accept="application/pdf"
                            className="block w-full text-sm"
                            onChange={(event) => {
                                const file = event?.target?.files?.[0] || null
                                setSelectedPdf(file)
                            }}
                        />

                        <div className="flex items-center justify-between gap-2 mt-1">
                            <div className="min-w-0">
                                {storedPdfName && <span className="text-xs text-gray-600 block truncate">Archivo actual: {storedPdfName}</span>}
                                {selectedPdf && <span className="text-xs text-emerald-700 block truncate">Nuevo archivo: {selectedPdf.name}</span>}
                            </div>

                            {storedPdfName && currentModelName &&
                                <a
                                    href={`${PUBLIC_URI}kanban_reposicion/${currentModelName}/${storedPdfName}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-blue-500 text-white text-xs px-3 py-1 rounded-md whitespace-nowrap"
                                >
                                    Ver PDF actual
                                </a>
                            }
                        </div>
                    </div>

                    {responseState?.message &&
                        <span className={`text-sm block p-2 text-white rounded-md mt-3 ${responseState.error ? 'bg-main' : 'bg-success'}`}>{responseState.message}</span>
                    }
                </div>
            }
        </Modal>
    )
}
