import mainLogo from "@assets/main_logo.jpg";
import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { useAuth } from '@hooks/useAuth';
import { login as tryLogin } from "@services/AuthService";
import { ROLES, routesNames } from "@utils/Constants";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

const ENVIROMENT = import.meta.env.VITE_API_ENVIROMENT


export default function LoginPage() {
    const { login } = useAuth();
    const location = useLocation();

    const { register, control, handleSubmit, formState: { errors }, setFocus, setValue } = useForm();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const from = location.state?.from?.pathname || "/dashboard";

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setError(null)
        setIsLoading(true)

        const response = await tryLogin(data.user, data.password)

        if (response.error) {
            setError(response.message)
            setIsLoading(false)
            return
        }

        login({
            ...response.data,
        })
        setIsLoading(false)

        // console.log(response.data)
        // return

        if (response?.data?.rol?.id == ROLES.CALIDAD) {
            navigate(`${routesNames.CALIDAD.CUARENTENA}`);
        } else if (response?.data?.rol?.id == ROLES.LOGISTICA) {
            navigate(`${routesNames.LOGISTICA.STOCK_DISPONIBLE}`);
        } else if (response?.data?.rol?.id == ROLES.INVENTARIO) {
            navigate(`${routesNames.STOCK.INVENTARIO_MATERIALES}`);
        } else if (response?.data?.rol?.id == ROLES.STRAP) {
            navigate(`${routesNames.CALIDAD.CONTROL_STRAP}`);
        } else {
            // navigate(`${routesNames.DASHBOARD}`);
            navigate(from, { replace: true });
        }


    }

    return (
        <div className={`flex items-center justify-center w-full bg-gray-100 h-full min-h-svh ${ENVIROMENT == 'STAGING' && "bg-testpatron"}`}>

            <div className="flex flex-col w-[400px] gap-2 px-8 py-8 border bg-white rounded-xl">
                <img src={mainLogo} className='w-[80%] h-full object-cover m-auto' />

                {/* <span className="text-2xl font-semibold text-center block w-full my-2">Bienvenido</span> */}

                <span className="text-gray-600 block text-center font-semibold my-4">Ingrese sus credenciales</span>


                {(ENVIROMENT == 'STAGING') &&
                    <span className="block text-center bg-yellow-400 p-2 font-semibold">ENTORNO DE PRUEBAS</span>
                }
                <InputUseForm
                    name="user"
                    className="w-full border-b"
                    register={register}
                    classNameInput="dark:bg-white dark:text-black border-0 outline-none focus:bg-gray-100"
                    errors={errors}
                    placeholder="Usuario"
                    rules={{ required: "Ingrese su nombre de usuario" }}
                    onKeyPress={(e) => {
                        if (e.key == 'Enter') {
                            setFocus("password")
                        }
                    }}
                />

                <InputUseForm
                    name="password"
                    className="w-full border-b"
                    register={register}
                    type="password"
                    classNameInput="dark:bg-white dark:text-black border-0 outline-none focus:bg-gray-100"
                    // classNameInput="!text-2xl !py-4"
                    errors={errors}
                    placeholder="Contraseña"
                    rules={{ required: "Ingrese su contraseña" }}
                    password={true}
                    onKeyPress={(e) => {
                        if (e.key == 'Enter') {
                            handleSubmit(onSubmit)()
                        }
                    }}

                />

                <button
                    onClick={handleSubmit(onSubmit)}
                    className="w-full text-white bg-main text-sm rounded-xl mt-5  hover:opacity-80">
                    {isLoading ? <Loader color='text-white' /> : "INGRESAR"}
                </button>

                {error && <span className="text-xs font-semibold block w-full text-center text-error p-2 rounded-md">{error?.toUpperCase()}</span>}
            </div>
        </div>
    )
}
