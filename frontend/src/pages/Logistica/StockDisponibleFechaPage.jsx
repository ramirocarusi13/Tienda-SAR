import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import ModalModificaKanbanLogistica from "@components/ModalModificaKanbanLogistica";
import SelectUseForm from "@components/SelectUseForm";
import TableStockLogistica from "@components/TableStockLogistica";
import { useAuth } from '@hooks/useAuth';
import useModels from "@hooks/useModels";
import { setStockLogisticaMesModelo, stockLogisticaMesModelo } from "@services/StockService";
import { ROLES } from "@utils/Constants";
import { formatDateEn } from "@utils/Utils";
import { Modal, message } from "antd";
import { Excel } from "antd-table-saveas-excel";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FaRegFileExcel } from "react-icons/fa";

const getValueStockDate = (stock, fecha, run = 2) => {

    const data = stock?.filter(s => s.fecha_egreso == fecha && s.run == run)
    if (data?.length > 0) {
        return data[0].cantidad
    } else {
        return "-"
    }
}

const getValueStock = (stock, mes, ano) => {
    const data = stock?.filter(s => s.mes == mes && s.ano == ano)
    if (data?.length > 0) {
        return data[0].cantidad
    } else {
        return "-"
    }
}

const nameMonth = (mes, year) => {
    const y = year + ""
    switch (mes) {
        case 1: return "ENE " + y.substring(2);
        case 2: return "FEB " + y.substring(2);
        case 3: return "MAR " + y.substring(2);
        case 4: return "ABR " + y.substring(2);
        case 5: return "MAY " + y.substring(2);
        case 6: return "JUN " + y.substring(2);
        case 7: return "JUL " + y.substring(2);
        case 8: return "AGO " + y.substring(2);
        case 9: return "SEP " + y.substring(2);
        case 10: return "OCT " + y.substring(2);
        case 11: return "NOV " + y.substring(2);
        case 12: return "DIC " + y.substring(2);
        default:
            break;
    }
}

