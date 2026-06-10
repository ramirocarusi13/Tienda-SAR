import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import OperationLinea from "../../components/PanelOperaciones/OperationLinea";
import useLineaOperaciones from "../../hooks/useLineaOperaciones";
import SelectUseForm from "@components/SelectUseForm";
import useUsers from "@hooks/useUsers";
import PolivalenciaItem from "../../components/PanelOperaciones/PolivalenciaItem";



export default function UserOpLineaPage() {

    const { response: operaciones, isLoading, getData, getItem, saveItem } = useLineaOperaciones(true)
    const { register, control, handleSubmit, formState: { errors }, setFocus, reset, setValue, getValues } = useForm();
    const [activeUser, setActiveUser] = useState(null)
    const { response: users, isLoading: isLoadingUsers, getPolivalenciasUsuario } = useUsers(true)
    const [polivalencias, setPolivalencias] = useState([])

    const fetchPolivalencias = async (user) => {
        const data = await getPolivalenciasUsuario(user)
        // console.log(data)
        if (!data?.error) {
            setActiveUser(user)
            setPolivalencias(data?.data)
        }
    }

    return (
        <div className="flex flex-col gap-1 items-start w-full">
            <span className="text-xl font-semibold mb-2 block">Polivalencias por usuario</span>
            <SelectUseForm
                name="user"
                placeholder="Seleccione un usuario"
                register={register}
                errors={errors}
                onSelect={(option) => fetchPolivalencias(option)}
                loading={isLoadingUsers}
                className='w-full'
                search={true}
                control={control}
                options={users?.data?.map((user) => { return { value: user.id, label: user.email } })}
            />

            {activeUser &&
                <div className="flex items-start w-full gap-3 justify-start">

                    <div className="grid grid-cols-4 gap-2 items-start w-full flex-wrap">
                        {operaciones?.filter(l => l.linea != 0).map((l, idx) => (
                            <div key={`l${idx}`} className=' flex flex-col px-2 items-center border border-black pb-2 h-full'>
                                <div className='bg-gray-300 border border-black w-full text-center flex items-center justify-between px-2 mt-1 '>
                                    <span className='text-xl font-semibold block w-full'>{l.linea}</span>
                                </div>

                                <div className='w-full mt-1'>
                                    <div className='flex gap-4 items-start justify-between'>
                                        <div className='w-[50%] flex flex-col gap-1 items-start'>
                                            {l?.operaciones?.filter(i => parseInt(i.orden) < 7).map((item, idx) => {
                                                return <PolivalenciaItem
                                                    operation={item}
                                                    polivalencias={polivalencias}
                                                    user={activeUser}
                                                    key={idx}
                                                />
                                            })}
                                        </div>

                                        <div className='w-[50%] flex flex-col gap-1 items-start'>
                                            {l?.operaciones?.filter(i => parseInt(i.orden) > 6).map((item, idx) => {
                                                return <PolivalenciaItem
                                                    operation={item}
                                                    user={activeUser}
                                                    polivalencias={polivalencias}
                                                    key={idx}
                                                />
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div >
            }
        </div>
    )
}
