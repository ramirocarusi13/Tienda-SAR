import InputUseForm from "@components/InputUseForm"
import Loader from "@components/Loader"
import useAirbagTraza from "@hooks/useAirbagTraza"
import { formatDateTime } from "@utils/Utils"
import { useForm } from "react-hook-form"

const Label = ({ title, value }) => {
    return <span className="text-xl"><span className="font-bold">{title} : </span>{value}</span>
}

export default function ReporteTrazabilidadAirbagPage() {

    const { register, control, formState: { errors } } = useForm();
    const { isLoading, response: strap, getData: fetchAirbagData } = useAirbagTraza()

    const keyPressEnter = (e) => {
        if (e.key == 'Enter') {
            fetchAirbagData(e.target.value)
        }
    }

    return (
        <div>
            <div>
                <InputUseForm
                    label="Escanee el código QR"
                    name="qr"
                    className="w-full"
                    register={register}
                    classNameInput="!text-2xl !py-4"
                    errors={errors}
                    placeholder="Código QR"
                    rules={{ required: "Ingrese o escanee el qr" }}
                    onKeyPress={keyPressEnter}
                />

                {!isLoading && strap?.error && <span className="text-red-500 font-semibold text-2xl">{strap?.message}</span>}
                {isLoading && <div className="flex items-center justify-center w-full mt-10"><Loader /></div>}

                {!isLoading && !strap?.error &&
                    <div className="flex flex-col gap-1">

                        <div className="flex flex-col items-start mt-4 w-full">
                            <span className="font-bold block text-xl bg-yellow-200 mb-2">DATOS ETIQUETA</span>

                            <div className="flex items-center gap-6 w-full justify-between">
                                <Label title="ID" value={strap?.data?.ID} />
                                <Label title="LINEA" value={strap?.data?.LINEA} />
                                <Label title="LADO" value={strap?.data?.LADO} />
                                <Label title="SECUENCIA" value={strap?.data?.SECUENCIA} />
                                <Label title="TURNO" value={strap?.data?.TURNO} />
                                <Label title="MODELO" value={strap?.data?.modelo?.MODELO} />
                                <Label title="FABRICANTE" value={strap?.data?.FABRICANTE} />
                            </div>

                            <div className="flex items-center gap-6 w-full">
                                <Label title="FECHA FAB." value={formatDateTime(strap?.data?.HORA_FAB)} />
                                <Label title="FECHA VAL." value={formatDateTime(strap?.data?.HORA_VAL)} />
                                <Label title="KANBAN" value={strap?.data?.KANBAN} />
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col items-start">
                            <span className="font-bold block text-xl bg-yellow-200 mb-2">REGISTRO STRAP</span>

                            {strap?.data?.eventos.map((e, idx) => (
                                <div key={idx} className="flex flex-col items-start border-b-2 py-2">
                                    <div className="flex gap-6 items-start">
                                        <Label title="PART NUMBER" value={e?.strap?.part_number} />
                                        <Label title="LOTE" value={e?.strap?.lote} />
                                        <Label title="FECHA EGRESO" value={formatDateTime(e?.strap?.created_at)} />
                                        <Label title="USUARIO EGRESO" value={e?.user?.email?.toUpperCase()} />
                                    </div>

                                    <div className="flex gap-6 items-start">
                                        {e?.solicitante && <Label title="SOLICITADO POR" value={e?.solicitante?.email?.toUpperCase()} />}
                                        {e?.autorizante && <Label title="AUTORIZADO POR" value={e?.autorizante?.email?.toUpperCase()} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}