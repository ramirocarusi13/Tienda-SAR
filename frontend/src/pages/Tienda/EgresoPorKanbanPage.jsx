import Loader from "@components/Loader";
import useCaptureScan from '@hooks/useCaptureScan';
import { useQuery } from '@tanstack/react-query';
import { Popconfirm, Tag } from 'antd';
import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import AutoDismissMessage from "../../components/AutoDismissMessage";
import ModalAutorizaUsuario from "../../components/ModalAutorizaUsuario";
import { finalizarPedidoTienda, getPedidosPendientes } from '../../services/TiendaService';
import { diferenciaTiempo, formatDateTime } from '../../utils/Utils';

const resuelveNombreLinea = (item) => {

    return item?.linea?.nombre || item?.linea?.codigo || `M${(item?.linea_id || "")}`

}

const PedidoCard = ({ pedido, setPedidoSeleccionado }) => {

    return <div className='border border-gray-400 py-2 flex flex-col rounded-md items-center relative pb-14'>
        <span className='text-xs'>#{pedido.id}</span>
        <span className='text-2xl font-semibold'>{resuelveNombreLinea(pedido)} - {pedido?.items[0]?.pieza?.parte?.modelo[0]?.nombre}</span>
        <div className="flex items-center w-full justify-center gap-1 border-b pb-1 mt-1">
            <Tag color='orange'>{pedido?.user?.email?.toUpperCase()}</Tag>
            <Tag color='blue'>Hace {diferenciaTiempo(pedido?.created_at)}</Tag>
            {pedido?.falla?.nombre && <Tag color='red'>{pedido?.falla?.nombre}</Tag>}
        </div>

        <span className='border-b w-full text-center text-sm'>{pedido?.items?.reduce((p, c) => p + parseInt(c.cantidad), 0)} piezas</span>
        <div className="w-full px-2 py-1 flex flex-wrap justify-center gap-1">
            {pedido?.items?.slice(0, 4)?.map((item, idx) => (
                <Tag key={`pi_${pedido.id}_${idx}`} color="default">{item?.cantidad} x {item?.pieza?.codigo}</Tag>
            ))}
            {pedido?.items?.length > 4 && <Tag color="default">+{pedido.items.length - 4}</Tag>}
        </div>
        <button onClick={() => setPedidoSeleccionado(pedido)} className='w-[95%] mb-2 hover:opacity-70 text-sm bg-emerald-600 text-white mt-2 absolute bottom-0'>PREPARAR</button>
    </div>
}

