import { Modal } from 'antd'
import React from 'react'
import { useState } from 'react'
import InputUseForm from "@components/InputUseForm";
import { useForm } from "react-hook-form";

const ENVIROMENT = import.meta.env.VITE_API_ENVIROMENT


export default function ModalCodAutorizacion({ isVisible, setIsVisible }) {
    const { register, control, formState: { errors }, setFocus, watch, setValue, getValues } = useForm();

    const [userVigente, setUserVigente] = useState(null)
    const [userError, setUserError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <Modal
            closable={false}
            footer={[]}
            open={isVisible}
        >
            {ENVIROMENT == 'STAGING' && <span className="bg-orange-500 p-2 block text-center font-semibold">ENTORNO DE PRUEBAS</span>}
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
                        setIsLoading(true)
                        const response = await validaUsuarioPorCodigoValidacion(e.target.value)
                        e.target.value = ''
                        if (response?.error) {
                            setUserError(response.message)
                        } else {
                            // console.log(response?.data?.id)
                            setUserVigente(response?.data)

                            login({
                                ...response?.data,
                            })
                        }
                        setIsLoading(false)
                    }
                }}
            />

            {isLoading && <div className="flex items-center justify-center mt-5"><Loader /></div>}

            {userError && <span className="text-red-500 font-semibold">{userError}</span>}
        </Modal>
    )
}
