import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import useStrap from "@hooks/useStrap";
import { Modal } from "antd";
import { useEffect, useRef, useState } from "react";
import Barcode from 'react-barcode';
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from 'react-to-print';

export default function IngresoStrap({ userVigente, setUserVigente }) {
    const [inError, setInError] = useState(null)
    const [codePrint, setCodePrint] = useState(null)
    const [disabled, setDisabled] = useState(false)
    const [isModalVisible, setIsModalVisible] = useState(false)

    const [almacenarPos, setAlmacenarPos] = useState(null)

    const { register, formState: { errors }, control, reset, watch, trigger, setValue, setFocus, getValues } = useForm();

    const { isLoadingAlt, verificarPartNumber, save: saveStrap } = useStrap(true)

    const componentRef = useRef();

    const watchRemanente = watch("remanente", false)


    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const procesaIngreso = async (code) => {
        setInError(null)
        setAlmacenarPos(null)

        const remanente = getValues("remanente")
        const lote = getValues("lote")

        //Tomo el codigo del mayler, busco a que part number hace referencia e imprimo la etiqueta
        const data = await verificarPartNumber(code.replaceAll("'", "-"))
        const date = new Date()
        let ano = date.getFullYear() + ""
        ano = ano.substring(2)
        const hora = `${ano}${date.getMonth() + 1}${date.getDate()}${date.getHours()}${date.getMinutes()}${date.getMilliseconds()}`

        if (data.error) {
            setDisabled(false)
            setInError(data?.message)
            resetear()
            setTimeout(() => setFocus("part"), [50])
            return
        }

        // const fifo = parseInt(data?.data?.nro_fifo) + 1
        // const fifo = res?.data?.fifo
        const print = {
            part_number: data?.data?.part_number,
            // barcode: `${data?.data?.part_number}|${lote}|${fifo}|${data?.data?.posicion}`,
            posicion: data?.data?.posicion,
            fifo: null,
            lote: lote,
            remanente: remanente,
            cantidad: getValues("cantidad"),
            user: userVigente.id
        }

        // return
        saveStrap(print, (res) => {
            if (!res.error) {

                print.fifo = res?.data?.fifo
                print.barcode = res?.data?.codigo_barra

                setCodePrint(print)

                setTimeout(() => {
                    if (!remanente) {
                        handlePrint()
                    }
                    resetear()
                    setAlmacenarPos(`Almacenar en ${data?.data?.posicion}`)
                    setTimeout(() => { setDisabled(false) }, [50])
                    setTimeout(() => { setFocus("part") }, [1500])

                    // setTimeout(() => { setUserVigente(null) }, [1500])

                }, [200])
            } else {
                setDisabled(false)
                setInError(res?.message)
                resetear()
                setTimeout(() => setFocus("part"), [50])
            }
        })
    }

    const resetear = () => {
        reset({
            part: null,
            lote: null,
            remanente: false,
            cantidad: 1
        })
        // setValue("part", null)
        // setValue("lote", null)
        setIsModalVisible(false)
        // setValue("remanente", "false")
    }

    useEffect(() => {
        setTimeout(() => {
            setFocus("part")
        }, [50])
    }, [])


    return (
        <div className="bg-slate-100">
            <Modal
                confirmLoading={isLoadingAlt}
                cancelButtonProps={{ className: "!bg-red-500" }}
                okButtonProps={{ className: "!bg-green-500" }}
                onCancel={() => {
                    resetear()
                    setDisabled(false)
                    setTimeout(() => setFocus("part"), [50])
                }}
                onOk={async () => {
                    const isValid = await trigger("lote")

                    if (isValid) {
                        procesaIngreso(getValues("part"))
                    }
                }}
                open={isModalVisible}
            >
                <InputUseForm
                    name="lote"
                    label="Ingrese el número de lote y presione [ENTER]"
                    className="w-full"
                    type="number"
                    register={register}
                    errors={errors}
                    placeholder="Nro de Lote"
                    classNameInput="!text-3xl !py-4"
                    rules={{ required: "El lote es requerido" }}
                    onKeyPress={async (e) => {
                        if (e.key == 'Enter') {
                            const isValid = await trigger("lote")

                            if (isValid) {
                                procesaIngreso(getValues("part"))
                            }
                        }
                    }}
                />

                {/* <Controller
                    name="remanente"
                    control={control}
                    render={({ field }) =>
                        <div className="flex gap-2 mt-1">
                            <input id="checkRemantente" className="text-xl w-5" type="checkbox" {...field} />
                            <label htmlFor="checkRemantente" className="text-xl font-semibold" >REMANTENTE</label>
                        </div>
                    }
                /> */}

                <div className="text-xs text-start w-[200px]">
                    <input className="text-2xl w-5" {...register("remanente")} type="checkbox" id="checkRemantente" value="" />
                    <label htmlFor="checkRemantente" className='text-xl font-semibold'>REPOSICIÓN</label>
                </div>

                <InputUseForm
                    name="cantidad"
                    label="Ingrese la cantidad de remantente para reposición"
                    className={`w-full ${!watchRemanente && 'hidden'}`}
                    type="number"
                    register={register}
                    errors={errors}
                    placeholder="Cantidad"
                    classNameInput="!text-3xl !py-4"
                // onKeyPress={async (e) => {
                //     if (e.key == 'Enter') {
                //         const isValid = await trigger("lote")

                //         if (isValid) {
                //             procesaIngreso(getValues("part"))
                //         }
                //     }
                // }}
                />
            </Modal>

            <div className="w-full pb-10 px-4 border-2 border-green-500 rounded-md">
                <div className="mt-4 flex items-center justify-between">
                    <span className="block text-2xl font-semibold">Ingreso</span>
                    {codePrint && <button onClick={() => handlePrint()} className="text-xs bg-blue-400">Reimprimir última etiqueta</button>}
                </div>
                <div className="flex items-center gap-2">
                    <InputUseForm
                        name="part"
                        disabled={disabled}
                        label="Escanee Mayler"
                        className="w-full"
                        register={register}
                        errors={errors}
                        placeholder="Escanear Mayler"
                        classNameInput="!text-3xl !py-4"
                        onKeyPress={(e) => {
                            if (e.key == 'Enter' && e.target.value != '') {
                                setDisabled(true)
                                setIsModalVisible(true)
                                setTimeout(() => { setFocus("lote") }, [50])
                            }
                        }}
                    />
                </div>

                {almacenarPos && <span className="block bg-yellow-200 p-2 rounded-md text-xs font-semibold">{almacenarPos}</span>}

                {isLoadingAlt &&
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-semibold">Procesando</span>
                        <Loader />
                    </div>
                }

                {inError &&
                    <span className="block py-4 text-xl text-white bg-error rounded-md px-4">{inError}</span>
                }
            </div>

            <div className="hidden print:flex" ref={componentRef}>
                {codePrint &&
                    <div className="flex flex-col relative">
                        <Barcode className='w-full' value={codePrint?.barcode || ""} height={60} width={2} />
                        {codePrint.remanente &&
                            <div className="flex absolute left-3 top-20">
                                <span className="text-2xl block font-bold">R</span>
                            </div>
                        }
                        {!codePrint.remanente &&
                            <div className="flex absolute right-20 top-20">
                                <span className="text-2xl block font-bold">{parseInt(codePrint.lote)}</span>
                            </div>
                        }
                        <div className="flex absolute right-2 top-20">
                            <span className="text-2xl block  font-bold">{codePrint.posicion}</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