export default function EgresoPorKanbanPage() {
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
    const [items, setItems] = useState([])
    const [status, setStatus] = useState({ message: null, error: false, rand: null })
    const [userLinea, setUserLinea] = useState(null)
    const [isVisibleModalUser, setIsVisibleModalUser] = useState(false)
    const { onKeyDown, finalText } = useCaptureScan()

    const refDiv = useRef()

    const fetchData = async () => {
        const data = await getPedidosPendientes()

        return {
            items: data?.data,
            fecha: new Date()
        }
    }

    const onScan = (scan) => {

        const itemsTemp = items
        const indexExiste = itemsTemp?.findIndex(i => i.qr == scan?.replaceAll("]", "|") || i.qr == scan)

        const rnd = Math.random();

        if (indexExiste >= 0) {

            const itemSeleccionado = itemsTemp[indexExiste]
            if (itemSeleccionado?.pendientes > 0) {
                itemsTemp[indexExiste].pendientes = itemsTemp[indexExiste].pendientes - 1

                setItems(itemsTemp)
                setStatus({ error: false, message: 'Escaneado correctamente', rand: rnd })

            } else {
                setStatus({ error: true, message: 'Ya se escanearon todos los items del código ' + itemSeleccionado?.pieza?.codigo, rand: rnd })
            }
        } else {
            setStatus({ error: true, message: `El item escaneado no fue solicitado`, rand: rnd })
        }

        refDiv?.current?.focus()
    }

    const reiniciarEscaneos = (id) => {
        const itemsTemp = items
        const indexExiste = itemsTemp?.findIndex(i => i.id == id)

        if (indexExiste >= 0) {
            itemsTemp[indexExiste].pendientes = parseInt(itemsTemp[indexExiste].cantidad)
        }

        setItems([...itemsTemp])
        setStatus({ error: false, message: null })
        refDiv?.current?.focus()

    }

    useEffect(() => {
        if (finalText) {
            setStatus({ error: false, message: null })
            onScan(finalText)
        }
    }, [finalText])

    useEffect(() => {
        if (pedidoSeleccionado) {
            setStatus({ error: false, message: null })
            setItems(pedidoSeleccionado?.items?.map(i => {
                return { ...i, pendientes: parseInt(i?.cantidad) }
            }))

            refDiv.current?.focus()
        } else {
            query?.refetch()
        }
    }, [pedidoSeleccionado])

    useEffect(() => {
        if (userLinea) {
            // console.log("U", userLinea)
            if (userLinea?.id == pedidoSeleccionado?.user_id) {
                setIsVisibleModalUser(false)
                confirmarSalida()
            } else {
                setIsVisibleModalUser(false)
                const rnd = Math.random();

                setStatus({ error: true, message: 'El código escaneado no corresponde con el del solicitante', rand: rnd })
            }
        }
    }, [userLinea])

    const confirmarSalida = async () => {
        //PIDO PRIMERO EL ESCANEO DEL TL QUE LO PIDIO
        const data = await finalizarPedidoTienda(pedidoSeleccionado)

        if (!data?.error) {
            setPedidoSeleccionado(null)
        }
    }

    const query = useQuery({ queryKey: [`pedidos_tienda`], queryFn: fetchData, staleTime: 1000, refetchInterval: 120000 })

    if (!pedidoSeleccionado) {
        return (
            <div className="w-full ">
                <div className="flex items-center flex-col gap-1 mb-2 border-b pb-1 text-gray-600">
                    <span className='text-2xl block text-center font-semibold'>PEDIDOS PENDIENTES</span>
                    <button onClick={() => query?.refetch()} className="px-4 bg-green-600 text-xs text-white">Actualizar listado de pedidos pendientes</button>
                    {query?.data?.fecha && <span className='text-xs block text-center '>Actualizado el {formatDateTime(query?.data?.fecha)}</span>}
                </div>

                {(query?.isLoading || query?.isFetching) &&
                    <div className="w-full h-[70vh] flex items-center justify-center">
                        <Loader fontSize={100} />
                    </div>
                }

                {(!query?.isLoading && query?.data?.items?.length == 0) &&
                    <div className="flex items-center justify-center w-full">
                        <span className="text-center text-2xl w-full">NO HAY PEDIDOS PENDIENTES</span>
                    </div>
                }

                {(!query?.isLoading && !query?.isFetching) &&
                    <div className='grid grid-cols-4 gap-2 w-full'>
                        {query?.data?.items?.map((pedido, idx) => {
                            return <PedidoCard key={`p_${idx}`} pedido={pedido} setPedidoSeleccionado={setPedidoSeleccionado} />
                        })}
                    </div>
                }
            </div>
        )
    }

    if (pedidoSeleccionado) {
        return (
            <div autoFocus ref={refDiv} tabIndex="0" onKeyDown={onKeyDown} className="w-full h-[88vh] relative ">
                <ModalAutorizaUsuario
                    userVigente={userLinea}
                    setUserVigente={setUserLinea}
                    isVisible={isVisibleModalUser}
                    setIsVisble={setIsVisibleModalUser}
                    label="Escaneé la tarjeta del solicitante"
                />

                <div className="flex items-center justify-between w-full border-b">
                    <Popconfirm
                        onConfirm={() => setPedidoSeleccionado(null)}
                        title="Regresar"
                        description="¿Está seguro que desea regresar? Se perderán los datos escaneados y no se confirmará el pedido"
                        okButtonProps={{ className: 'bg-green-500' }}
                    >
                        <button className="font-bold w-20 bg-blue-400 flex items-center justify-center hover:opacity-70">
                            <MdOutlineArrowBackIos className="text-xl" />
                        </button>
                    </Popconfirm>

                    <span className='text-2xl block text-center mb-2  pb-1 font-semibold'>PEDIDO #{pedidoSeleccionado?.id} - LINEA M{pedidoSeleccionado?.linea_id} - {pedidoSeleccionado?.items[0]?.pieza?.parte?.modelo[0]?.nombre}{pedidoSeleccionado?.falla?.nombre ? ` - ${pedidoSeleccionado.falla.nombre}` : ''}</span>

                    <Popconfirm
                        onConfirm={() => setIsVisibleModalUser(true)}
                        title="Confirmar salida"
                        description="¿Está seguro que desea copnfirmar la salida de las piezas escaneadas?"
                        okButtonProps={{ className: 'bg-green-500' }}
                    >
                        <button
                            disabled={items.filter(i => i.pendientes > 0)?.length > 0}
                            className={`bg-orange-300 px-8 disabled:opacity-40 disabled:cursor-not-allowed`}
                        >
                            CONFIRMAR SALIDA
                        </button>
                    </Popconfirm>
                </div>

                <div className='grid grid-cols-3 gap-2 mt-4 items-center text-center'>
                    {items?.map((item, idx) => (
                        <div key={idx} className={`border p-2 flex flex-col rounded-xl items-center justify-center ${item?.pendientes == 0 ? 'bg-green-500' : (parseInt(item?.cantidad) > item?.pendientes ? 'bg-blue-300' : 'bg-orange-300')}`}>
                            <span className="text-xl font-semibold pt-2 pb-2">
                                {item.pieza.codigo} - {item?.pieza?.material_pieza?.nombre}
                            </span>
                            <Tag color={item?.pendientes > 0 ? 'orange-inverse' : 'green'} key={idx} className="text-2xl font-semibold">
                                PENDIENTES : {item?.pendientes}
                            </Tag>
                            <Popconfirm
                                onConfirm={() => reiniciarEscaneos(item?.id)}
                                title="Reiniciar escaneos"
                                description="¿Está seguro que desea reiniciar los escaneos de está pieza? No se podrán recuperar"
                                okButtonProps={{ className: 'bg-green-500' }}
                                placement="bottom"
                            >
                                <button className="mt-2 text-xs py-1 hover:opacity-60">REINICIAR ESCANEOS</button>
                            </Popconfirm>
                            <button onClick={() => onScan(item?.qr)} className="bg-gray-500 text-white mt-2 text-xs py-1 hover:opacity-60">SIMULAR ESCANEO</button>
                        </div>
                    ))}
                </div>

                {(status?.message) &&
                    <AutoDismissMessage
                        message={status?.message}
                        type={status?.error ? 'error' : 'success'}
                        duration={5000}
                        random={status?.rand}
                    />
                }
            </div>
        )
    }
}


