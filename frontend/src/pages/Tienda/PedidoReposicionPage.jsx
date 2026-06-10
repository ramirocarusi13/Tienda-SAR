import InputUseForm from "@components/InputUseForm";
import Loader from "@components/Loader";
import ModalLoading from "@components/ModalLoading";
import useFallas from "@hooks/useFallas";
import useTienda from "@hooks/useTienda";
import { validaUsuarioPorCodigoValidacion } from "@services/AuthService";
import { Modal, notification } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { TbArrowBigLeftFilled } from "react-icons/tb";
import { getModelosLinea } from "../../services/ModelService";
const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

const lineas = [
    { nombre: 'M1', id: 1 },
    { nombre: 'M2', id: 2 },
    { nombre: 'M3', id: 3 },
    { nombre: 'M4', id: 4 },
    { nombre: 'M5', id: 5 },
    { nombre: 'M6', id: 6 },
    { nombre: 'M7', id: 7 },
    { nombre: 'M8', id: 8 },
    { nombre: 'M9', id: 9 },
    { nombre: 'M10', id: 10 },
    { nombre: 'M11', id: 11 },
]

const toInt = (value) => parseInt(value || 0, 10)

export default function PedidoReposicionPage() {
    const { register, formState: { errors }, setFocus } = useForm();
    const { response: fallas } = useFallas(true, true)
    const { isLoading: isLoadingTienda, grabarPedido } = useTienda(false)

    const [selectedPiezas, setSelectedPiezas] = useState([])

    const [isVisible, setIsVisible] = useState(false)
    const [defecto, setDefecto] = useState(null)
    const [userVigente, setUserVigente] = useState(null)
    const [userError, setUserError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingModelos, setIsLoadingModelos] = useState(false)
    const [lineaActiva, setLineaActiva] = useState(null)
    const [modelos, setModelos] = useState([])
    const [modeloActivo, setModeloActivo] = useState(null)

    const [funda, setFunda] = useState(null)
    const [api, contextHolder] = notification.useNotification();

    const getPiezasFunda = () => {
        if (!modeloActivo || !funda) {
            return []
        }

        return modeloActivo?.partes?.find(p => p.codigo == funda.codigo)?.piezas || []
    }

    const findPieza = (piezaId) => {
        if (!modeloActivo) {
            return null
        }

        for (const parte of (modeloActivo?.partes || [])) {
            const pieza = parte?.piezas?.find(p => p.id == piezaId)

            if (pieza) {
                return pieza
            }
        }

        return null
    }

    const getCantidadSeleccionada = (piezaId) => {
        return toInt(selectedPiezas?.find(p => p.id == piezaId)?.cantidad)
    }

    const getEstadoPieza = (pieza) => {
        if (!pieza) {
            return {
                stock: 0,
                pendiente: 0,
                seleccionado: 0,
                proyectado: 0,
                puntoPedido: 0,
                maximo: 0,
                reponer: 0,
                disparaCorte: false,
                enCorte: false
            }
        }

        const seleccionado = getCantidadSeleccionada(pieza.id)
        const stock = toInt(pieza?.stock_tienda ?? pieza?.stock_tienda_sum_cantidad)
        const pendiente = toInt(pieza?.pedido_pendiente)
        const puntoPedido = toInt(pieza?.minimo)
        const maximo = toInt(pieza?.maximo)
        const proyectado = stock - pendiente - seleccionado
        const reponer = Math.max(0, maximo - proyectado)
        const enCorte = Boolean(pieza?.en_corte || pieza?.kanban_reemplazo?.abierto)
        const disparaCorte = !enCorte && puntoPedido > 0 && proyectado <= puntoPedido && reponer > 0

        return {
            stock,
            pendiente,
            seleccionado,
            proyectado,
            puntoPedido,
            maximo,
            reponer,
            disparaCorte,
            enCorte
        }
    }

    const getEstadoClass = (estado) => {
        if (estado.enCorte) {
            return 'bg-blue-100 border-blue-500'
        }

        if (estado.disparaCorte) {
            return 'bg-red-100 border-red-500'
        }

        if (estado.maximo > 0 && estado.proyectado >= estado.maximo) {
            return 'bg-green-100 border-green-500'
        }

        return 'bg-orange-100 border-orange-300'
    }

    const removePieza = (id) => {
        const pPiezas = selectedPiezas.filter(p => p.id != id)
        setSelectedPiezas(pPiezas)
    }

    const handleSumaAll = () => {
        const piezasFunda = getPiezasFunda()
        const response = [...selectedPiezas]
        const finish = selectedPiezas.filter(sp => !piezasFunda.some(p => p.id == sp.id))

        piezasFunda?.map(p => {
            const piezaEx = response?.filter(pi => pi.id == p.id)

            if (piezaEx.length > 0) {
                piezaEx[0].cantidad = 1 + parseInt(piezaEx[0].cantidad)
                finish.push(piezaEx[0])
            } else {
                finish.push({ 'codigo': p.codigo, 'cantidad': 1, id: p.id })
            }
        })

        setSelectedPiezas(finish)
    }

    const handleSumaPieza = (pieza) => {
        const codigo = pieza?.codigo
        const id = pieza?.id

        const piezaEx = selectedPiezas?.filter(p => p.id == id)
        const pPiezas = selectedPiezas?.filter(p => p.id != id)

        if (piezaEx.length > 0) {
            piezaEx[0].cantidad = 1 + parseInt(piezaEx[0].cantidad)
            pPiezas.push(piezaEx[0])
        } else {
            pPiezas.push({ 'codigo': codigo, 'cantidad': 1, id: id })

        }

        setSelectedPiezas(pPiezas)
    }

    const handleCancel = () => {
        setFunda(null)
        setSelectedPiezas([])
        setDefecto(null)
        setUserVigente(null)
        setLineaActiva(null)
        setModeloActivo(null)
        setModelos([])
        setTimeout(() => { setFocus("cod_autorizacion") }, 50)
    }

    const handleSavePedido = async () => {

        const payload = {
            user: userVigente?.id,
            falla: defecto,
            piezas: selectedPiezas,
            linea: lineaActiva,
            modelo: modeloActivo
        }

        setIsVisible(false)

        const data = await grabarPedido(payload, true)

        if (!data?.error) {
            const reposiciones = toInt(data?.data?.reposiciones)
            handleCancel()
            openNotification(false, reposiciones > 0 ? `Pedido guardado. Se envio ${reposiciones} orden(es) a corte.` : "Pedido guardado correctamente!")
        } else {
            openNotification(true, data?.message)
        }
    }

    useEffect(() => {
        if (!userVigente) {
            setTimeout(() => {
                setFocus("cod_autorizacion")
            }, [50])
        }
    }, [userVigente])

    const fetchModelos = useCallback(async (linea) => {
        setIsLoadingModelos(true)
        // if (res) {
        // const linea = JSON.parse(res);
        const data = await getModelosLinea(linea);
        setModelos(data?.data);
        setIsLoadingModelos(false)
        // }
    }, []);

    const openNotification = (error = false, message = '', placement) => {
        if (error) {
            api.error({
                message: `Pedido`,
                description: message,
                placement,
            });
        } else {
            api.success({
                message: `Pedido`,
                description: message,
                placement,
            });
        }
    };

    useEffect(() => {
        if (lineaActiva) {
            fetchModelos(lineaActiva)
        }
    }, [lineaActiva])

    return (
        <div className="h-screen flex items-start justify-center relative w-full">
            {contextHolder}
            {userVigente &&
                <div className="absolute bottom-0 flex justify-center items-center bg-yellow-300 w-full py-1">
                    <span className="block text-xl font-semibold px-10 py-1">USUARIO SOLICITANTE : {userVigente?.email?.toUpperCase()}</span>
                    <button onClick={() => handleCancel()} className=" px-10 bg-red-500 font-semibold">SALIR</button>
                </div>
            }

            {!lineaActiva &&
                <div className="w-full flex items-center flex-col">
                    <span className="text-5xl font-bold mt-4">SELECCIONE LA LÍNEA</span>
                    <div className="grid grid-cols-4 items-center justify-center h-[80vh] gap-2 p-4 w-full">
                        {lineas?.map((linea, idx) => (
                            <button className="h-full text-7xl font-bold rounded-md bg-green-300" onClick={() => setLineaActiva(linea?.id)} key={`linea_${idx}`}>{linea.nombre}</button>
                        ))}
                    </div>
                </div>
            }

            {(isLoadingModelos && !modeloActivo) && <div className="w-full h-full flex items-center justify-center"><Loader fontSize={150} /></div>}

            {(lineaActiva && !modeloActivo && !isLoadingModelos) &&
                <div className='flex flex-col mt-10 w-full'>
                    <div className='w-full flex items-center justify-between mb-4 '>
                        {/* <button onClick={() => { setLineaActiva(null) }} className="text-xl bg-green-400 font-bold"><TbArrowBigLeftFilled /> <span className="text-3xl">REGRESAR</span></button> */}

                        <button onClick={() => setLineaActiva(null)} className=" text-6xl font-semibold p-2 bg-transparent flex items-center gap-2">
                            <TbArrowBigLeftFilled /> <span className="text-3xl">REGRESAR</span>
                        </button>
                        <span className='text-5xl font-bold block text-center mb-5'>SELECCIONE UN MODELO - M{lineaActiva}</span>
                        <button onClick={() => handleCancel()} className="text-xl px-10 bg-red-500 font-bold">SALIR</button>
                    </div>

                    <div className='grid grid-cols-4 w-full items-center gap-5  px-4'>
                        {modelos?.map((m, idx) => (
                            <button onClick={() => {
                                setModeloActivo(m)
                                setSelectedPiezas([])
                            }} className={`${m?.nombre?.length > 4 ? 'text-7xl !px-6' : 'text-7xl'} font-semibold w-full bg-orange-300`} key={`modelo_${idx}`}>{m?.nombre}</button>
                        ))}
                    </div>
                </div>
            }

            {modeloActivo &&
                <div className="h-full w-full">
                    <div className="flex items-center justify-between pb-2 px-2 bg-gray-200">
                        <div className="w-[33%]">
                            {funda ?
                                <button onClick={() => setFunda(null)} className=" text-6xl font-semibold p-2 bg-transparent flex items-center gap-2">
                                    <TbArrowBigLeftFilled /> <span className="text-3xl">REGRESAR</span>
                                </button>
                                :
                                <button onClick={() => setModeloActivo(null)} className=" text-6xl font-semibold p-2 bg-transparent flex items-center gap-2">
                                    <TbArrowBigLeftFilled /> <span className="text-3xl">REGRESAR</span>
                                </button>
                            }
                        </div>

                        <span className="text-8xl font-semibold w-[33%] block text-center">{modeloActivo?.nombre}</span>
                        <div className="w-[33%] flex items-end justify-end">
                            <button className="bg-red-500 px-10 text-2xl text-white" onClick={() => handleCancel()}>CANCELAR</button>
                        </div>
                    </div>

                    <div className="w-full h-[calc(100%-7rem)] flex  items-center  justify-center">
                        <div className="w-full h-[calc(100%-11rem)] flex flex-col items-center px-4 justify-center">

                            {funda ?
                                <div className=" w-full h-full flex items-center flex-col justify-center gap-4 ">
                                    <div className="w-full border-b border-gray-500 pb-4 mt-2 flex items-center">
                                        <span className="w-full text-6xl ml-[200px] font-bold block text-center  ">{funda?.nombre}</span>
                                        <button onClick={() => handleSumaAll()} className="text-sm w-[370px] bg-green-400 font-bold">SOLICITAR TODAS LAS PIEZAS</button>
                                    </div>

                                    <div className="w-auto h-full relative ">
                                        {getPiezasFunda()?.map((p, idx) => {
                                            if (p.p_left && p.p_top && p.p_width && p.p_height) {
                                                const cantidadSeleccionada = getCantidadSeleccionada(p.id)

                                                return <button
                                                    onClick={() => handleSumaPieza(p)}
                                                    key={idx}
                                                    style={{ left: `${p.p_left}%`, top: `${p.p_top}%`, width: `${p.p_width}%`, height: `${p.p_height}%` }}
                                                    className={`${cantidadSeleccionada > 0 && '!bg-orange-400'} bg-transparent !outline-none active:!bg-green-500 border-0 border-green-400 absolute opacity-50 flex items-center justify-center`}>
                                                    {cantidadSeleccionada > 0 && <span className="bg-black text-white rounded-full px-3 py-1 text-xl font-bold">{cantidadSeleccionada}</span>}
                                                </button>
                                            }
                                        })}
                                        <img src={`${PUBLIC_URI}${funda?.img}`} className="w-auto h-full" />
                                    </div>
                                </div>
                                :
                                <div className="flex items-start flex-col justify-center h-full w-full">
                                    <span className="w-full text-7xl font-semibold block text-center">SELECCIONE UNA FUNDA</span>

                                    <div className=" gap-4 mt-6 w-full grid grid-cols-2 ">
                                        {modeloActivo?.partes?.sort((a, b) => a.tipo_id - b.tipo_id).map((p, idx) => (
                                            <button
                                                onClick={() => {
                                                    // console.log(kanban?.modelo?.partes?.find(pa => pa.codigo == p?.codigo)?.piezas)
                                                    setFunda({
                                                        img: `despiece/${p?.imagen}`,
                                                        nombre: (p?.tipo?.tipo == "H/R" || p?.tipo?.tipo == "A/R") ? `${p?.tipo?.tipo}` : `${p?.lado?.lado} - ${p?.tipo?.tipo}`,
                                                        codigo: p?.codigo
                                                    })
                                                }}
                                                key={`p${idx}`} className="h-[200px] w-full font-semibold text-7xl bg-orange-300">
                                                {(p?.tipo?.tipo == "H/R" || p?.tipo?.tipo == "A/R") ?
                                                    `${p?.tipo?.tipo}`
                                                    :
                                                    <div className="flex flex-col">
                                                        <span>{p?.lado?.lado}</span>
                                                        <span>{p?.tipo?.tipo}</span>
                                                    </div>
                                                }
                                            </button>
                                        ))}
                                    </div>

                                </div>
                            }
                        </div>

                        <div className="w-[540px] overflow-x-hidden h-full border-l border-gray-500 px-2 relative">
                            {funda &&
                                <div className="w-full h-[43%] border-b border-gray-500 pb-2">
                                    <span className="text-2xl font-semibold block text-center border-gray-500 border-b">PIEZAS DE FUNDA</span>
                                    <div className="h-[calc(100%-2.5rem)] overflow-y-scroll overflow-x-hidden pt-2 flex flex-col gap-2">
                                        {getPiezasFunda()?.map((pieza, idx) => {
                                            const estado = getEstadoPieza(pieza)

                                            return <button
                                                key={`pf_${idx}`}
                                                onClick={() => handleSumaPieza(pieza)}
                                                className={`${getEstadoClass(estado)} border-2 text-black w-full py-2 px-2 flex flex-col items-start rounded-md`}
                                            >
                                                <div className="w-full flex items-center justify-between">
                                                    <span className="text-2xl font-bold">{pieza.codigo}</span>
                                                    <span className="text-xl font-bold">{estado.seleccionado > 0 ? `+${estado.seleccionado}` : '+'}</span>
                                                </div>
                                                <div className="w-full grid grid-cols-4 gap-1 text-xs font-semibold text-left">
                                                    <span>Stock {estado.stock}</span>
                                                    <span>Ped. {estado.puntoPedido}</span>
                                                    <span>Max {estado.maximo}</span>
                                                    <span>Proj. {estado.proyectado}</span>
                                                </div>
                                                {(estado.pendiente > 0 || estado.disparaCorte || estado.enCorte) &&
                                                    <span className="text-xs font-bold mt-1">
                                                        {estado.enCorte ? 'EN CORTE' : estado.disparaCorte ? `CORTE +${estado.reponer}` : `Pendiente ${estado.pendiente}`}
                                                    </span>
                                                }
                                            </button>
                                        })}
                                    </div>
                                </div>
                            }

                            <div className={`w-full overflow-y-scroll overflow-x-hidden ${funda ? 'h-[37%]' : 'h-[80%]'} `}>
                                <span className="text-2xl font-semibold block text-center border-gray-500 border-b">PIEZAS SOLICITADAS ({selectedPiezas?.reduce((p, c) => p + c?.cantidad, 0)})</span>
                                {selectedPiezas?.length > 0 && <button onClick={() => setSelectedPiezas([])} className="w-full text-xl bg-red-500 py-3 my-2 text-white">BORRAR TODO</button>}
                                {selectedPiezas?.map((p, idx) => {
                                    const pieza = findPieza(p.id)
                                    const estado = getEstadoPieza(pieza)

                                    return <div className={`${getEstadoClass(estado)} w-full border-b border-gray-500 flex flex-col px-2 py-1`} key={`p${idx}`}>
                                        <div className="w-full flex items-center justify-between">
                                            <span className="text-3xl font-semibold">{p.cantidad} x {p.codigo}</span>
                                            <button onClick={() => removePieza(p.id)} className="p-0 !outline-none bg-red-500 px-10">X</button>
                                        </div>
                                        <div className="grid grid-cols-4 text-xs font-semibold">
                                            <span>Stock {estado.stock}</span>
                                            <span>Ped. {estado.puntoPedido}</span>
                                            <span>Max {estado.maximo}</span>
                                            <span>Proj. {estado.proyectado}</span>
                                        </div>
                                        {estado.disparaCorte && <span className="text-xs font-bold text-red-700">Dispara corte por {estado.reponer} pieza(s)</span>}
                                    </div>
                                })}

                            </div>
                            <button onClick={() => setIsVisible(true)} disabled={selectedPiezas?.length == 0} className="bg-green-500 disabled:cursor-not-allowed disabled:opacity-50 w-[95%] py-6 mb-14 text-2xl text-white absolute bottom-0">CONFIRMAR</button>
                        </div>
                    </div>

                </div>
            }

            <Modal
                closable={false}
                footer={[]}
                open={!userVigente}
            >
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
                                setUserVigente(response?.data)
                                // setTimeout(() => { setFocus("kanban") }, [50])
                            }
                            setIsLoading(false)
                        }
                    }}
                />
                {isLoading && <div className="flex items-center justify-center mt-5"><Loader /></div>}
                {userError && <span className="text-red-500 font-semibold">{userError}</span>}
            </Modal>

            <Modal
                width="80%"
                closable={false}
                open={isVisible}
                className="mt-[-40px]"
                onCancel={() => setIsVisible(false)}
                footer={[
                    <div key={1} className="w-full flex items-center justify-between mt-1">
                        <button onClick={() => setIsVisible(false)} className="text-xl font-bold px-14 py-8 bg-red-500">CANCELAR</button>
                        <button
                            disabled={!defecto}
                            onClick={() => {
                                handleSavePedido()
                            }}
                            className={`text-xl font-bold px-14 py-8 bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed`}>CONFIRMAR</button>
                    </div>
                ]}
            >
                <span className="text-2xl block text-center font-semibold">SELECCIONE EL MOTIVO DE REPOSICIÓN</span>
                <div className="flex">
                    <div className="flex flex-col w-full">
                        <span className="text-2xl font-semibold block mb-2"></span>
                        <div className="flex flex-wrap gap-2 mt-8">
                            {fallas?.map((f, idx) => (
                                <button key={`falla1_${idx}`} onClick={() => setDefecto(f?.id)} className={`${defecto == f?.id && '!bg-orange-600'} w-[150px] h-[80px] text-xs bg-orange-200`}>{f?.nombre}</button>

                            ))}
                        </div>
                    </div>
                </div>
            </Modal>

            <ModalLoading isVisible={isLoadingTienda} />
        </div>
    )
}
