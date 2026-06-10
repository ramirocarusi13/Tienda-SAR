import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { validaUsuarioPorCodigoValidacion } from "@services/AuthService";
import { Modal } from "antd";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ModalAutorizaUsuario({ setUserVigente, isVisible, label = "Ingrese el código de autorización" }) {

    const [userError, setUserError] = useState(null)
    const [isLoadingUser, setIsLoadingUser] = useState(false)

    const { register, control, setFocus, setValue, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (isVisible) {
            setTimeout(() => { setFocus("cod_autorizacion") }, [50])
        }
    }, [isVisible])

    const validarUsuario = async (value) => {
        setUserError(null)
        setIsLoadingUser(true)
        const response = await validaUsuarioPorCodigoValidacion(value)

        if (response?.error) {
            setUserError(response.message)

            setIsLoadingUser(false)
            setValue("cod_autorizacion", null)
            setTimeout(() => { setFocus("cod_autorizacion") }, [50])
        } else {
            setUserVigente(response?.data)
            setIsLoadingUser(false)
        }
    }

    return (
        <Modal
            closable={false}
            footer={[]}
            open={isVisible}
        >
            {/* {usoInterno ?
                <div className='w-full flex items-center justify-center'>
                    <Loader fontSize={100} />
                </div>
                : */}
            <InputUseForm
                name="cod_autorizacion"
                label={label}
                disabled={isLoadingUser}
                className="w-full"
                register={register}
                type="password"
                errors={errors}
                placeholder="Código de autorización"
                classNameInput="!text-3xl !py-4 !border-2 !border-black"
                onKeyPress={async (e) => {
                    if (e.key == 'Enter' && e.target.value != '') {
                        validarUsuario(e.target.value)
                        e.target.value = ''
                    }
                }}
            />
            {/* } */}

            {(isLoadingUser) && <div className="flex items-center justify-center mt-5"><Loader /></div>}
            {userError && <span className="text-red-500 font-semibold">{userError}</span>}
        </Modal>
    )
}