// import InputUseForm from "@components/InputUseForm";
// import Loader from "@components/Loader";
// import useTienda from "@hooks/useTienda";
// import { notification } from "antd";
// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";

// const layout2 = [
//     {
//         IZQ: 'SFTS',
//         CENTER: 'REPO',
//         DER: ''
//     },
//     {
//         IZQ: 'STL1',
//         CENTER: 'SFLE',
//         DER: 'SSLN'
//     },
//     {
//         IZQ: 'QUEEN CORDS',
//         CENTER: 'REPO',
//         DER: 'PAD STES-STSS'
//     },
//     {
//         IZQ: 'SFTS',
//         CENTER: '',
//         DER: 'PAD SUMS-SUBS'
//     },
//     {
//         IZQ: 'SFHG',
//         CENTER: '',
//         DER: 'SUMS'
//     },
//     {
//         IZQ: 'SFMR-SFKQ-SFKN',
//         CENTER: '',
//         CENTER1: 'STES',
//         CENTER2: 'STL1',
//         DER: 'SUMS'
//     },
//     {
//         IZQ: 'SFMR-SFKQ-SFKN',
//         CENTER: '',
//         CENTER1: 'STHS',
//         CENTER2: 'STL1',
//         DER: 'SUKS'
//     },
//     {
//         IZQ: 'SFJJ',
//         CENTER: '',
//         DER: 'SUJS'
//     },
//     {
//         IZQ: 'SFPB-SFPC',
//         CENTER: '',
//         DER: 'SSFN'
//     },
//     {
//         IZQ: 'SFPC',
//         CENTER: 'SFBN',
//         DER: 'STP1'
//     },
//     {
//         IZQ: 'SFPA',
//         CENTER: '',
//         CENTER1: 'SFTS-SFEP',
//         CENTER2: 'STES',
//         DER: 'GAZOO R.'
//     },
//     {
//         IZQ: 'SFLA',
//         CENTER: '',
//         CENTER1: 'SFKQ-SFNG-SUKS-SFNJ',
//         CENTER2: 'SUMS',
//         DER: 'SUBS'
//     },
//     {
//         IZQ: 'SFLB-SFLC',
//         CENTER: '',
//         CENTER1: 'SFEJ',
//         CENTER2: 'SFBN',
//         DER: 'SSBN'
//     }
// ]

