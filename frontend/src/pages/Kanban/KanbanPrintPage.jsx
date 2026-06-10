import InputUseForm from "@components/InputUseForm";
import KanbanPrint from "@components/KanbanPrint";
import KanbanReversoPrint from "@components/KanbanReversoPrint";


import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import useKanban from "@hooks/useKanban";
import useModels from "@hooks/useModels";
import { meses } from "@utils/Constants";
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useReactToPrint } from 'react-to-print';
import EtiquetaRack1 from "@components/Pc/EtiquetaRack1"
import EtiquetaRack0 from "@components/Pc/EtiquetaRack0"
import EtiquetaRack from "@components/Pc/EtiquetaRack"
import QRCode from "react-qr-code";
import KanbanPrintV2 from "../../components/KanbanPrintV2";

const mods = ['SUNS', 'SUJS', 'SUBS', 'SUMS', 'SUKS']

export default function KanbanPrintPage() {
    const { register, control, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ defaultValues: { cantidad_reverso: "1", hojas: "1" } });
    const { isLoading: isLoadingModels, response: models, getData } = useModels()
    const { isLoading, store: createkanban } = useKanban(false)
    const [kanbans, setKanbans] = useState([])

    const componentRef = useRef();

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const onSubmit = async (data) => {
        setKanbans(null)

        //Obtengo los datos del modelo
        const model = await getData(data.modelo, true)

        // console.log(model.data)

        const temp = [{
            codigo: data.codigo,
            modelo: model?.data,
            mes: data.mes
        }]

        setKanbans(temp)


        setTimeout(() => {
            handlePrint()
        }, [200])

    }

    const racks = ['H']
    // // const racks = ['A', 'B', 'C', 'D', 'E', 'F',]
    // // const letras = ['R', 'S']
    const letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] //, 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X']
    const pos = ['0', '1', '2', '3']

    return (


        <div>
            <button className="bg-red-500" onClick={() => handlePrint()}>IMPR</button>
            <div className="border p-2 rounded-lg">
                <span className="underline text-xl">Reimprimir kanban productivo</span>
                <div className='flex gap-2 w-[100%] items-center'>
                    <SelectUseForm
                        label="Modelo"
                        name="modelo"
                        placeholder="Seleccione un modelo"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar el modelo" }}
                        className="w-full "
                        search={true}
                        loading={isLoadingModels}
                        control={control}
                        options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                    />

                    <SelectUseForm
                        label="Mes"
                        name="mes"
                        placeholder="Seleccione un mes"
                        register={register}
                        errors={errors}
                        rules={{ required: "Debe seleccionar el mes" }}
                        className="w-full "
                        search={true}
                        control={control}
                        options={meses}
                    />

                    <InputUseForm
                        size="large"
                        label="Código"
                        name="codigo"
                        className="w-full"
                        register={register}
                        errors={errors}
                        placeholder="Código"
                        rules={{ required: "Ingrese el código de kanban" }}
                    />

                </div>

                <button
                    className="w-full  bg-slate-600 text-white mt-1 flex items-center justify-center gap-2"
                    onClick={handleSubmit(onSubmit)}>
                    {isLoading ? <>Generando <Loader /></> : "Generar Kanban"}
                </button>
            </div>

            <div className=" items-center justify-center w-full  flex-col gap-1" ref={componentRef}>
                {/* <div className="grid grid-cols-3 gap-10">
                    <div className="flex items-center flex-col ml-2">
                        <QRCode value={`SFLE]CS]RH`} size={150} bordered={false} />
                        <span className="block text-center text-xl font-bold">SFLE CS RH</span>
                    </div>

                    <div className="flex items-center flex-col ml-2">
                        <QRCode value={`SFLE]CS]LH`} size={150} bordered={false} />
                        <span className="block text-center text-xl font-bold">SFLE CS LH</span>
                    </div>

                    <div className="flex items-center flex-col ml-2">
                        <QRCode value={`SFLE]BC]RH`} size={150} bordered={false} />
                        <span className="block text-center text-xl font-bold">SFLE BC RH</span>
                    </div>

                    <div className="flex items-center flex-col ml-2">
                        <QRCode value={`SFLE]BC]LH`} size={150} bordered={false} />
                        <span className="block text-center text-xl font-bold">SFLE BC LH</span>
                    </div>



                </div> */}
                {/* <div className="grid grid-cols-4 gap-6">
                    <div className="flex items-center flex-col">
                        <QRCode value="SFLC|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLC BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLC|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLC BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLC|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLC CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLC|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLC CS RH</span>
                    </div>


                    <div className="flex items-center flex-col">
                        <QRCode value="SFPA|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPA BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPA|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPA BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPA|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPA CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPA|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPA CS RH</span>
                    </div>


                    <div className="flex items-center flex-col">
                        <QRCode value="SFPB|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPB BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPB|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPB BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPB|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPB CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPB|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPB CS RH</span>
                    </div>


                    <div className="flex items-center flex-col">
                        <QRCode value="SFLA|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLA BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLA|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLA BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLA|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLA CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLA|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLA CS RH</span>
                    </div>



                    <div className="flex items-center flex-col">
                        <QRCode value="SFLB|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLB BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLB|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLB BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLB|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLB CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLB|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLB CS RH</span>
                    </div>



                    <div className="flex items-center flex-col">
                        <QRCode value="SFPC|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPC BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPC|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPC BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPC|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPC CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFPC|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFPC CS RH</span>
                    </div>


                    <div className="flex items-center flex-col">
                        <QRCode value="SFTS|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFTS BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFTS|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFTS BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFTS|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFTS CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFTS|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFTS CS RH</span>
                    </div>



                    <div className="flex items-center flex-col">
                        <QRCode value="SFHG|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFHG BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFHG|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFHG BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFHG|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFHG CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFHG|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFHG CS RH</span>
                    </div>


                    <div className="flex items-center flex-col">
                        <QRCode value="SFLE|BC|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLE BACK RH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLE|BC|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLE BACK LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLE|CS|LH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLE CS LH</span>
                    </div>

                    <div className="flex items-center flex-col">
                        <QRCode value="SFLE|CS|RH" size={100} bordered={false} />
                        <span className="block text-center text-2xl font-bold">SFLE CS RH</span>
                    </div>
                </div> */}
                {/* {mods?.map((m, idx) => (
                    <div className="grid grid-cols-4 gap-10 mt-4">
                        <div key={idx} className="flex items-center flex-col ml-2">
                            <QRCode value={`${m}|CS|LH`} size={150} bordered={false} />
                            <span className="block text-center text-xl font-bold">{m} CS LH</span>
                        </div>

                        <div key={idx} className="flex items-center flex-col ml-2">
                            <QRCode value={`${m}|CS|RH`} size={150} bordered={false} />
                            <span className="block text-center text-xl font-bold">{m} CS RH</span>
                        </div>

                        <div key={idx} className="flex items-center flex-col ml-2">
                            <QRCode value={`${m}|BC|LH`} size={150} bordered={false} />
                            <span className="block text-center text-xl font-bold">{m} BC LH</span>
                        </div>

                        <div key={idx} className="flex items-center flex-col ml-2">
                            <QRCode value={`${m}|BC|RH`} size={150} bordered={false} />
                            <span className="block text-center text-xl font-bold">{m} BC RH</span>
                        </div>
                    </div>
                ))} */}

                {/* <div className="flex items-center flex-col">
                    <QRCode value="999" size={150} bordered={false} />
                    <span className="block text-center text-xl font-bold">AUTORIZACIÓN</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="123" size={150} bordered={false} />
                    <span className="block text-center text-xl font-bold">123</span>
                </div>          

                <div className="flex items-center flex-col">
                    <QRCode value="456" size={150} bordered={false} />
                    <span className="block text-center text-xl font-bold">456</span>
                </div> */}

                {/* <div className="flex items-center flex-col ml-2">
                    <QRCode value="D|SFNJ|CS|LH" size={150} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS|SFNJ CS LH</span>
                </div> */}
                {/* <div className="flex items-center flex-col">
                    <QRCode value="D|SFPC|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFPC|SFLC CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFPC|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFPC|SFLC CS RH</span>
                </div> */}

                {/* <div className="flex items-center flex-col">
                    <QRCode value="SFPC|BC|LH" size={150} bordered={false} />
                    <span className="block text-center text-2xl font-bold">SFPC BACK LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFPC|BC|RH" size={150} bordered={false} />
                    <span className="block text-center text-2xl font-bold">SFPC BACK RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFLC|BC|RH" size={150} bordered={false} />
                    <span className="block text-center text-2xl font-bold">SFLC BACK RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFLC|BC|LH" size={150} bordered={false} />
                    <span className="block text-center text-2xl font-bold">SFLC BACK LH</span>
                </div> */}

                {/* <div className="flex items-center flex-col gap-3 mt-6">
                    <span className="block text-center text-4xl font-bold">ALMACENAR</span>
                    <QRCode value="INGRESO" size={150} bordered={false} />
                </div> */}

                {/* <div className="flex items-center flex-col gap-3 mt-6">
                    <span className="block text-center text-4xl font-bold">SALIR/CANCELAR</span>
                    <QRCode value="CERRAR" size={150} bordered={false} />
                </div> */}

                {/* <div className="flex items-center flex-col gap-3 mt-6">
                    <span className="block text-center text-3xl font-bold">SHOPPING HOOK LEFT</span>
                    <QRCode value="SHL" size={120} bordered={false} />
                </div>

                <div className="flex items-center flex-col gap-3 mt-6">
                    <span className="block text-center text-3xl font-bold">SHOPPING HOOK RIGHT</span>
                    <QRCode value="SHR" size={120} bordered={false} />
                </div>

                <div className="flex items-center flex-col gap-3 mt-6">
                    <span className="block text-center text-3xl font-bold">STRAP LEFT</span>
                    <QRCode value="STL" size={120} bordered={false} />
                </div>

                <div className="flex items-center flex-col gap-3 mt-6">
                    <span className="block text-center text-3xl font-bold">STRAP RIGHT</span>
                    <QRCode value="STR" size={120} bordered={false} />
                </div> */}


                {/* <div className="flex items-center flex-col">
                    <QRCode value="SFEP|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEP CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEP|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEP CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEP|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEP BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEP|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEP BC RH</span>
                </div>


                <div className="flex items-center flex-col">
                    <QRCode value="SFKQ|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKQ CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFKQ|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKQ CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFKQ|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKQ BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFKQ|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKQ BC RH</span>
                </div>


                <div className="flex items-center flex-col">
                    <QRCode value="SFKN|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKN CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFKN|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKN CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFKN|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKN BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFKN|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKN BC RH</span>
                </div>


                <div className="flex items-center flex-col">
                    <QRCode value="SFBN|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFBN CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFBN|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFBN CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFBN|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFBN BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFBN|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFBN BC RH</span>
                </div>


                <div className="flex items-center flex-col">
                    <QRCode value="SFMR|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFMR CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFMR|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFMR CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFMR|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFMR BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFMR|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFMR BC RH</span>
                </div>


                <div className="flex items-center flex-col">
                    <QRCode value="SFTS|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFTS|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFTS|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFTS|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS BC RH</span>
                </div>



                <div className="flex items-center flex-col">
                    <QRCode value="SFNG|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNG CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFNG|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNG CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFNG|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNG BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFNG|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNG BC RH</span>
                </div>



                <div className="flex items-center flex-col">
                    <QRCode value="SFNJ|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNJ CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFNJ|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNJ CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFNJ|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNJ BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFNJ|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNJ BC RH</span>
                </div>



                <div className="flex items-center flex-col">
                    <QRCode value="SFJJ|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFJJ CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFJJ|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFJJ CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFJJ|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFJJ BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFJJ|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFJJ BC RH</span>
                </div>


                <div className="flex items-center flex-col">
                    <QRCode value="SFHP|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHP CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFHP|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHP CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFHP|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHP BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFHP|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHP BC RH</span>
                </div>


                <div className="flex items-center flex-col">
                    <QRCode value="SFHG|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHG CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFHG|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHG CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFHG|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHG BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFHG|BC|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHG BC RH</span>
                </div>



                <div className="flex items-center flex-col">
                    <QRCode value="SFEG|CS|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEG CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEG|CS|RH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEG CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEG|BC|LH" size={100} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEG BC LH</span>
                </div>
*/}
                {/* <div className="flex items-center flex-col ml-20">
                    <QRCode value="INGRESOT" size={150} bordered={false} />
                    <span className="block text-center text-xl font-bold">INGRESO TEMPORAL</span>
                </div> */}


                {/* <div className="grid grid-cols-2 items-center justify-center gap-10" ref={componentRef}> */}
                {/* {racks?.map(r => (
                    letras?.map(l => (
                        // pos?.map(p => (
                        <EtiquetaRack0 key={`${r}-${l}`} rack={r} pos={l} />
                        // <div className="flex items-center flex-col">
                        //     <QRCode value={`${r}-${l}-${p}`} size={100} bordered={false} />
                        //     <span className="block text-center text-xl font-bold">{`${r}-${l}-${p}`}</span>
                        // </div>
                        // ))
                    ))
                ))} */}




                {/* {kanbans?.map((kanban, idx) => {
                    return <KanbanPrint kanban={kanban} key={`k_${idx}`} />
                }
                )} */}

                {/* {kanbans?.map((kanban, idx) => {
                    return <KanbanPrintV2 kanban={kanban} key={idx} />
                }
                )} */}

                {/* <KanbanReversoPrint /> */}



                {/* <div className="flex items-center flex-col">
                    <QRCode value="SFEG|CS|LH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEG CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEG|CS|RH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEG CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEG|BC|LH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEG BC LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="SFEG|BC|RH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFEG BC RH</span>
                </div> */}



                {/* <div className="flex items-center flex-col">
                    <QRCode value="D|SFJJ|CS|LH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFJJ|SFHG CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFJJ|CS|RH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFJJ|SFHG CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFNJ|CS|RH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNJ|SFMR|SFKN|SFBN CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFNJ|CS|LH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS|SFNJ|SFMR|SFKN|SFBN|SFNG|SFEG</span>
                    <span className="block text-center text-xl font-bold">CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFHP|CS|LH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFHP CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFTS|CS|RH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS|SFHP|SFEP CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFNG|CS|RH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFNG CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFKQ|CS|RH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKQ CS RH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFTS|CS|LH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFTS CS LH</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="D|SFKQ|CS|LH" size={80} bordered={false} />
                    <span className="block text-center text-xl font-bold">SFKQ|SFEP CS LH</span>
                </div> */}
            </div>

            {/* <div className="grid grid-cols-2 gap-1" ref={componentRef}>
                <EtiquetaRack0 rack={"B"} pos={"R"} pos2={"0"} />
                <EtiquetaRack0 rack={"B"} pos={"S"} pos2={"0"} />
                <EtiquetaRack0 rack={"D"} pos={"S"} pos2={"0"} />
                <EtiquetaRack0 rack={"A"} pos={"U"} pos2={"0"} />
            </div> */}

            {/* <div className="grid grid-cols-4 gap-3 p-2" ref={componentRef}> */}
            {/* <div className="grid grid-cols-2 gap-1" ref={componentRef}>
                <EtiquetaRack0 rack={"B"} pos={"R"} pos2={"0"} />
                <EtiquetaRack0 rack={"B"} pos={"S"} pos2={"0"} /> */}

            {/* <div className="grid grid-cols-2 gap-5 " ref={componentRef}>

                {racks.map(r => (
                    letras.map((l, idx) => (
                        // pos.map((p, idx) => (
                        <EtiquetaRack0 key={idx} rack={r} pos={l} />
                        // ))
                    ))
                ))}
            </div> */}
            {/* </div> */}

            {/* <div className="flex  gap-20 ml-4 mt-4" ref={componentRef}>
                <div className="flex items-center flex-col">
                    <QRCode value="nkr58qe" size={100} bordered={false} />
                    <span>NUSKE KEVIN</span>
                </div>
            </div> */}

            {/* <div className="flex items-center flex-col">
                    <QRCode value="DESPACHO" size={150} bordered={false} />
                    <span className="block text-center text-xl font-bold">DESPACHO</span>
                </div>

                <div className="flex items-center flex-col">
                    <QRCode value="CANCELAR" size={150} bordered={false} />
                    <span className="block text-center text-xl font-bold">CANCELAR</span>
                </div> */}




        </div>

    )
}
