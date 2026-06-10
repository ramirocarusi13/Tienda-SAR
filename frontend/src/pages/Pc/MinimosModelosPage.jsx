import Loader from "@components/Loader";
import TableMinimosModelo from "@components/Pc/TableMinimosModelo";
import useModels from '@hooks/useModels';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function MinimosModelosPage() {

    const { isLoading, response: modelos, getData, updateDatos } = useModels(false)
    const { register, control, handleSubmit, setValue, reset, formState: { errors } } = useForm();
    const [plan, setPlan] = useState([])
    const [status, setStatus] = useState(null)

    const onSubmit = async (data) => {
        const res = await updateDatos({ items: plan }, (response) => {
            setStatus({
                error: response?.error,
                message: response?.error ? response.message : 'Actualizado.'
            })
        })
    }

    const fetchModelos = async () => {
        const res = []
        const data = await getData(null, true)

        data?.data?.map(d => {
            res.push({
                'id': d?.id,
                'modelo': d?.nombre,
                // 'minimo': d?.minimo_buffer ? d?.minimo_buffer : "0",
                'ptopedido': d?.ptopedido_buffer ? d?.ptopedido_buffer : "0",
                'consumo': d?.consumo ? d?.consumo : "0",
            })
        })
        setPlan(res)
    }

    useEffect(() => {
        fetchModelos()
    }, [])

    return (
        <div className='w-full !min-h-[100vh] flex items-start justify-start gap-1'>

            {plan?.length > 0 && <TableMinimosModelo setModelos={setPlan} modelos={plan} />}

            <div className="flex flex-col gap-2">
                <button disabled={isLoading} className="bg-green-400 mb-2 min-w-[300px] text-sm disabled:opacity-70" onClick={handleSubmit(onSubmit)}>Confirmar</button>
                {isLoading && <Loader />}
                {!isLoading && status && <span className={`${status?.error ? 'text-error' : 'text-green-600'} font-semibold py-1 text-center block `}>{status.message}</span>}
            </div>
        </div>
    )
}