export default function StockDisponibleFechaPage() {
    const { userData } = useAuth();

    const { isLoading: isLoadingModels, response: models } = useModels()
    const [stock, setStock] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [statusResponse, setStatusResponse] = useState({ error: false, message: null })
    const [isVerify, setIsVerify] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isModalOpenMod, setIsModalOpenMod] = useState(false)
    const [esEgreso, setEsEgreso] = useState(false)
    const [currentModel, setCurrentModel] = useState(null)
    const [columns, setColumns] = useState([])
    const { register, control, handleSubmit, formState: { errors }, getValues, setFocus, setValue, watch } = useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const [disabled, setDisabled] = useState(false)
    const [runSelected, setRunSelected] = useState(null)

    const watchModelo = watch("modelo", '')

    const addColumns = () => {
        //Obtengo las columnas de fecha de un dia anterior hasta +3 dias
        const today = new Date()
        let from = new Date()
        let to = new Date()
        let monthStart = new Date()

        from.setDate(today.getDate())
        to.setDate(today.getDate() + 1)

        const INTERVALO = 1000 * 60 * 60 * 24;
        const INTERVALO_MES = 1000 * 60 * 60 * 24 * 30;

        // let montStart = new Date(today.get)
        monthStart.setDate(today.getDate() - (30 * 14))

        // console.log(monthStart, monthStart.getFullYear(), today.getFullYear())

        const colsTmp = [
            {
                title: '',
                dataIndex: 'nombre',
                key: 'nombre',
                fixed: 'left',
                width: 130,
                align: "center",
                className: "bg-slate-400 !text-xl font-semibold min-w-[100px]"
            },
            // {
            //     title: "ENE 23",
            //     align: "center",
            //     dataIndex: 'ene23',
            //     key: 'ene23',
            //     className: "border-2 border-red-500 font-bold",
            //     render: (_, record) => getValueStock(record?.stock, "1", "2023")
            // },
            // {
            //     title: "FEB 23",
            //     align: "center",
            //     dataIndex: 'feb23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'feb23',
            //     render: (_, record) => getValueStock(record?.stock, "2", "2023")
            // },
            // {
            //     title: "MAR 23",
            //     align: "center",
            //     dataIndex: 'mar23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'mar23',
            //     render: (_, record) => getValueStock(record?.stock, "3", "2023")
            // },
            // {
            //     title: "ABR 23",
            //     align: "center",
            //     dataIndex: 'abr23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'abr23',
            //     render: (_, record) => getValueStock(record?.stock, "4", "2023")
            // },
            // {
            //     title: "MAY 23",
            //     align: "center",
            //     dataIndex: 'may23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'may23',
            //     render: (_, record) => getValueStock(record?.stock, "5", "2023")
            // },
            // {
            //     title: "JUN 23",
            //     align: "center",
            //     dataIndex: 'jun23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'jun23',
            //     render: (_, record) => getValueStock(record?.stock, "6", "2023")
            // },
            // {
            //     title: "JUL 23",
            //     align: "center",
            //     dataIndex: 'jul23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'jul23',
            //     render: (_, record) => getValueStock(record?.stock, "7", "2023")
            // },
            // {
            //     title: "AGO 23",
            //     align: "center",
            //     dataIndex: 'ago23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'ago23',
            //     render: (_, record) => getValueStock(record?.stock, "8", "2023")
            // },
            // {
            //     title: "SEP 23",
            //     align: "center",
            //     dataIndex: 'sep23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'sep23',
            //     render: (_, record) => getValueStock(record?.stock, "9", "2023")
            // },
            // {
            //     title: "OCT 23",
            //     align: "center",
            //     dataIndex: 'oct23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'oct23',
            //     render: (_, record) => getValueStock(record?.stock, "10", "2023")
            // },
            // {
            //     title: "NOV 23",
            //     align: "center",
            //     dataIndex: 'nov23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'nov23',
            //     render: (_, record) => getValueStock(record?.stock, "11", "2023")
            // },
            // {
            //     title: "DIC 23",
            //     align: "center",
            //     dataIndex: 'dic23',
            //     className: "border-2 border-red-500 font-bold",
            //     key: 'dic23',
            //     render: (_, record) => getValueStock(record?.stock, "12", "2023")
            // },
            // {
            //     title: "ENE 24",
            //     align: "center",
            //     dataIndex: 'ene24',
            //     key: 'ene24',
            //     className: "border-2 border-green-500 font-bold",

            //     render: (_, record) => getValueStock(record?.stock, "1", "2024")
            // },
            // {
            //     title: "FEB 24",
            //     align: "center",
            //     dataIndex: 'feb24',
            //     className: "border-2 border-green-500 font-bold",
            //     key: 'feb24',
            //     render: (_, record) => getValueStock(record?.stock, "2", "2024")
            // },
            // {
            //     title: "MAR 24",
            //     align: "center",
            //     dataIndex: 'mar24',
            //     className: "border-2 border-green-500 font-bold",
            //     key: 'mar24',
            //     render: (_, record) => getValueStock(record?.stock, "3", "2024")
            // },

        ]

        const colorFecha = (today, fecha) => {
            const dif = (today.getMonth() + 1) - (fecha.getMonth() + 1)

            if (dif < 3 && dif >= 0) {
                if (today.getFullYear() - fecha.getFullYear() > 0) {
                    return "border-red-500"
                } else {
                    return "border-green-500"
                }
            } else {
                return "border-red-500"
            }
        }

        //CREO LS COLUMNAS DE LOS MESES
        for (let i = monthStart; i <= from; i = new Date(i.getTime() + (INTERVALO_MES))) {
            colsTmp.push({
                title: `${nameMonth(i.getMonth() + 1, i.getFullYear())}`,
                key: i,
                align: "center",
                dataIndex: Math.random(),
                className: `border-2 font-bold ${colorFecha(today, i)}`,
                render: (_, record) => getValueStock(record?.stock, i.getMonth() + 1, i.getFullYear())
            })
        }

        colsTmp.push(
            {
                title: 'CUAR',
                align: "center",
                dataIndex: 'cuar',
                className: "border-2 border-yellow-500 font-bold",
                key: 'cuar',
                render: (_, record) => {
                    if (record?.cuarentena?.length > 0) {
                        if (parseInt(record.cuarentena[0].cantidad) > 0) {
                            return record.cuarentena[0].cantidad;
                        } else {
                            return "-"
                        }
                    } else {
                        return "-"
                    }
                }
            },
            {
                title: 'RECH',
                align: "center",
                dataIndex: 'rech',
                className: "border-2 border-red-500 font-bold",
                key: 'rech',
                render: (_, record) => {
                    if (record?.rechazados?.length > 0) {
                        if (parseInt(record.rechazados[0].cantidad) > 0) {
                            return record.rechazados[0].cantidad;
                        } else {
                            return "-"
                        }
                    } else {
                        return "-"
                    }
                }
            }
        )

        for (let i = from; i <= to; i = new Date(i.getTime() + INTERVALO)) {
            colsTmp.push({
                title: `${i.getDate()}/${i.getMonth() + 1}`,
                key: i,
                align: "center",
                dataIndex: Math.random(),
                className: "border-2 border-orange-500 font-bold",
                children: [
                    {
                        title: 'RUN1',
                        key: `${i}RUN1`,
                        className: "border-2 border-orange-500 font-bold text-center",
                        render: (_, record) => getValueStockDate(record?.egresos, formatDateEn(i), 1),
                    },
                    {
                        title: 'RUN2',
                        key: `${i}RUN2`,
                        className: "border-2 border-orange-500 font-bold text-center",
                        render: (_, record) => getValueStockDate(record?.egresos, formatDateEn(i), 2),
                    },
                    {
                        title: 'RUN3',
                        key: `${i}RUN3`,
                        className: "border-2 border-orange-500 font-bold text-center",
                        render: (_, record) => getValueStockDate(record?.egresos, formatDateEn(i), 3),
                    },
                    {
                        title: 'RUN4',
                        key: `${i}RUN4`,
                        className: "border-2 border-orange-500 font-bold text-center",
                        render: (_, record) => getValueStockDate(record?.egresos, formatDateEn(i), 4),
                    }
                ]

            })
        }

        setColumns(colsTmp)
    }

    const fetchStock = async () => {
        setIsLoading(true)
        const data = await stockLogisticaMesModelo(watchModelo);
        setStock(data.data)
        setIsLoading(false)
    }

    const showError = (text) => { message.error(text) }

    useEffect(() => { addColumns() }, [])
    useEffect(() => { fetchStock() }, [watchModelo])

    const onSubmit = async (data) => {

        // if (!esEgreso && !currentModel) {
        //     showError("Debe seleccionar el modelo!")
        //     setDisabled(false)

        //     setValue("kanban", null)
        //     setTimeout(() => {
        //         setFocus("kanban")
        //     }, [50])
        //     return
        // }

        if (esEgreso && !runSelected) {
            // showError("Debe seleccionar el run!")
            setStatusResponse({ error: true, message: "Debe seleccionar el run!" })

            setDisabled(false)
            setValue("kanban", null)
            setTimeout(() => {
                setFocus("kanban")
            }, [50])
            return
        }

        setIsVerify(true)

        const response = await setStockLogisticaMesModelo({ egreso: esEgreso ? 1 : 0, kanban: data.kanban.replaceAll("'", "-"), modelo: currentModel, run: runSelected })

        setStatusResponse({
            error: response.error,
            message: response.message
        })

        setValue("kanban", null)

        setIsVerify(false)

        if (!getValues("mantener")) {
            setCurrentModel(null)
        }

        // if (!response.error) {
        fetchStock()
        // }
        setDisabled(false)
        // setRunSelected(null)

        setTimeout(() => {
            setFocus("kanban")
        }, [50])

        setTimeout(() => {
            setStatusResponse({ error: false, message: null })
        }, [2500])
    }

    const keyPressEnter = (e) => {
        if (e.key == 'Enter') {
            setDisabled(true)
            handleSubmit(onSubmit)()
        }
    }

    const handlePrint = () => {
        const excel = new Excel();
        excel
            .addSheet("sheet 1")
            .addColumns(columns)
            .addDataSource(stock)
            .saveAs("Excel.xlsx");
    }

    return (
        <div>
            <ModalModificaKanbanLogistica isModalOpen={isModalOpenMod} setIsModalOpen={setIsModalOpenMod} />
            {contextHolder}
            <div className="flex gap-4 mb-2 items-center justify-center">


                <button onClick={() => {
                    setEsEgreso(false)
                    setCurrentModel(null)
                    setIsModalOpen(true)
                    setTimeout(() => setFocus("kanban"), 50)
                }}
                    className="bg-success text-white hover:opacity-80"
                >AGREGAR KANBAN</button>

                <button onClick={() => {
                    setEsEgreso(true)
                    setIsModalOpen(true)
                    setTimeout(() => setFocus("kanban"), 50)

                }}
                    className="bg-error text-white hover:opacity-80"
                >RETIRAR KANBAN</button>

                {(userData?.rol?.id == ROLES.IT || userData?.rol?.id == ROLES.DESARROLLO) &&
                    <button onClick={() => {
                        setIsModalOpenMod(true)

                    }}
                        className="bg-blue-500 text-white hover:opacity-80"
                    >MODIFICAR KANBAN</button>
                }

                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-green-400 "
                >
                    <FaRegFileExcel /> EXPORTAR A EXCEL
                </button>
            </div>

            <SelectUseForm
                name="modelo"
                placeholder="Seleccione un modelo"
                register={register}
                errors={errors}
                className="w-full "
                loading={isLoadingModels}
                search={true}
                control={control}
                options={models.map((model) => { return { value: model.id, label: model.nombre } })}
            />

            <TableStockLogistica
                data={stock}
                columns={columns}
                loading={isLoading}
            />

            <Modal
                title={`Escanee el Kanban a ${esEgreso ? 'egresar' : 'ingresar'}`}
                width={"90%"}
                style={{ top: 20, }}
                onCancel={() => {
                    fetchStock()
                    setIsModalOpen(false)
                }}
                open={isModalOpen}
                footer={[]}
            >
                <div className="flex flex-col gap-2 w-full">

                    <InputUseForm
                        disabled={disabled}
                        name="kanban"
                        className="w-full mt-2"
                        register={register}
                        classNameInput="!text-2xl !py-4"
                        errors={errors}
                        placeholder={"Nro Kanban"}
                        // placeholder={!currentModel && !esEgreso ? "Seleccione un modelo" : "Nro Kanban"}
                        rules={{ required: "Ingrese el número de Kanban" }}
                        onKeyPress={keyPressEnter}
                    />

                    {esEgreso &&
                        <div className="flex items-center justify-between gap-4">
                            <button onClick={() => {
                                setRunSelected("1")
                                setTimeout(() => setFocus("kanban"), 50)
                            }
                            } className={`${runSelected == "1" ? "bg-green-500" : "bg-orange-500"} w-full h-20 text-2xl`}>RUN 1</button>
                            <button onClick={() => {
                                setRunSelected("2")
                                setTimeout(() => setFocus("kanban"), 50)
                            }
                            } className={`${runSelected == "2" ? "bg-green-500" : "bg-orange-500"} w-full h-20 text-2xl`}>RUN 2</button>
                            <button onClick={() => {
                                setRunSelected("3")
                                setTimeout(() => setFocus("kanban"), 50)
                            }
                            } className={`${runSelected == "3" ? "bg-green-500" : "bg-orange-500"} w-full h-20 text-2xl`}>RUN 3</button>
                            <button onClick={() => {
                                setRunSelected("4")
                                setTimeout(() => setFocus("kanban"), 50)
                            }
                            } className={`${runSelected == "4" ? "bg-green-500" : "bg-orange-500"} w-full h-20 text-2xl`}>RUN 4</button>
                        </div>
                    }

                    {/* {!esEgreso &&
                        <div className="grid grid-cols-4 gap-6 w-full items-start justify-center">
                            <div className="grid grid-cols-4 gap-2  h-full w-full ">
                                {models.filter(m => m.nombre.substr(0, 2) == "SF").map((model, idx) => (
                                    <button key={idx} onClick={() => {
                                        setCurrentModel(model.nombre)
                                        setTimeout(() => {
                                            setFocus("kanban")
                                        }, 50)
                                    }} className={`w-full h-10 ${currentModel == model.nombre ? 'bg-green-500' : 'bg-orange-500'}`}>{model.nombre}</button>
                                ))}
                            </div>



                            <div className="grid grid-cols-3  grid-rows-5 gap-2 w-full h-full ">
                                {models.filter(m => m.nombre.substr(0, 2) == "SU" || m.nombre.substr(0, 2) == "ST").map((model, idx) => (
                                    <button key={idx} onClick={() => {
                                        setCurrentModel(model.nombre)
                                        setTimeout(() => {
                                            setFocus("kanban")
                                        }, 50)
                                    }} className={`w-full h-10 ${currentModel == model.nombre ? 'bg-green-500' : 'bg-yellow-400'}`}>{model.nombre}</button>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2 w-full h-full ">
                                {models.filter(m => m.nombre.substr(0, 2) == "SS").map((model, idx) => (
                                    <button key={idx} onClick={() => {
                                        setCurrentModel(model.nombre)
                                        setTimeout(() => {
                                            setFocus("kanban")
                                        }, 50)
                                    }} className={`w-full h-10 ${currentModel == model.nombre ? 'bg-green-500' : 'bg-violet-400'}`}>{model.nombre}</button>
                                ))}
                            </div>

                            <div className="grid grid-cols-3 gap-2 grid-rows-5 w-full items-start h-full ">
                                {models.filter(m => m.nombre.substr(0, 1) == "H").map((model, idx) => (
                                    <button key={idx} onClick={() => {
                                        setCurrentModel(model.nombre)
                                        setTimeout(() => {
                                            setFocus("kanban")
                                        }, 50)
                                    }} className={`w-full h-10 ${currentModel == model.nombre ? 'bg-green-500' : 'bg-green-300'}`}>{model.nombre}</button>
                                ))}
                            </div>
                        </div>
                    } */}

                    {/* {!esEgreso &&
                        <Controller
                            name="mantener"
                            control={control}
                            render={({ field }) =>
                                <div className="flex gap-1 mt-1">
                                    <input id="mantener" className="p-2 w-5" type="checkbox" {...field} />
                                    <label htmlFor="mantener" className="text-xl">Mantener modelo</label>
                                </div>
                            }
                        />
                    } */}

                    {isVerify && <div className="flex items-center justify-center flex-col gap-2"><span className="text-xl font-semibold">Verificando</span><Loader /></div>}
                    {!isVerify && statusResponse?.message && <div className={`${statusResponse?.error ? 'bg-error' : 'bg-green-500'} h-40 w-full flex items-center justify-center`}><span className="font-semibold text-2xl block">{statusResponse.message.toUpperCase()}</span></div>}
                </div>
            </Modal>
        </div>
    )
}