// const layout = [
//     { modelos: 'SFTS', posicion: 'A1' },
//     { modelos: 'STL1', posicion: 'A2' },
//     { modelos: '', posicion: 'A3' },
//     { modelos: 'SFTS', posicion: 'A4' },
//     { modelos: 'SFHG', posicion: 'A5' },
//     { modelos: 'SFMR-SFKQ-SFKN', posicion: 'A6' },
//     { modelos: 'SFMR-SFKQ-SFKN', posicion: 'A7' },
//     { modelos: 'SFJJ', posicion: 'A8' },
//     { modelos: 'SFPB-SFPC', posicion: 'A9' },
//     { modelos: 'SFPC', posicion: 'A10' },
//     { modelos: 'SFPA', posicion: 'A11' },
//     { modelos: 'SFLA', posicion: 'A12' },
//     { modelos: 'SFLB-SFLC', posicion: 'A13' },
//     { modelos: 'SSLN', posicion: 'B1' },
//     { modelos: 'STES-STSS', posicion: 'B2' },
//     { modelos: 'SUMS-SUBS', posicion: 'B3' },
//     { modelos: 'SUMS', posicion: 'B4' },
//     { modelos: 'SUMS', posicion: 'B5' },
//     { modelos: 'SUKS', posicion: 'B6' },
//     { modelos: 'SUJS', posicion: 'B7' },
//     { modelos: 'SSFN', posicion: 'B8' },
//     { modelos: 'STP1', posicion: 'B9' },
//     { modelos: '', posicion: 'B10' },
//     { modelos: 'SUBS', posicion: 'B11' },
//     { modelos: 'SSBN', posicion: 'B12' },
//     { modelos: 'SFLE', posicion: 'C1' },
//     { modelos: 'STES', posicion: 'C2' },
//     { modelos: 'STL1', posicion: 'C3' },
//     { modelos: 'STHS', posicion: 'C4' },
//     { modelos: 'STL1', posicion: 'C5' },
//     { modelos: 'SFBN', posicion: 'C6' },
//     { modelos: 'SFTS-SFEG-SFEP', posicion: 'C7' },
//     { modelos: 'STES-STSS', posicion: 'C8' },
//     { modelos: 'SFKQ-SFNG-SUKS-SFNJ', posicion: 'C9' },
//     { modelos: 'SUMS', posicion: 'C10' },
//     { modelos: 'SFEJ', posicion: 'C11' },
//     { modelos: 'SFBN', posicion: 'C12' },
// ]

// export default function EgresoPorKanbanPage() {

//     const { register, control, handleSubmit, formState: { errors }, setFocus, setValue, getValues } = useForm();
//     const [dataPedido, setDataPedido] = useState(null)
//     const { getDataFromPedido, isLoading, egresoTiendaPorPedido } = useTienda()
//     const [statusResponse, setStatusResponse] = useState(null)
//     const [pedido, setPedido] = useState(null)
//     // const [step, setStep] = useState(0)
//     const [api, contextHolder] = notification.useNotification();

//     const keyPressEnter = async (e) => {
//         if (e.key == 'Enter') {
//             const data = await getDataFromPedido(e.target.value, true)

//             if (data?.error) {
//                 setValue("kanban", null)
//                 setStatusResponse({ error: true, message: data?.message })
//                 return
//             }

