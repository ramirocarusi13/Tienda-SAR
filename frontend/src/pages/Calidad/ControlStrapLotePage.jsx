import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import EgresoStrap from "@components/Strap/EgresoStrap";
import IngresoStrap from "@components/Strap/IngresoStrap";
import ReimpresionMayler from "@components/Strap/ReimpresionMayler";

import ModalControlStrap from "@components/Strap/ModalControlStrap";
import { useAuth } from '@hooks/useAuth';
import { validaUsuarioPorCodigoValidacion } from "@services/AuthService";

import { Modal } from "antd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ENVIROMENT = import.meta.env.VITE_API_ENVIROMENT


export default function ControlStrapLotePage() {
    const [isOpen, setIsOpen] = useState(false)
    const { register, control, formState: { errors }, setFocus, watch, setValue, getValues } = useForm();
    const { login } = useAuth();

    const [userVigente, setUserVigente] = useState(null)
    const [userError, setUserError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    useEffect(() => {
        if (!userVigente) {
            setTimeout(() => {
                setFocus("cod_autorizacion")
            }, [50])
        }
    }, [userVigente])

    return (
        <div className={`bg-slate-100 h-full min-h-[100vh]  p-4 ${ENVIROMENT == 'STAGING' && "!bg-testpatron"}`}>

            <Modal
                closable={false}
                footer={[]}
                open={!userVigente}
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

            <div className='flex flex-col gap-6'>
                {userVigente &&
                    <div className="bg-yellow-300 p-2 flex gap-4 justify-center items-center">
                        <button onClick={() => setModalVisible(true)} className="text-sm ">Control Strap</button>
                        <span className="font-semibold ">USUARIO LOGUEADO : {userVigente.name.toUpperCase()}</span>

                        <button
                            onClick={() => setUserVigente(null)}
                            className="text-sm bg-red-500 text-white"

                        >SALIR</button>

                        {ENVIROMENT == 'STAGING' && <span className="bg-orange-500 p-2 block text-center font-semibold">ENTORNO DE PRUEBAS</span>}
                    </div>
                }
                <IngresoStrap userVigente={userVigente} setUserVigente={setUserVigente} />
                <EgresoStrap userVigente={userVigente} setUserVigente={setUserVigente} />

                <div className="flex justify-end">
                    <button onClick={() => setIsOpen(true)} className="bg-emerald-300 text-black text-xs">Reimprimir Etiquetas Mayler</button>
                </div>

                <ReimpresionMayler isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>

            <ModalControlStrap isVisible={modalVisible} setIsVisible={setModalVisible} />

        </div>
    )
}
