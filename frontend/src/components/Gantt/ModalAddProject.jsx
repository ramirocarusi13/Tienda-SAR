import { Modal } from 'antd'
import InputUseForm from "@components/InputUseForm";
import { useForm } from "react-hook-form";

export default function ModalAddProject({ isOpen, setIsOpen }) {
    const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm();

    return (
        <Modal
            open={isOpen}
            title="Agregar proyecto"
            footer={<div className='flex items-center gap-2 justify-end'>
                <button onClick={() => setIsOpen(false)} className='py-1 px-4 text-sm bg-red-400'>Cancelar</button>
                <button className='py-1 px-4 text-sm bg-green-300'>Agregar</button>
            </div>}
        >
            <InputUseForm
                label="Nombre del proyecto"
                name="dado"
                className="w-full mt-5"
                classNameInput='!bg-white'
                register={register}
                rules={{ required: "Debe ingresar el nombre del proyecto" }}
                errors={errors}
                placeholder="Proyecto"
            />


        </Modal>
    )
}