//             setDataPedido(data?.data)

//             const tmp = []
//             data?.data?.items?.map(d => (
//                 tmp.push({
//                     cantidad: parseInt(d?.cantidad),
//                     codigo: d?.pieza?.codigo,
//                     escaneado: 0,
//                     barcode: `${data?.data?.kanban?.modelo?.nombre}]${d?.pieza?.codigo}]${d?.pieza?.parte?.lado?.lado}`
//                 })
//             ))

//             setPedido(tmp)
//             setStatusResponse(null)
//             setValue("kanban", null)
//             setTimeout(() => {
//                 setFocus("pieza")
//             }, [50])
//         }
//     }

//     const confirmarEgreso = async () => {
//         const data = await egresoTiendaPorPedido(dataPedido?.id)
//         if (data?.error) {
//             setStatusResponse(data?.message)
//             return
//         }

//         setPedido(null)
//         setDataPedido(null)
//         setStatusResponse(null)
//         setTimeout(() => { setFocus("kanban") }, [50])
//         api.success({
//             message: `Pedido`,
//             description: 'Pedido egresado correctamente',
//             placement: "topRight"
//         });
//     }

//     const verificaModeloEquivalencia = (modeloEscaneado, modelo) => {
//         let verificado = false;
//         const escaneado = modeloEscaneado.toUpperCase()

//         if (escaneado == modelo.toUpperCase()) {
//             verificado = true
//         }

//         if (!verificado) {
//             //Busco equivalencias
//             const modelos = layout?.filter(l => l?.modelos?.indexOf(modelo.toUpperCase()) >= 0)
//             modelos?.forEach(m => {
//                 if (m?.modelos?.indexOf(escaneado) >= 0) {
//                     verificado = true
//                 }
//             });
//         }

//         return verificado;
//     }

//     const verificaPiezaEquivalencia = (etiqueta, escaneado) => {
//         let res = null
//         //Busco equivalencias
//         let modelo = etiqueta[0].toUpperCase()

//         const modelos = layout?.filter(l => l?.modelos?.indexOf(modelo) >= 0)
//         modelos?.forEach(m => {
//             const mods = m?.modelos?.split("-")
//             mods.forEach(mod => {
//                 if (escaneado.toUpperCase() == `${mod.toUpperCase()}]${etiqueta[1].toUpperCase()}]${etiqueta[2].toUpperCase()}`) {
//                     res = `${dataPedido?.kanban?.modelo?.nombre}]${etiqueta[1]}]${etiqueta[2]}`
//                 }
//             })
//         });
//         return res;
//     }

//     const keyPressPieza = (e) => {
//         if (e.key == 'Enter') {
//             setStatusResponse(null)

//             let etiqueta = e.target.value.split("]")
//             if (etiqueta?.length < 2) {
//                 etiqueta = e.target.value.split("|")
//             }

//             if (!e.target.value || e.target.value == '') {
//                 setStatusResponse(null)
//                 return
//             }

//             if (!verificaModeloEquivalencia(etiqueta[0].toUpperCase(), dataPedido?.kanban?.modelo?.nombre.toUpperCase())) {
//                 // if (etiqueta[0].toUpperCase() != dataPedido?.kanban?.modelo?.nombre.toUpperCase()) {
//                 //LA ETIQUETA ESCANEADA NO CORRESPONDE AL MODELO DEL KANBAN
//                 setValue("pieza", null)
//                 setStatusResponse({ error: true, message: "LA PIEZA ESCANEADA NO CORRESPONDE AL MODELO DEL KANBAN" })
//                 return
//             }

//             const pieza = verificaPiezaEquivalencia(etiqueta, e.target.value)
//             // console.log(pieza)
//             if (!pieza) {
//                 setValue("pieza", null)
//                 setStatusResponse({ error: true, message: "LA PIEZA ESCANEADA NO FUE SOLICITADA" })
//                 return
//             }


