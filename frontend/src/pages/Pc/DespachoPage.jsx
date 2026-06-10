import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import useModels from '@hooks/useModels';
import { consultaModelosDespacho, guardarDespacho } from "@services/DepositoService";
import { depositos } from "@utils/Constants";
import { getFullDay, getFullMonth } from "@utils/Utils";
import { Divider, Dropdown, Tooltip, notification } from "antd";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as XLSX from 'xlsx';

import ModalSelectEditPedido from "@components/Pc/ModalSelectEditPedido";
import PrintDespacho from "@components/Pc/PrintDespacho";
import { fetchDespacho } from "@services/DepositoService";
import { useEffect, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { Tag } from "antd";


export default function DespachoPage() {
    const { isLoading: isLoadingModels, response: models } = useModels(true)
    const { register, control, handleSubmit, formState: { errors }, getValues, setFocus, setValue } = useForm();

    const [pedido, setPedido] = useState([])
    const [stock, setStock] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [posicionesSeleccionadas, setPosicionesSeleccionadas] = useState([])
    const [run, setRun] = useState(null)
    const [eventFile, setEventFile] = useState(null)
    const [selectedDespacho, setSelectedDespacho] = useState(null)
    const [pickeados, setPickeados] = useState(null)

    const [api, contextHolder] = notification.useNotification();
    const componentRef = useRef();


    const agregarModeloAPedido = (data) => {
        const modelName = models?.find(m => m.id == data.modelo)?.nombre
        const exist = pedido?.filter(p => p.modelo == modelName)

        if (exist?.length > 0) {
            const prev = pedido?.filter(p => p.modelo != modelName)
            prev.push({
                modelo: modelName,
                cantidad: parseInt(data?.cantidad) + parseInt(exist[0].cantidad),
                pendiente: parseInt(data?.cantidad) + parseInt(exist[0].cantidad)
            })
            setPedido(prev)
        } else {
            setPedido(prev => [...prev, {
                modelo: modelName,
                cantidad: parseInt(data?.cantidad),
                pendiente: parseInt(data?.cantidad)
            }])
        }

        setValue("cantidad", null)
        setValue("modelo", null)
        setTimeout(() => {
            setFocus("modelo")
        }, 50)
    }

    const consultaDisponibilidad = async () => {
        setIsLoading(true)
        const data = await consultaModelosDespacho(pedido)
        setPosicionesSeleccionadas([])
        setStock(data?.data)

        const pedidoTemp = pedido

        pedidoTemp.forEach(p => p.pendiente = p.cantidad)

        const rotacion = 4
        let rotados = 1
        const seleccionados = []

        data?.data?.racks?.map(e => {
            // console.log(e)
            if (rotados <= rotacion) {
                rotados++
                seleccionados.push(e)
                const index = pedidoTemp.findIndex(p => p.modelo == e.modelo)

                if (index >= 0) {
                    pedidoTemp[index].pendiente = pedidoTemp[index].pendiente - 1
                }
            }
        });


        data?.data?.dollys?.map(e => {
            const pendientes = pedidoTemp?.find(p => p.modelo == e.modelo)?.pendiente
            if (pendientes > 0) {
                seleccionados.push(e)

                const index = pedidoTemp.findIndex(p => p.modelo == e.modelo)

                if (index >= 0) {
                    pedidoTemp[index].pendiente = pedidoTemp[index].pendiente - 1
                }
            }
        })


        // console.log(seleccionados)
        setSelectedDespacho(null)
        setPedido(pedidoTemp)
        setPosicionesSeleccionadas(seleccionados)
        setIsLoading(false)
        setPickeados([])
    }

    const addOrDeleteFromSelected = (row) => {
        setIsLoading(true)
        const exists = posicionesSeleccionadas?.filter(pos => pos?.ubicacion?.id == row?.ubicacion?.id)
        const pedidoTemp = pedido
        const index = pedidoTemp.findIndex(p => p.modelo == row.modelo)
        if (exists?.length > 0) {
            //LO QUITO
            const temp = posicionesSeleccionadas?.filter(pos => pos?.ubicacion?.id != row?.ubicacion?.id)
            setPosicionesSeleccionadas(temp)


            if (index >= 0) {
                pedidoTemp[index].pendiente = pedidoTemp[index].pendiente + 1
            }

        } else {
            //LO AGREGO
            setPosicionesSeleccionadas((prev) => [...prev, row])
            if (index >= 0) {
                pedidoTemp[index].pendiente = pedidoTemp[index].pendiente - 1
            }
        }
        setPedido(pedidoTemp)

        setIsLoading(false)
    }

    const reset = () => {
        setPosicionesSeleccionadas([])
        setPedido([])
        setStock([])
        setEventFile(null)
        setRun(null)
        setValue("run", null)
        setSelectedDespacho(null)
        setPickeados(null)
        if (eventFile) {
            eventFile.target.value = null
        }
    }

    const deleteFromPedido = (modelo) => {
        const newPedidos = pedido?.filter(p => p.modelo != modelo)
        setPedido(newPedidos)

        const tempPosiciones = posicionesSeleccionadas?.filter(p => p.modelo != modelo)
        setPosicionesSeleccionadas(tempPosiciones)
    }

    const openNotification = (error = false, message = '', placement) => {
        if (error) {
            api.error({
                message: `Despacho`,
                description: message,
                placement,
            });
        } else {
            api.success({
                message: `Despacho`,
                description: message,
                placement,
            });
        }
    };

    const savePedidoDespacho = async () => {

        if (posicionesSeleccionadas?.length == 0) {
            return
        }

        const data = await guardarDespacho({ run: run, pedido: pedido, seleccionados: posicionesSeleccionadas, id: selectedDespacho })
        openNotification(data?.error, data?.error ? data?.message : 'Despacho grabado correctamente', 'topRight')

        if (!data?.error) {
            handlePrint()

            reset()
        }
    }

    const handleFileUpload = () => {

        const file = eventFile.target.files[0]
        const reader = new FileReader();

        reader.onload = (event) => {
            const workbook = XLSX.read(event.target.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const p = XLSX.utils.sheet_to_row_object_array(sheet, { header: 1 })

            // const dataParse = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            let posByRun = 0;
            if (run == 1) {
                posByRun = 7
            } else if (run == 2) {
                posByRun = 8
            } else if (run == 3) {
                posByRun = 9
            }

            // console.log(p)


            const pedidoTemp = []
            p?.forEach((d, idx) => {
                // console.log(d)
                if (idx >= 0) {
                    if (parseInt(d[posByRun]) > 0 && d[2] != undefined && d[2] == d[3]) {
                        // if (parseInt(d?.[run]) > 0 && d?.__EMPTY_1 != undefined && d?.__EMPTY_1 == d?.SD) {
                        let lote = parseInt(d[5])
                        // let lote = parseInt(d?.lote)
                        // console.log(lote)
                        if (lote == 0) {
                            lote = 10
                        }

                        pedidoTemp.push({
                            modelo: d[2],
                            cantidad: d[posByRun] / lote,
                            pendiente: d[posByRun] / lote,
                        })
                    }

                    // if (parseInt(d?.[run]) > 0 && d?.__EMPTY_1 != undefined && d?.__EMPTY_1 == d?.SD) {
                    //     let lote = parseInt(d?.lote)
                    //     if (lote == 0) {
                    //         lote = 10
                    //     }

                    //     pedidoTemp.push({
                    //         modelo: d?.__EMPTY_1,
                    //         cantidad: d?.[run] / lote,
                    //         pendiente: d?.[run] / lote,
                    //     })
                    // }
                }
            })


            setPedido(pedidoTemp)
        };

        reader.readAsBinaryString(file);
    };

    const modifyQtyPedido = (modelo, esSuma = false) => {
        const tmp = pedido
        const index = tmp.findIndex(t => t.modelo == modelo)
        const cantidad = tmp[index].cantidad

        if (!esSuma) {
            tmp[index].cantidad = cantidad - 1
            tmp[index].pendiente = tmp[index].pendiente - 1
            if (tmp[index].cantidad <= 0) {
                deleteFromPedido(modelo)
                return
            }
        } else {
            tmp[index].cantidad = cantidad + 1
            tmp[index].pendiente = tmp[index].pendiente + 1

        }

        setPedido([...tmp])
    }

    const handlePrint = useReactToPrint({ content: () => componentRef?.current, });

    const fetchDespachoById = async () => {

        setIsLoading(true)
        const data = await fetchDespacho(selectedDespacho)

        const tmpPedido = []
        const seleccionados = []
        const pick = []

        if (!data?.error) {
            setRun(data?.data?.run)
            setValue("run", data?.data?.run)
            data?.data?.pedido?.forEach(i => {
                tmpPedido.push({
                    modelo: i?.modelo,
                    cantidad: parseInt(i.pedido),
                    pendiente: parseInt(i.pendiente)
                })
            })

            data?.data?.items?.forEach(i => {
                seleccionados.push({
                    modelo: i.modelo,
                    deposito: i.deposito_id,
                    kanban: i.kanban,
                    ubicacion: i.ubicacion
                })

                if (i?.pickeado == 1) {
                    pick.push({
                        modelo: i.modelo
                    })
                }
            })
        }

        const dataStock = await consultaModelosDespacho(tmpPedido, true)
        // console.log(dataStock?.data?.racks?.filter(p => p.modelo == 'SFMR'))
        setPickeados(pick)
        setPosicionesSeleccionadas(seleccionados)
        setStock(dataStock?.data)
        setPedido(tmpPedido)
        setIsLoading(false)

    }

    useEffect(() => {
        if (selectedDespacho) {
            fetchDespachoById()
        }
    }, [selectedDespacho])

    return (
        <div className='flex flex-col'>
            {contextHolder}
            <ModalSelectEditPedido setSelectedDespacho={setSelectedDespacho} setIsVisible={setIsVisibleModal} isVisible={isVisibleModal} />

            <div className='flex justify-between items-center border-gray-300 pb-1 border-b'>
                <div className='flex items-center gap-10 w-full'>
                    <div className="flex items-start gap-0 flex-col bg-gray-300 rounded-lg pr-3">
                        <input type="file" onChange={(e) => setEventFile(e)} />
                    </div>

                    <SelectUseForm
                        label=""
                        name="run"
                        size="small"
                        register={register}
                        errors={errors}
                        className="w-full pt-2"
                        onSelect={(val) => setRun(val)}
                        search={true}
                        control={control}
                        options={[
                            { value: 1, label: 'RUN 1' },
                            { value: 2, label: 'RUN 2' },
                            { value: 3, label: 'RUN 3' },
                        ]}
                    />

                    <button onClick={() => handleFileUpload()} disabled={!eventFile || !run} className={`text-sm p-1 bg-sky-400 disabled:bg-opacity-40 disabled:cursor-not-allowed w-full`}>Cargar pedido</button>
                    <button onClick={() => setIsVisibleModal(true)} className={`bg-gray-300 text-sm p-1 disabled:bg-opacity-40 disabled:cursor-not-allowed w-full`}>Editar pedido</button>

                    <div className="flex items-end justify-end gap-4">
                        {selectedDespacho &&
                            <button disabled={posicionesSeleccionadas?.length == 0} className="text-sm p-1 bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => handlePrint()}>Reimprimir</button>
                        }
                        <button disabled={posicionesSeleccionadas?.length == 0} className="text-sm py-1 px-3 bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => reset()}>Cancelar</button>
                        <button disabled={posicionesSeleccionadas?.length == 0} className="text-sm py-1 px-3 bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => savePedidoDespacho()}>Confirmar</button>
                    </div>
                </div>

            </div>

            <div className='flex items-center gap-2'>
                <SelectUseForm
                    label="Modelo"
                    size="small"
                    name="modelo"
                    classNameLabel="!mt-1"
                    placeholder="Seleccione un modelo"
                    register={register}
                    errors={errors}
                    rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full"
                    onSelect={() => setTimeout(() => {
                        setFocus("cantidad")
                    }, 50)}
                    loading={isLoadingModels}
                    search={true}
                    control={control}
                    options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                />

                <InputUseForm
                    control={control}
                    type="number"
                    // size="small"
                    label="Cantidad"
                    rules={{ required: "Debe ingresar la cantidad" }}
                    name="cantidad"
                    className="w-full "
                    register={register}
                    size="small"
                    classNameLabel="!mt-0 !mb-0"
                    classNameInput="!h-6"
                    errors={errors}
                    placeholder="Cantidad"
                    onKeyPress={(e) => {
                        if (e.key == 'Enter') {
                            handleSubmit(agregarModeloAPedido)()
                        }
                    }}
                />

                <button className='bg-green-500 w-[30%] mt-4 py-1' onClick={handleSubmit(agregarModeloAPedido)}>Agregar {`>`}</button>
            </div>

            {/* <button onClick={() => handlePrint()}>IMPRIMIR</button> */}
            {/* <div ref={componentRef} className="hidden w-full  p-4 print:flex flex-col justify-between h-screen">
                <div className="flex flex-col h-full ">
                    <div className="flex items-end w-full mb-2 p-2 justify-between border-gray-300 border">
                        <span className="font-semibold text-md">HOJA DE PREPARACIÓN</span>
                        <span className="font-semibold text-md">FECHA: 06/06/2024</span>
                    </div>
                    <span className="block text-center font-bold text-5xl border-gray-300 border pb-2">RUN {run}</span>

                    <div className="flex items-start h-full mt-2">
                        <div className="w-full border-r border-gray-300 h-full">
                            <span className="text-3xl font-bold text-black border-b border-gray-300 py-2 block w-full text-center">RETIRAR DE DOLLYS</span>

                            <div className="flex flex-col items-start gap-1 mt-2 p-1">
                                {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.DOLLYS)?.map((i, idx) => (
                                    <span className="font-semibold text-base border-b border-gray-300 w-full block">{i.modelo} - {i.kanban.codigo}</span>
                                ))}
                            </div>
                        </div>

                        <div className="w-full">
                            <span className="text-3xl font-bold text-black border-b border-gray-300 py-2 block w-full text-center">RETIRAR DE CAJA</span>

                            <div className="flex flex-col items-start gap-2 mt-2 p-2">
                                {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.RACKS)?.map((i, idx) => (
                                    <span className="font-semibold text-base border-b border-gray-300 w-full block">{i.modelo} - {i.kanban.codigo} - POS : {i?.ubicacion?.nombre}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div> */}

            <PrintDespacho
                componentRef={componentRef}
                run={run}
                posicionesSeleccionadas={posicionesSeleccionadas}
            />

            <div className='flex items-start gap-2'>
                {/* <div className='flex flex-col gap-1 w-[15%] px-1'>
                    {pedido?.length > 0 && <button onClick={() => consultaDisponibilidad()} className="w-full text-xs bg-cyan-600 text-white">Consultar disponibilidad</button>}
                    {pedido?.map((p, idx) => (
                        <div key={idx} className='font-semibold border-b text-2xl flex items-center gap-2'><button onClick={() => deleteFromPedido(p.modelo)} className="text-base font-bold text-red-500 p-0">X</button><span>{p.modelo} x {p.cantidad}</span> </div>
                    ))}
                </div> */}

                <div className="w-full h-full ">
                    {pedido?.length > 0 && <button disabled={isLoading} onClick={() => consultaDisponibilidad()} className="w-full my-2 text-xs bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white">Seleccionar kanbans</button>}
                    {isLoading && <div className="flex items-center justify-center"><Loader fontSize={50} /></div>}

                    {!isLoading &&
                        <div className="flex items-start ">

                            <div className="w-full flex items-start flex-col">
                                {pedido?.map((p, idx) => (
                                    <div key={`p${idx}`} className={`${p?.pendiente > 0 && 'bg-red-100'} w-full p-1 flex items-center justify-between gap-4 border-b border-gray-400`}>
                                        <div className="flex items-center gap-2">
                                            <div className="border-gray-400 border-r w-[210px] flex items-center gap-4 pr-2">
                                                <div className="flex items-center gap-2 w-[120px]">
                                                    <button onClick={() => deleteFromPedido(p.modelo)} className="bg-transparent text-base font-bold text-red-500 p-0">X</button>
                                                    <span className="text-base font-semibold ">{p.modelo} x {p.cantidad}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => modifyQtyPedido(p?.modelo)} className="p-0 px-2 hover:opacity-80 bg-red-400 rounded-md font-bold text-base">-</button>
                                                    <button onClick={() => modifyQtyPedido(p?.modelo, true)} className="p-0 px-1 hover:opacity-80 bg-green-500 rounded-md font-bold text-base">+</button>
                                                </div>
                                            </div>

                                            <div className="flex items-start flex-wrap gap-2 w-full">

                                                {stock?.meses?.filter(o => o.modelo == p?.modelo)?.map((m, idx) => (
                                                    m?.items?.map((i, idxx) => {
                                                        return <Dropdown
                                                            className={`cursor-pointer ${posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.RACKS && pos?.modelo == p.modelo && pos?.kanban?.fecha?.indexOf(i?.key) >= 0)?.length > 0 && 'bg-orange-500'}`}
                                                            key={`drop_${idxx}`}
                                                            dropdownRender={(menu) => (
                                                                <div className="bg-white px-4 py-2 mt-[-3px] rounded-md border-black border">

                                                                    <Divider
                                                                        style={{
                                                                            margin: 0,
                                                                        }}
                                                                    />
                                                                    {stock?.racks?.filter(s => s?.modelo == p.modelo && s?.kanban?.fecha?.indexOf(i?.key) >= 0)?.slice(0, 15)?.map((r, idx) => {
                                                                        const seleccionado = posicionesSeleccionadas?.filter(pos => pos?.ubicacion?.id == r?.ubicacion?.id && pos?.deposito == depositos.RACKS)?.length > 0
                                                                        const fecha = new Date(r?.kanban?.fecha)
                                                                        return <Tooltip key={idx} title={r?.ubicacion?.nombre}>  <button onClick={() => addOrDeleteFromSelected(r)} className={`py-1 px-2 bg-yellow-200 text-xs ${seleccionado && 'border-2 border-black !bg-orange-500 '}`} >{getFullDay(fecha)}-{getFullMonth(fecha)}</button></Tooltip>
                                                                    })}
                                                                </div>
                                                            )}
                                                        >
                                                            <span className="bg-gray-300 px-2 py-1 rounded-md">{i?.name}</span>
                                                        </Dropdown>
                                                    })
                                                ))}

                                            </div>

                                            {/* <div className="w-full bg-red-500"></div> */}

                                            {/* <div className="flex items-center gap-1">
                                                {stock?.racks?.filter(s => s?.modelo == p.modelo)?.map((r, idx) => {
                                                    const seleccionado = posicionesSeleccionadas?.filter(pos => pos?.ubicacion?.id == r?.ubicacion?.id && pos?.deposito == depositos.RACKS)?.length > 0
                                                    const fecha = new Date(r?.kanban?.fecha)
                                                    return <Tooltip title={r?.ubicacion?.nombre}>  <button onClick={() => addOrDeleteFromSelected(r)} className={`py-1 px-2 bg-yellow-200 text-xs ${seleccionado && 'border-2 border-black !bg-orange-500 '}`} key={idx}>{getFullDay(fecha)}-{getFullMonth(fecha)}</button></Tooltip>
                                                })}
                                            </div> */}
                                        </div>


                                        <div className="flex items-center gap-2">
                                            {pickeados?.filter(s => s?.modelo == p.modelo)?.length > 0 && <span className="font-semibold text-sm bg-orange-300 px-2">PREPARADOS: {pickeados?.filter(s => s?.modelo == p.modelo)?.length}</span>}
                                            <Tag color="yellow-inverse" className="!text-black">DOLLYS / TEMP.: {posicionesSeleccionadas?.filter(u => u.modelo == p.modelo && u.deposito != depositos.RACKS)?.length}</Tag>
                                            {/* <span className="font-semibold text-sm bg-yellow-200 w-[170px] text-center px-2">DOLLYS / TEMP.: {posicionesSeleccionadas?.filter(u => u.modelo == p.modelo && u.deposito != depositos.RACKS)?.length} </span> */}
                                            {/* ({stock?.dollys?.filter(s => s?.modelo == p.modelo)?.length}) */}
                                            <Tag color={p.pendiente > 0 ? 'red-inverse' : 'green-inverse'} >PENDIENTES: {p.pendiente}</Tag>
                                            {/* <span className={`font-semibold text-sm px-2 ${p.pendiente > 0 ? 'bg-red-500' : 'bg-green-500'}`}>PEND: {p.pendiente}</span> */}
                                        </div>
                                    </div>
                                ))}

                                {/* <div className="!bg-red-500 w-20 h-10"></div> */}
                            </div>

                            {/* <div className="!bg-red-500 w-[50%] h-10"></div> */}

                        </div>
                    }


                </div>
            </div>
        </div>
    )
}
