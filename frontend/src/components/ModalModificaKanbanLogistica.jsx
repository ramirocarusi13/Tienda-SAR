import InputUseForm from "@components/InputUseForm";
import SelectUseForm from "@components/SelectUseForm";
import useModels from "@hooks/useModels";
import { getStockLogisticaKanbanModificacion, actualizaStockLogistica } from "@services/StockService";
import { formatDateEn } from '@utils/Utils';
import { Modal, message } from 'antd';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import Loader from "@components/Loader"
import { useEffect } from "react";

export default function ModalModificaKanbanLogistica({ isModalOpen, setIsModalOpen }) {
    const { register, control, handleSubmit, formState: { errors }, reset, getValues, setFocus, setValue, watch } = useForm();
    const { isLoading: isLoadingModels, response: models, } = useModels()
    const [isVisible, setIsVisible] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    useEffect(() => {
        reset({
            codigo_kanban: null,
            cuarentena: false,
            egresado: false,
            modelo: null,
            fecha_egreso: null,
            rechazado: null
        })
        setIsVisible(false)
        setTimeout(() => {
            setFocus("codigo_kanban")
        }, 50)
    }, [isModalOpen])

    const onSubmit = async (data) => {
        if (data?.fecha_egreso) {
            const date = new Date(data?.fecha_egreso)
            data.fecha_egreso = formatDateEn(date)
        }

        const response = await actualizaStockLogistica(data)

        // console.log(response)
        if (response?.error) {
            // setIsVisible(false)
            message.error(response.message)
        } else {
            setIsVisible(false)
            setTimeout(() => {
                setFocus("codigo_kanban")
            }, 50)

            message.success(response.message)

        }
        // console.log(response)
    }

    const fetchStock = async (e) => {
        if (e.key == 'Enter') {
            setIsLoading(true)
            const data = await getStockLogisticaKanbanModificacion(getValues("codigo_kanban"));

            if (data.error) {
                message.error(data.message)
                setIsLoading(false)
                setIsVisible(false)
                return
            }

            if (data?.data) {
                // console.log("PASO")
                setValue("cuarentena", parseInt(data.data.cuarentena) == 1 ? true : false)
                setValue("rechazado", parseInt(data.data.rechazado) == 1 ? true : false)
                setValue("egresado", parseInt(data.data.egresado) == 1 ? true : false)

                if (data.data.modelo) {
                    const mod = models.filter(m => m.nombre == data.data.modelo);
                    setValue("modelo", mod[0].id)
                }
                // setValue("fecha_egreso", data.data.fecha_egreso)
                if (parseInt(data.data.run) > 0) {
                    setValue("run", parseInt(data.data.run))
                }

                if (data.data?.fecha_egreso) {
                    const date = dayjs(data.data.fecha_egreso, "YYYY-MM-DD");
                    setValue("fecha_egreso", date)
                }

                setIsVisible(true)
            } else {
                setIsVisible(false)
            }

            setIsLoading(false)

        }
    }

    return (
        <Modal
            title="Modificación de Kanban"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={[
                <button key={1} onClick={() => setIsModalOpen(false)} className='bg-red-500 px-6'>Cancelar</button>,
                <button key={2} onClick={handleSubmit(onSubmit)} className={`bg-green-500 ml-4 px-6 ${!isVisible && 'hidden'}`}>Confirmar</button>
            ]}
        >
            {contextHolder}

            <InputUseForm
                label="Kanban"
                name="codigo_kanban"
                className="w-full mt-2"
                register={register}
                classNameInput="!text-lg !py-2"
                errors={errors}
                placeholder="Ingrese el nro de Kanban"
                rules={{ required: "Ingrese el número de Kanban" }}
                onKeyPress={fetchStock}
            />

            {isLoading && <div className="flex items-center justify-center"><Loader /></div>}

            <div className={`${!isVisible && 'hidden'}`}>

                <SelectUseForm
                    label="Modelo"
                    name="modelo"
                    placeholder="Seleccione un modelo"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full "
                    loading={isLoadingModels}
                    search={true}
                    control={control}
                    options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                />

                <div className='flex flex-col items-center justify-between gap-3'>

                    <div className='flex gap-2 items-center w-full'>
                        <div className="text-xs text-start w-[200px]">
                            <input className="p-2 w-4" {...register("rechazado")} type="checkbox" id="rechazado" value="" />
                            <label htmlFor="rechazado" className='text-xl'>Rechazado</label>
                        </div>

                        <span className='bg-yellow-200 block w-full px-2'>Indica si el kanban fue rechazado por calidad</span>
                    </div>

                    <div className='flex gap-2 items-center w-full'>

                        <div className="text-xs text-start  w-[200px]">
                            <input className="p-2 w-4" {...register("egresado")} type="checkbox" id="egresado" value="" />
                            <label htmlFor="egresado" className='text-xl'>Egresado</label>
                        </div>
                        <span className='bg-yellow-200 block w-full px-2'>Indica si el kanban fue egresado</span>

                    </div>

                    <div className='flex gap-2 items-center w-full'>

                        <div className="text-xs text-start  w-[200px]">
                            <input className="p-2 w-4" {...register("cuarentena")} type="checkbox" id="cuarentena" value="" />
                            <label htmlFor="cuarentena" className='text-xl'>Cuarentena</label>
                        </div>
                        <span className='bg-yellow-200 block w-full px-2'>Indica si el kanban está pendiente de aprobación de calidad</span>

                    </div>



                </div>

                <InputUseForm
                    control={control}
                    type="date"
                    label="Fecha egreso"
                    name="fecha_egreso"
                    className="w-full mt-2"
                    register={register}
                    classNameInput="!text-lg !py-2"
                    errors={errors}
                    placeholder="Fecha egreso"
                // rules={{ required: "Ingrese el número de Kanban" }}
                // onKeyPress={keyPressEnter}
                />

                <SelectUseForm
                    label="Run"
                    name="run"
                    placeholder="Seleccione un modelo"
                    register={register}
                    errors={errors}
                    className="w-full "
                    search={true}
                    control={control}
                    options={[
                        { value: 1, label: "RUN 1" },
                        { value: 2, label: "RUN 2" },
                        { value: 3, label: "RUN 3" },
                        { value: 4, label: "RUN 4" },
                    ]}
                />
            </div>
        </Modal>
    )
}