//             const exists = pedido?.find(o => o.barcode.toUpperCase() == pieza.toUpperCase())
//             // console.log(exists)
//             // const exists = pedido?.find(o => o.barcode == e.target.value)
//             if (!exists) {
//                 setValue("pieza", null)
//                 //LA ETIQUETA CORRESPONDE AL MODELO DEL KANBAN PERO NO FUE SOLICITADA
//                 setStatusResponse({ error: true, message: "LA PIEZA ESCANEADA NO FUE SOLICITADA" })
//                 return
//             }

//             if (exists.cantidad == exists.escaneado) {
//                 setValue("pieza", null)
//                 //ALCANZO LA CANTIDAD SOLICITADA DE LA PIEZA
//                 setStatusResponse({ error: true, message: "ALCANZÓ LA CANTIDAD SOLICITADA PARA LA PIEZA" })
//                 return
//             }

//             exists.escaneado = exists.escaneado + 1

//             const temp = pedido?.filter(o => o.barcode.toUpperCase() != pieza.toUpperCase())
//             // const temp = pedido?.filter(o => o.barcode != e.target.value)

//             temp.push(exists)
//             setPedido(temp)

//             setValue("pieza", null)
//             setStatusResponse({ error: false, message: 'PIEZA CORRECTA' })

//         }
//     }

//     useEffect(() => {
//         setTimeout(() => setFocus("kanban"), [50])
//     }, [])

//     return (
//         <div>
//             {contextHolder}
//             {!pedido && <span className="text-2xl font-semibold block w-full text-center bg-lime-100 py-2">EGRESO DE TIENDA</span>}
//             <div className="flex items-center gap-2">
//                 <InputUseForm
//                     name="kanban"
//                     className="w-full mt-2"
//                     register={register}
//                     classNameInput={`!text-2xl !py-4 ${pedido && 'hidden'}`}
//                     errors={errors}
//                     placeholder="Nro Kanban"
//                     rules={{ required: "Ingrese el número de Kanban" }}
//                     onKeyPress={keyPressEnter}
//                 />
//             </div>

//             {!pedido && <span className="block w-full p-4 text-center font-semibold text-slate-400">ESCANEE EL KANBAN PARA COMENZAR</span>}
//             {isLoading && <div className="flex items-center justify-center"><Loader fontSize={100} /></div>}
//             {statusResponse && !pedido && !isLoading && <div className="text-4xl font-semibold px-2 py-6 text-center w-full bg-error my-2 text-white">{statusResponse.message?.toUpperCase()}</div>}

//             {pedido &&
//                 <div className="flex flex-col">
//                     <span className="font-semibold md:text-sm lg:text-sm block text-start py-0 px-0">SOLICITADO POR : {dataPedido?.user?.email?.toUpperCase()}</span>
//                     <div className="flex items-start gap-1 mt-0 mb-2 w-full">
//                         <span className="font-semibold md:text-xl lg:text-5xl block w-full text-center border bg-slate-400 py-2 px-2">MODELO : {dataPedido?.kanban?.modelo?.nombre}</span>
//                         <button className="bg-red-500 md:h-[45px] lg:h-[65px] text-xl flex justify-center items-center rounded-none text-white" onClick={() => {
//                             setPedido(null)
//                             setStatusResponse(null)
//                             // setStep(0)
//                             setTimeout(() => { setFocus("kanban") }, [50])
//                         }}>CANCELAR</button>
//                     </div>
//                 </div>
//             }

//             {/* {pedido && step == 0 &&
//                 <div className="gap-4 md:!mt-12 lg:!mt-0 w-full h-[calc(100vh-11rem)] flex items-center">
//                     <div className="w-full flex flex-col gap-1">
//                         {layout?.map((l, idx) => (
//                             <div className="flex md:gap-1 lg:gap-4" key={`a${idx}`} >
//                                 <div className={`${l?.IZQ?.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.IZQ && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.IZQ}</div>
//                                 {l?.CENTER1 && l?.CENTER2 ?
//                                     <div className="w-full flex items-center justify-center text-center">
//                                         <div className={`${l.CENTER1.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.CENTER1 && 'border-black border border-r-0'} flex items-center justify-center text-xs font-semibold  md:h-[30px] lg:h-[40px]`}>{l.CENTER1}</div>
//                                         <div className={`${l.CENTER2.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.CENTER2 && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.CENTER2}</div>
//                                     </div>
//                                     :
//                                     <div className={`${l.CENTER.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.CENTER && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.CENTER}</div>
//                                 }
//                                 <div className={`${l?.DER.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.DER && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.DER}</div>
//                             </div>
//                         ))}
//                     </div>

//                     <button onClick={() => setStep(1)} className="bg-green-500 !w-[30%] h-full flex flex-col items-center justify-center text-3xl gap-2">COMENZAR <FaArrowAltCircleRight className="text-9xl" /></button>
//                 </div>
//             } */}

//             {pedido &&
//                 <div className="flex flex-col items-start gap-2">
//                     <div className="flex gap-2 items-center justify-center w-full">
//                         <span className="font-semibold lg:text-3xl md:text-xl px-2 block">ESTANTERIA :</span>
//                         {layout?.map((i, idx) => {
//                             if (i?.modelos?.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1) {
//                                 return <span key={`pieza_${idx}`} className="bg-green-500 font-semibold lg:text-3xl md:text-xl px-2 block">{i.posicion}</span>
//                             }
//                         })}


//                     </div>
//                     {/* <div className="flex items-start gap-1 mt-0 w-full">
//                         <span className="font-semibold md:text-xl lg:text-5xl block w-full text-center border bg-slate-400 py-2 px-2">MODELO : {dataPedido?.kanban?.modelo?.nombre}</span>
//                         <button className="bg-red-500 md:h-[45px] lg:h-[65px] text-xl flex justify-center items-center rounded-none text-white" onClick={() => {
//                             setPedido(null)
//                             setStatusResponse(null)
//                             setTimeout(() => { setFocus("kanban") }, [50])
//                         }}>CANCELAR</button>
//                     </div> */}

//                     <div className="flex items-start w-full lg:gap-4 md:gap-2">

//                         {/* <div className="md:w-[90%] lg:w-[50%]  flex flex-col gap-1">
//                             {layout?.map((l, idx) => (
//                                 <div className="flex md:gap-1 lg:gap-4" key={`a${idx}`} >
//                                     <div className={`${l?.IZQ?.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.IZQ && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.IZQ}</div>
//                                     {l?.CENTER1 && l?.CENTER2 ?
//                                         <div className="w-full flex items-center justify-center text-center">
//                                             <div className={`${l.CENTER1.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.CENTER1 && 'border-black border border-r-0'} flex items-center justify-center text-xs font-semibold  md:h-[30px] lg:h-[40px]`}>{l.CENTER1}</div>
//                                             <div className={`${l.CENTER2.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.CENTER2 && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.CENTER2}</div>
//                                         </div>
//                                         :
//                                         <div className={`${l.CENTER.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.CENTER && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.CENTER}</div>
//                                     }
//                                     <div className={`${l?.DER.indexOf(dataPedido?.kanban?.modelo?.nombre) > -1 && 'bg-green-500'} w-full ${l.DER && 'border-black border'} flex items-center justify-center font-semibold text-xs md:h-[30px] lg:h-[40px]`}>{l.DER}</div>
//                                 </div>
//                             ))}
//                         </div> */}

//                         <div className="flex items-center w-full">

//                             <div className="flex flex-col items-start w-full mt-0">
//                                 <InputUseForm
//                                     name="pieza"
//                                     className="w-full mt-0 mb-0"
//                                     register={register}
//                                     classNameInput="lg:!text-2xl lg:!py-1 md:!text-xl md:!py-2"
//                                     errors={errors}
//                                     placeholder="Pieza"
//                                     onKeyPress={keyPressPieza}
//                                 />

//                                 {statusResponse && <div className={`lg:text-4xl md:text-xl font-semibold lg:px-2 md:px-1 lg:py-6 md:py-2 text-center w-full ${statusResponse?.error ? 'bg-error' : 'bg-green-500'} my-2 text-white`}>{statusResponse.message}</div>}

//                                 <div className="flex items-start w-full h-full gap-2 mt-1">
//                                     <div className="grid md:grid-cols-3 lg:grid-cols-3 w-full gap-1">
//                                         {pedido?.filter(p => p.escaneado != p.cantidad)?.map((p, idx) => (
//                                             <div key={idx} className={`flex items-center gap-0 w-full justify-between border flex-col border-black ${p.escaneado == p.cantidad ? 'bg-green-300' : (p.escaneado > 0 ? 'bg-yellow-400' : 'bg-orange-300')} `}>
//                                                 <div className="flex w-full items-center justify-between">
//                                                     <span className="md:text-xs lg:text-base font-semibold w-full block px-2">PIEZA: {p?.codigo}</span>
//                                                     <span className="md:text-xs lg:text-base font-semibold w-full block px-2 text-end">PEDIDO: {p.cantidad}</span>
//                                                 </div>

//                                                 <div className="flex w-full items-center justify-between">
//                                                     <span className="md:text-xs lg:text-base font-semibold w-full block px-2">ESCANEADO: {p.escaneado}</span>
//                                                     <span className="md:text-xs lg:text-base font-semibold w-full block px-2 text-end">RESTA: {p.cantidad - p.escaneado}</span>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>

//                                     <div className="md:w-[30%] lg:w-[40%] relative h-full min-h-[calc(90vh-15rem)]">
//                                         <div className="grid grid-cols-1 w-full gap-1 h-full">

//                                             {pedido?.filter(p => p.escaneado == p.cantidad)?.map((p, idx) => (
//                                                 <div key={idx} className={`flex items-center w-full justify-between border flex-col border-black ${p.escaneado == p.cantidad ? 'bg-green-300' : (p.escaneado > 0 ? 'bg-orange-400' : 'bg-red-300')} `}>
//                                                     <div className="flex w-full items-center justify-between">
//                                                         <span className="md:text-xs lg:text-base font-semibold w-full block px-2">PIEZA: {p?.codigo}</span>
//                                                         <span className="md:text-xs lg:text-base font-semibold w-full block px-2 text-end">PEDIDO: {p.cantidad}</span>
//                                                     </div>

//                                                     {/* <div className="flex w-full items-center justify-between">
//                                                     <span className="md:text-xs lg:text-base font-semibold w-full block px-2">ESCANEADO: {p.escaneado}</span>
//                                                     <span className="md:text-xs lg:text-base font-semibold w-full block px-2 text-end">RESTA: {p.cantidad - p.escaneado}</span>
//                                                 </div> */}
//                                                 </div>
//                                             ))}
//                                         </div>
//                                         <button
//                                             onClick={() => confirmarEgreso()} disabled={pedido.reduce((prev, cur) => prev + (cur.cantidad - cur.escaneado), 0) > 0}
//                                             className="bg-green-600  w-full mt-3 lg:text-xl disabled:opacity-50">
//                                             CONFIRMAR EGRESO</button>
//                                     </div>
//                                 </div>

//                                 {/* <div className="flex items-start w-full gap-2">
//                                     <div className="flex flex-col items-start w-full gap-1">
//                                         {pedido?.map((p, idx) => (
//                                             <div key={idx} className={`flex items-center justify-between w-full border border-black ${p.escaneado == p.cantidad ? 'bg-green-300' : (p.escaneado > 0 ? 'bg-orange-400' : 'bg-red-400')} `}>
//                                                 <span className="md:text-xs lg:text-xl font-semibold w-full block px-2">PIEZA: {p?.codigo}</span>
//                                                 <span className="md:text-xs lg:text-xl font-semibold w-full block  text-center">PEDIDO: {p.cantidad}</span>
//                                                 <span className="md:text-xs lg:text-xl font-semibold w-full block px-4 text-end">ESCANEADO: {p.escaneado}</span>
//                                                 <span className="md:text-xs lg:text-xl font-semibold w-full block px-4 text-end">RESTA: {p.cantidad - p.escaneado}</span>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div> */}

//                                 {/* <button onClick={() => confirmarEgreso()} disabled={pedido.reduce((prev, cur) => prev + (cur.cantidad - cur.escaneado), 0) > 0} className="bg-green-600 w-full mt-3 lg:text-xl disabled:opacity-50">CONFIRMAR EGRESO</button> */}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             }
//         </div>
//     )
// }
