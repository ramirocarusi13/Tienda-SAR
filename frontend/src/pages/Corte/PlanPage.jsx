import DadosPendientesPrint from '@components/Corte/DadosPendientesPrint';
import PanelFrenarLectra from '@components/Corte/PanelFrenarLectra';
import PanelHoraInicioLectra from '@components/Corte/PanelHoraInicioLectra';
import InputUseForm from '@components/InputUseForm';
import Loader from "@components/Loader";
import SelectUseForm from "@components/SelectUseForm";
import usePlanificacion from '@hooks/usePlanificacion';
import { actualizaCorteModelo, existePlanCorte } from "@services/LectraService";
import { formatDate, formatDateTime } from "@utils/Utils";
import { Dropdown, Tabs, notification } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { CiTrash } from "react-icons/ci";
import { FaPlay } from "react-icons/fa";
import { FaArrowRotateRight, FaClockRotateLeft } from "react-icons/fa6";
import { FiCheckCircle } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowUp, IoMdSearch } from "react-icons/io";
import TableroResultadosCorte from '../../components/Corte/TableroResultadosCorte';
const lectras = [1, 2, 3, 4]


const initPlanificacion = [
    { lectra: 1, datos: [], tiempo: '00:00' },
    { lectra: 2, datos: [], tiempo: '00:00' },
    { lectra: 3, datos: [], tiempo: '00:00' },
    { lectra: 4, datos: [], tiempo: '00:00' },
]

const formatHours = (TIME) => {
    const tmp = TIME.toString()

    if (tmp.length < 2) {
        return `0${TIME}`
    }
    return TIME
}

const getTiempoLectra = (lectra, plan, porDado = true) => {
    let gs = 0, gm = 0, gh = 0

    plan.filter(p => p.lectra == lectra)?.map(m => {
        let seg = 0, min = 0, hor = 0;
        m?.datos?.map(d => {

            if (porDado) {
                d?.dados?.map(l => {
                    const time = l[`t_lectra${lectra}`]?.split(":")

                    if (time) {
                        seg = parseInt(seg) + parseInt(time[2])
                        min = parseInt(min) + parseInt(time[1])
                        hor = parseInt(hor) + parseInt(time[0])
                    }
                })
            } else {
                const time = d[`t_lectra${lectra}`]?.split(":")

                if (time) {
                    seg = parseInt(seg) + parseInt(time[2])
                    min = parseInt(min) + parseInt(time[1])
                    hor = parseInt(hor) + parseInt(time[0])
                }
            }
        })

        let tmin = 0, tseg = 0

        if (seg >= 60) {
            tseg = seg / 60
            min = min + parseInt(tseg)
            seg = Math.round((tseg - parseInt(tseg)) * 60)
        }

        if (min >= 60) {
            tmin = min / 60
            hor = hor + parseInt(tmin)
            min = Math.round((tmin - parseInt(tmin)) * 60)
        }

        gs = gs + seg
        gm = gm + min
        gh = gh + hor
    })

    return `${formatHours(gh)}:${formatHours(gm)}`
}

const getDadosFromResponse = (items = []) => {
    const dados = []

    items?.forEach((item) => {
        if (item?.dado?.length > 0) {
            dados.push(item.dado[0])
        }
    })

    return dados
}

const isTruthyValue = (value) => value === true || value === 1 || value === "1" || value === "true"

const isReposicionDado = (dado) => {
    if (isTruthyValue(dado?.es_reposicion)) {
        return true
    }

    const kanbanReemplazo = dado?.kanban_reemplazo

    if (Array.isArray(kanbanReemplazo)) {
        return kanbanReemplazo.length > 0
    }

    if (typeof kanbanReemplazo === 'object' && kanbanReemplazo !== null) {
        return Object.keys(kanbanReemplazo).length > 0
    }

    return Boolean(kanbanReemplazo)
}

const getPiezaIdFromDado = (dado) => {
    if (!isReposicionDado(dado)) {
        return undefined
    }

    return dado?.pieza_id
        ?? dado?.kanban_reemplazo?.pieza_id
        ?? dado?.kanban_reemplazo?.pieza?.id
        ?? dado?.kanban_reemplazo?.reemplazo?.pieza_id
        ?? dado?.kanban_reemplazo?.reemplazo?.pieza?.id
}

const buildPlanItemsPayload = (items = []) => items.map((item) => ({
    ...item,
    datos: item?.datos?.map((dado) => {
        const esReposicion = isReposicionDado(dado)
        const piezaId = getPiezaIdFromDado(dado)

        return {
            ...dado,
            es_reposicion: esReposicion,
            ...(piezaId != null ? { pieza_id: piezaId } : {})
        }
    }) || []
}))

const normalizePlanItem = (item, extraData = {}, esReposicion = false) => {

    let dadosA = []
    let dadosB = []
    let dadosC = []
    let compartidosDadosA = []
    let compartidosDadosB = []
    let compartidosDadosC = []

    // if (esReposicion) {
    // console.log(item)
    // }
    dadosA = getDadosFromResponse(item?.dadosA)
    dadosB = getDadosFromResponse(item?.dadosB)
    dadosC = getDadosFromResponse(item?.dadosC)
    compartidosDadosA = getDadosFromResponse(item?.compartidoDadosA)
    compartidosDadosB = getDadosFromResponse(item?.compartidoDadosB)
    compartidosDadosC = getDadosFromResponse(item?.compartidoDadosC)


    return {
        cantidadPendiente: item?.cantidad ?? 1,
        operacion: item?.operacion,
        compartidoName: item?.compartidoName,
        modelo: item?.modelo,
        pendiente: true,
        usadoA: false,
        usadoB: false,
        tieneA: dadosA?.length > 0 || compartidosDadosA?.length > 0,
        tieneB: dadosB?.length > 0 || compartidosDadosB?.length > 0,
        completo: dadosC,
        a: dadosA,
        b: dadosB,
        compartidoC: compartidosDadosC,
        compartidoA: compartidosDadosA,
        compartidoB: compartidosDadosB,
        utilizado: false,
        ...extraData
    }
}

const normalizePlanItems = (items = [], esReposicion = false, extraData = {}) => items?.map((item) => normalizePlanItem(item, extraData, esReposicion)) || []


export default function PlanPage() {
    const [error, setError] = useState(null)
    const [planificacion, setPlanificacion] = useState(initPlanificacion)
    const [currentPlanificacion, setCurrentPlanificacion] = useState(null)
    const [pendientes, setPendientes] = useState([])
    const [dataNewPlan, setDataNewPlan] = useState(null)
    const { isLoading: isLoadingPendientesPlan, getData: getPlanificacion, setPlanificacion: setPlanCorte, fetchPlanificacion } = usePlanificacion(false)
    const { register, getValues, control, handleSubmit, setValue, formState: { errors } } = useForm();
    const [dadosPlan, setDadosPlan] = useState([])
    const [ornaments, setOrnaments] = useState([])
    const [m11Models, setM11models] = useState([])
    const [reposiciones, setReposiciones] = useState([])
    const [otrosDados, setOtrosDados] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [fechaInicio, setFechaInicio] = useState(null)

    const [modelosPlanificados, setModelosPlanificados] = useState([])
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (message) => {
        api.warning({
            message: 'Atención!',
            description: message,
            duration: 10,
        });
    };



    const fetchPendientes = async () => {
        const data = await getPlanificacion(true)

        if (data.error) {
            return
        }

        const responseData = data?.data || {}
        const reposicionesResponse = responseData?.reposiciones || responseData?.reposicion || responseData?.repo || []

        // console.log(reposicionesResponse)

        setOrnaments(responseData?.ornament || [])
        setM11models(normalizePlanItems(responseData?.m11Models))
        setOtrosDados(responseData?.otros || [])
        setPendientes(normalizePlanItems(responseData?.pendientes))
        setReposiciones(normalizePlanItems(reposicionesResponse, true))
    }

    const moverALectra = (lectra, id, newLectra, id2 = null) => {

        // console.log(lectra, id, newLectra)
        const currentIndex = planificacion?.findIndex((plan) => plan.lectra == lectra)
        const newLectraIndex = planificacion?.findIndex((plan) => plan.lectra == newLectra)

        const datos = planificacion[currentIndex]?.datos
        const newDatos = planificacion[newLectraIndex]?.datos

        let oldDatosLectra = null

        if (!id) {
            oldDatosLectra = datos.filter(d => d.idPapa != id)
        } else {
            oldDatosLectra = datos.filter(d => d.id != id2)
        }

        datos.forEach(d => {
            if (!id) {
                if (d.idPapa == id) {
                    newDatos.push(d)
                }
            } else {
                if (d.id == id2) {
                    newDatos.push(d)
                }
            }
        });

        const newPlan = [...planificacion]
        newPlan[currentIndex].datos = oldDatosLectra
        newPlan[newLectraIndex].datos = newDatos

        setPlanificacion(newPlan)
    }

    const quitarDePlanificacion = async (lectra, id) => {
        const currentIndex = planificacion?.findIndex((plan) => plan.lectra == lectra)
        const datos = planificacion[currentIndex]?.datos

        const originalData = datos.filter(d => d.id == id)[0]
        const newDatos = datos.filter(d => d.id != id)
        const newPlan = planificacion
        newPlan[currentIndex].datos = newDatos

        const currentIndexPendiente = pendientes?.findIndex((p) => p.modelo == originalData.modelo || p.compartidoName == originalData?.modelo)
        let updatePendiente;

        if (originalData.esCompleto) {
            updatePendiente = { ...pendientes[currentIndexPendiente], pendiente: true }
            const res = await actualizaCorteModelo({ modelo: originalData.modelo, cantidad: -1 })
        } else {
            if (originalData.esA) {
                updatePendiente = { ...pendientes[currentIndexPendiente], usadoA: false, pendiente: true }
            } else {
                //ES B
                updatePendiente = { ...pendientes[currentIndexPendiente], usadoB: false, pendiente: true }
            }
        }

        const newPendientes = [...pendientes]
        newPendientes[currentIndexPendiente] = updatePendiente

        //ACTUALIZO EN LA BASE
        if (!updatePendiente?.usadoA && !updatePendiente?.usadoB && !originalData.esCompleto) {
            const res = await actualizaCorteModelo({ modelo: originalData.modelo, cantidad: -1 })
        }


        setPendientes(newPendientes)
        setPlanificacion(newPlan)
    }

    const agregaPlanificacion = async (lectra, modelo, dados, tipo) => {

        // console.log(lectra, modelo, tipo, dados)

        const esCompleto = tipo == "COMPLETO"
        const esA = tipo == "A"
        const esB = tipo == "B"

        const currentIndex = planificacion?.findIndex((plan) => plan.lectra == lectra)

        const datos = planificacion[currentIndex]?.datos
        // console.log(dados)
        dados?.forEach(d => {
            d.modelo = modelo
            d.esA = esA
            d.esB = esB
            d.esCompleto = esCompleto
            d.idPapa = d.id
            // id: `${modelo}-${parseInt(Math.random() * (9999 - 1) + 1)}`
        })

        // console.log("AGREGARPLANIFICACION", dados)
        const newDados = datos.concat(dados)


        const updatePlan = { ...planificacion[currentIndex], datos: newDados }
        const newPlan = [...planificacion]
        newPlan[currentIndex] = updatePlan

        let updatePendiente;

        agregaAModelosPlanificados(updatePendiente?.modelo, esCompleto ? true : esA, esCompleto ? true : esB)
        setPlanificacion(newPlan)
    }

    const agregaAModelosPlanificados = (modelo, esA = false, esB = false) => {
        let existe;

        // console.log(modelo)

        if (esA && !esB) {
            existe = modelosPlanificados?.findIndex((m) => m.modelo == modelo && !m?.esA)
        } else if (!esA && esB) {
            existe = modelosPlanificados?.findIndex((m) => m.modelo == modelo && !m?.esB)
        } else {
            existe = -1
        }

        if (existe < 0) {
            setModelosPlanificados([...modelosPlanificados, {
                modelo: modelo,
                esA: esA,
                esB: esB
            }])
        } else {
            const data = modelosPlanificados[existe]

            if (esA) {
                data.esA = true
            } else if (esB) {
                data.esB = true
            }

            const newData = [...modelosPlanificados]
            newData[existe] = data

            setModelosPlanificados(newData)
        }
    }

    const tiempoDados = (dados, lectra) => {

        let ht = 0, mt = 0, st = 0;

        dados?.map(d => {
            if (d) {
                const time = d[`t_lectra${lectra}`]
                if (time) {
                    ht = ht + parseInt(time.substring(0, 2))
                    mt = mt + parseInt(time.substring(3, 5))
                    st = st + parseInt(time.substring(6, 9))
                }
            }
        })

        let ent = 0, temp = 0
        if (st > 60) {
            temp = st / 60
            ent = parseInt(temp)
            st = Math.ceil((temp - ent) * 60)
            mt = mt + ent
        }

        if (mt > 60) {
            temp = mt / 60
            ent = parseInt(temp)
            mt = Math.ceil((temp - ent) * 60)
            ht = ht + ent
        }

        return `${formatHours(ht)}:${formatHours(mt)}:${formatHours(st)}`
    }

    const DropDados = ({ modelo, text, dados, disabled = false, compartidoName = null, dadosCompartido = [] }) => {
        let items = []

        if (compartidoName) {

            items.push({
                key: '0',
                label: <span className='font-semibold bg-green-500 block w-full text-center'>{compartidoName}</span>
            },)
            dadosCompartido?.map((d, idx) => {
                items.push({
                    key: `i_${idx}_${d?.material?.codigo_interno}_${modelo}`,
                    label: (
                        <div className='grid grid-cols-5 items-center gap-1  '>
                            <span className='text-xs font-semibold mr-2 bg-orange-300'>{d?.material?.codigo_interno} - {d?.material?.nombre}</span>
                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(1, modelo, [d], text)}>
                                L1 | {tiempoDados([d], 1)}
                            </button>

                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(2, modelo, [d], text)}>
                                L2 | {tiempoDados([d], 2)}
                            </button>

                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(3, modelo, [d], text)}>
                                L3 | {tiempoDados([d], 3)}
                            </button>

                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(4, modelo, [d], text)}>
                                L4 | {tiempoDados([d], 4)}
                            </button>
                        </div>
                    ),
                })
            })
        }

        if (dados?.length > 0) {
            items.push({
                key: '15080',
                label: <span className='font-semibold bg-green-500 block w-full text-center'>{modelo}</span>
            },)

            dados?.map((d, idx) => {
                items.push({
                    key: `i_${idx}`,
                    label: (
                        <div className='grid grid-cols-5 items-center gap-1'>
                            <span className='text-xs font-semibold mr-2 bg-orange-300'>{d?.material?.codigo_interno} - {d?.material?.nombre}</span>
                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(1, modelo, [d], text)}>
                                L1 | {tiempoDados([d], 1)}
                            </button>

                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(2, modelo, [d], text)}>
                                L2 | {tiempoDados([d], 2)}
                            </button>

                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(3, modelo, [d], text)}>
                                L3 | {tiempoDados([d], 3)}
                            </button>

                            <button className='disabled:bg-gray-200 text-xs disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados([d], 1) == '00:00:00'} onClick={() => agregaPlanificacion(4, modelo, [d], text)}>
                                L4 | {tiempoDados([d], 4)}
                            </button>
                        </div>
                    ),
                })
            })
        }

        return <Dropdown
            disabled={disabled}
            menu={{ items: items }}
        >
            <a className='text-xs font-bold' onClick={(e) => e.preventDefault()}>{text}</a>
        </Dropdown >
    }

    const Drop = ({ modelo, text, dados, disabled = false, compartidoName = null, dadosCompartido = [] }) => {
        return <Dropdown
            disabled={disabled}

            menu={{

                items: compartidoName ? [
                    {
                        key: '0',
                        label: <span className='font-semibold bg-green-500 block w-full text-xs text-center'>DADOS : {dados?.map(d => (d?.material?.codigo_interno == undefined ? '' : d?.material?.codigo_interno) + ' - ')}</span>
                    },
                    {
                        key: '1',
                        label: (
                            <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dados, 1) == '00:00:00'} onClick={() => agregaPlanificacion(1, modelo, dados, text)}>
                                LECTRA 1 | {tiempoDados(dados, 1)}
                            </button>
                        ),
                    },
                    {
                        key: '2',
                        label: (
                            <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dados, 2) == '00:00:00'} onClick={() => agregaPlanificacion(2, modelo, dados, text)}>
                                LECTRA 2 | {tiempoDados(dados, 2)}
                            </button>
                        ),
                    },
                    {
                        key: '3',
                        label: (
                            <button className="disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2" disabled={tiempoDados(dados, 3) == '00:00:00'} onClick={() => agregaPlanificacion(3, modelo, dados, text)}>
                                LECTRA 3 | {tiempoDados(dados, 3)}
                            </button>
                        ),
                    },
                    {
                        key: '4',
                        label: (
                            <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dados, 4) == '00:00:00'} onClick={() => agregaPlanificacion(4, modelo, dados, text)}>
                                LECTRA 4 | {tiempoDados(dados, 4)}
                            </button>
                        ),
                    },
                    {
                        key: '11',
                        label: <span className='font-semibold bg-green-500 block w-full text-xs text-center'>DADOS : {dadosCompartido?.map(d => (d?.material?.codigo_interno == undefined ? '' : d?.material?.codigo_interno) + ' - ')}</span>
                    },
                    {
                        key: '5',
                        label: (
                            <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dadosCompartido, 1) == '00:00:00'} onClick={() => agregaPlanificacion(1, compartidoName, dadosCompartido, text)}>
                                LECTRA 1 | {compartidoName} | {tiempoDados(dadosCompartido, 1)}
                            </button>
                        ),
                    },
                    {
                        key: '6',
                        label: (
                            <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dadosCompartido, 2) == '00:00:00'} onClick={() => agregaPlanificacion(2, compartidoName, dadosCompartido, text)}>
                                LECTRA 2 | {compartidoName} | {tiempoDados(dadosCompartido, 2)}
                            </button>
                        ),
                    },
                    {
                        key: '7',
                        label: (
                            <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dadosCompartido, 3) == '00:00:00'} onClick={() => agregaPlanificacion(3, compartidoName, dadosCompartido, text)}>
                                LECTRA 3 | {compartidoName} | {tiempoDados(dadosCompartido, 3)}
                            </button>
                        ),
                    },
                    {
                        key: '8',
                        label: (
                            <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dadosCompartido, 4) == '00:00:00'} onClick={() => agregaPlanificacion(4, compartidoName, dadosCompartido, text)}>
                                LECTRA 4 | {compartidoName} | {tiempoDados(dadosCompartido, 4)}
                            </button>
                        ),
                    }
                ] :

                    [
                        {
                            key: '0',
                            label: <span className='font-semibold bg-green-500 block w-full text-xs text-center'>DADOS : {dados?.map(d => (d?.material?.codigo_interno == undefined ? '' : d?.material?.codigo_interno) + ' - ')}</span>
                        },
                        {
                            key: '1',
                            label: (
                                <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2 ' disabled={tiempoDados(dados, 1) == '00:00:00'} onClick={() => agregaPlanificacion(1, modelo, dados, text)}>
                                    LECTRA 1 | {tiempoDados(dados, 1)}
                                </button>
                            ),
                        },
                        {
                            key: '2',
                            label: (
                                <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dados, 2) == '00:00:00'} onClick={() => agregaPlanificacion(2, modelo, dados, text)}>
                                    LECTRA 2 | {tiempoDados(dados, 2)}
                                </button>
                            ),
                        },
                        {
                            key: '3',
                            label: (
                                <button className="disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2" disabled={tiempoDados(dados, 3) == '00:00:00'} onClick={() => agregaPlanificacion(3, modelo, dados, text)}>
                                    LECTRA 3 | {tiempoDados(dados, 3)}
                                </button>
                            ),
                        },
                        {
                            key: '4',
                            label: (
                                <button className='disabled:bg-gray-200 disabled:cursor-not-allowed py-1 px-2' disabled={tiempoDados(dados, 4) == '00:00:00'} onClick={() => agregaPlanificacion(4, modelo, dados, text)}>
                                    LECTRA 4 | {tiempoDados(dados, 4)}
                                </button>
                            ),
                        },
                    ]

            }}
        >
            <a className='text-xs font-bold' onClick={(e) => e.preventDefault()}>
                {text}
            </a>
        </Dropdown >
    }

    const changeOrderItems = (lectra, order, newOrder, orderModelo) => {

        const currentIndex = planificacion?.findIndex((plan) => plan.lectra == lectra)

        let datos = planificacion[currentIndex].datos

        const oldPosition = datos[newOrder]
        const newPosition = datos[order]

        const newDatos = []

        datos.forEach((d, idx) => {
            if (idx == newOrder) {
                newDatos.push(newPosition)
            } else if (idx == order) {
                newDatos.push(oldPosition)
            } else {
                newDatos.push(d)
            }
        })

        const updatePlan = { ...planificacion[currentIndex], datos: newDatos }
        const newPlan = [...planificacion]
        newPlan[currentIndex] = updatePlan

        // console.log(newPlan?.filter((item, index) => index >= 0))
        setPlanificacion(newPlan)
    }

    const consultarPlanificacion = async () => {
        setIsLoading(true)
        setError(null)
        const dataFecha = getValues("fecha")
        const dataTurno = "TM"//getValues("turno")

        if (!dataTurno || !dataFecha) {
            setError("DEBE INGRESAR LA FECHA")
            setIsLoading(false)
            return
        }

        const data = {
            fecha: dataFecha,
            turno: dataTurno
        }

        const fecha = new Date(data?.fecha)

        const response = await fetchPlanificacion({
            fecha: formatDate(fecha),
            turno: data.turno
        }, true)

        if (!response?.error) {

            await creaPlanificacion(data, false)
            setCurrentPlanificacion("1")
            setError(null)

            await fetchPendientes()

            setPlanificacion(response?.data)

            const datos = []

            response?.data?.forEach(r => {
                // console.log(r)
                r?.datos?.forEach(d => {
                    datos.push({
                        lectra: r.lectra,
                        ...d
                    })

                })
            })

            setDadosPlan(datos)
            setIsLoading(false)

            setFechaInicio(new Date())
        } else {
            //SI HAY ERROR AL CONSULTAR, ENTONCES FALTA CREAR
            handleSubmit(creaPlanificacion)()
            setFechaInicio(new Date())

        }
    }

    const savePlanificacion = async () => {
        // console.log({ planificacion: currentPlanificacion })
        const fechaActual = new Date()

        if (fechaActual.getHours() > fechaInicio.getHours()) {
            openNotification("Debe actualizar la página para poder cambiar el plan")
            return
        } else {
            if (Math.abs(fechaActual.getMinutes() - fechaInicio.getMinutes()) >= 10) {
                openNotification("Debe actualizar la página para poder cambiar el plan")
                return
            }
        }

        const itemsPayload = buildPlanItemsPayload(planificacion)
        const response = await setPlanCorte({ plan: dataNewPlan, items: itemsPayload, planificacion: currentPlanificacion, modelos: modelosPlanificados }, true)
        // console.log(response)

        if (!response.error) {
            setPlanificacion(initPlanificacion)
            setCurrentPlanificacion(null)
            setDataNewPlan(null)
        }
    }

    const creaPlanificacion = async (data, verificarExistencia = true) => {
        setIsLoading(true)
        const fecha = new Date(data?.fecha)
        data.turno = 'TM'

        if (verificarExistencia) {
            //VERIFICO SI YA EXISTE UNA PLANIFICACION CON LOS DATOS INGRESADOS
            const res = await existePlanCorte({ fecha: formatDate(fecha), turno: data.turno })

            if (res?.data?.id > 0) {
                setError("YA EXISTE UN PLAN CON LOS DATOS INGRESADOS. DEBE PRESIONAR CONSULTAR.")
                setIsLoading(false)
                return
            }
        }

        //Actualizo y obtengo lo planificado del dia anterior que no se corto, asi tiene la posibilidad de cancelarlo.
        // if (!verificarExistencia) {
        //     const planExistente = await intercambiaPlanAnterior({ fecha: formatDate(fecha), turno: data.turno })
        //     // console.log(planExistente)
        // }

        setCurrentPlanificacion(null)
        // setPlanificacion(initPlanificacion)
        setDataNewPlan({
            fecha: formatDate(fecha),
            turno: data.turno,
            turnoName: data.turno == 'TT' ? 'TURNO TARDE' : 'TURNO MAÑANA',
        })

        setIsLoading(false)

    }

    useEffect(() => {
        document.title = "Plan de corte"
    }, [])

    useEffect(() => {
        setValue("fecha", moment())
    }, [dataNewPlan])

    const emptyPlanification = () => {
        return planificacion?.length == 0 || (planificacion?.find(p => p.lectra == 1)?.datos?.length == 0 && planificacion?.find(p => p.lectra == 2)?.datos?.length == 0 && planificacion?.find(p => p.lectra == 3)?.datos?.length == 0 && planificacion?.find(p => p.lectra == 4)?.datos?.length == 0)
    }

    return (
        <div className='flex flex-col items-end gap-1'>
            {contextHolder}
            <div className={`${dataNewPlan ? 'hidden' : 'flex'} flex-col items-center w-full gap-2`}>
                <div className={`flex items-center w-full gap-2`}>

                    <InputUseForm
                        label="Fecha a planificar"
                        name="fecha"
                        className="w-[250px]"
                        register={register}
                        control={control}
                        errors={errors}
                        type='date'
                        placeholder="Fecha"
                        rules={{ required: "Ingrese la fecha de planificación" }}
                    />

                    <SelectUseForm
                        label="Turno"
                        name="turno"
                        classNameLabel="!mt-2 !mb-1"
                        className="w-[250px] !hidden"
                        placeholder="Seleccione un turno"
                        register={register}
                        errors={errors}
                        search={true}
                        control={control}
                        options={[{ value: 'TM', label: 'Turno Mañana' }, { value: 'TT', label: 'Turno Tarde' }]}
                    />

                    <button
                        disabled={isLoading}
                        type="button"
                        onClick={() => consultarPlanificacion()}
                        className='flex mt-6 items-center gap-2 bg-blue-500 text-white disabled:opacity-70 disabled:cursor-not-allowed'
                    ><IoMdSearch /> Consultar planificación</button>
                </div>

                {isLoading && <div className='mt-10'>
                    <Loader fontSize={50} />
                </div>}

                {error && <span className='w-full block text-red-500 font-semibold text-lg'>{error.toUpperCase()}</span>}
            </div>

            {dataNewPlan &&
                <div className={`${dataNewPlan ? 'flex' : 'hidden'} w-full h-[50vh] flex-col items-start justify-between `}>

                    <div className='w-full flex items-center border-b-2 border-red-500 px-1 pb-1 mb-2'>
                        <span className='block text-center w-full text-xl font-bold'>{currentPlanificacion ? <span className='text-orange-600 underline'>EDITANDO</span> : 'PLANIFICANDO'} PLAN DEL <span className='text-orange-600'>{dataNewPlan?.fecha}</span></span>

                        <div className='flex items-center gap-2 w-[600px]'>
                            {/* <PrintKanbansPlan className='w-full' /> */}
                            <DadosPendientesPrint planificacion={planificacion} />
                            <button
                                onClick={() => {
                                    setCurrentPlanificacion(null)
                                    setPlanificacion(initPlanificacion)
                                    setDataNewPlan(null)
                                }}
                                className='bg-red-500 text-xs '>CANCELAR</button>
                        </div>
                    </div>

                    <div className='flex h-full w-full items-start justify-between'>
                        <div className='w-full flex items-start flex-col gap-2'>
                            <div className='w-full h-[50vh] flex items-start justify-between '>
                                <Tabs
                                    defaultActiveKey='1'
                                    className='w-full '
                                    items={[
                                        {
                                            key: '1',
                                            label: 'Programación',
                                            children:

                                                <div className='flex h-full w-full items-start justify-between gap-2'>
                                                    <div className='flex flex-col '>
                                                        <Tabs
                                                            defaultActiveKey='I1'
                                                            className='!w-[300px]'
                                                            items={[
                                                                {
                                                                    key: 'I1',
                                                                    label: 'Mod.',
                                                                    children:
                                                                        <div className='w-[300px] h-full mr-4 border-r-2 px-1'>
                                                                            <span className='block text-center text-base mb-1 bg-yellow-200 font-semibold py-2'>Pendientes de planificación</span>
                                                                            <button
                                                                                disabled={isLoadingPendientesPlan}
                                                                                className='text-green-600 disabled:text-gray-600 disabled:cursor-not-allowed hover:!border-none active:!border-none active:outline-none focus:outline-none focus-within:border-none !border-none bg-transparent w-full text-sm mb-1 flex justify-center items-center gap-2'
                                                                                onClick={() => fetchPendientes()}>
                                                                                {isLoadingPendientesPlan ? 'Actualizando...' : 'Actualizar modelos'} {!isLoadingPendientesPlan && <FaArrowRotateRight />}
                                                                            </button>

                                                                            {isLoadingPendientesPlan && <div className='flex items-center justify-center'><Loader /></div>}
                                                                            {!isLoadingPendientesPlan && pendientes?.filter(p => p.pendiente == true)?.length == 0 && <div><span className='block text-center my-2 text-gray-600'>No quedan pendientes de planificación</span></div>}
                                                                            {!isLoadingPendientesPlan && pendientes?.length > 0 &&
                                                                                <div className='flex flex-col gap-2'>
                                                                                    {pendientes?.map((pendiente, idx) => {
                                                                                        if (parseInt(pendiente?.cantidadPendiente) > 0) {
                                                                                            for (let index = 0; index < parseInt(pendiente?.cantidadPendiente); index++) {

                                                                                                return <div key={`ss_${idx}`} className='grid grid-cols-2 items-center gap-0 border-b-2'>
                                                                                                    <span className='text-base font-bold px-2 block w-full'>{idx + 1} - {pendiente?.modelo}</span>
                                                                                                    <div className='flex items-center justify-between gap-1 w-full'>
                                                                                                        <DropDados compartidoName={pendiente?.compartidoName} dadosCompartido={pendiente?.compartidoC} modelo={pendiente.modelo} text="DADOS" dados={pendiente?.completo} disabled={false} />
                                                                                                        <Drop compartidoName={pendiente?.compartidoName} dadosCompartido={pendiente?.compartidoC} modelo={pendiente.modelo} text="COMPLETO" dados={pendiente?.completo} disabled={false} />
                                                                                                        {pendiente?.tieneA && <Drop compartidoName={pendiente?.compartidoName} dadosCompartido={pendiente?.compartidoA} modelo={pendiente.modelo} text="A" dados={pendiente?.a} disabled={pendiente?.usadoA} />}
                                                                                                        {pendiente?.tieneB && <Drop compartidoName={pendiente?.compartidoName} dadosCompartido={pendiente?.compartidoB} modelo={pendiente.modelo} text="B" dados={pendiente?.b} disabled={pendiente?.usadoB} />}
                                                                                                    </div>
                                                                                                </div>

                                                                                            }
                                                                                        }
                                                                                        // }
                                                                                    })}
                                                                                </div>
                                                                            }

                                                                        </div>
                                                                },
                                                                {
                                                                    key: 'I2',
                                                                    label: 'DT/ORN',
                                                                    children: <div className='w-[300px] h-full mr-4 border-r-2 px-1'>
                                                                        <div className='flex flex-col gap-2'>

                                                                            {isLoadingPendientesPlan && <div className='flex items-center justify-center'><Loader /></div>}

                                                                            {!isLoadingPendientesPlan && ornaments?.map((ornament, idx) => {

                                                                                return <div key={`orn_${idx}`} className='flex items-center gap-0 border-b-2'>
                                                                                    <span className='text-base font-bold px-2 block w-full'>{ornament.dado}</span>
                                                                                    <Drop
                                                                                        compartidoName=""
                                                                                        dadosCompartido={false}
                                                                                        modelo={"ORNAMENT"}
                                                                                        text="DADO"
                                                                                        dados={[{
                                                                                            dado: ornament?.dado,
                                                                                            t_lectra1: ornament?.t_lectra1,
                                                                                            t_lectra2: ornament?.t_lectra2,
                                                                                            t_lectra3: ornament?.t_lectra3,
                                                                                            t_lectra4: ornament?.t_lectra4,
                                                                                            material: ornament?.material,
                                                                                            modelo: 'ORNAMENT',
                                                                                            id: idx
                                                                                        }]}
                                                                                        disabled={false}
                                                                                    />

                                                                                </div>

                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                },
                                                                {
                                                                    key: 'I3',
                                                                    label: 'M11',
                                                                    children: <div className='w-[300px] h-full mr-4 border-r-2 px-1'>
                                                                        <div className='flex flex-col gap-2'>

                                                                            <div className='flex flex-col gap-2'>
                                                                                {isLoadingPendientesPlan && <div className='flex items-center justify-center'><Loader /></div>}

                                                                                {!isLoadingPendientesPlan && m11Models?.map((pend, idx) => {
                                                                                    return <div key={`m11_${idx}`} className='flex items-center gap-0 border-b-2'>

                                                                                        <span className='text-base font-bold px-2 block w-full'>{pend.modelo}</span>
                                                                                        <div className='flex items-center justify-between gap-1 w-full'>
                                                                                            <DropDados compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoC} modelo={pend.modelo} text="DADOS" dados={pend?.completo} disabled={false} />

                                                                                            <Drop compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoC} modelo={pend.modelo} text="COMPLETO" dados={pend?.completo} disabled={(pend?.tieneA && pend.usadoA) || (pend?.tieneB && pend.usadoB)} />

                                                                                            {pend?.tieneA && <Drop compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoA} modelo={pend.modelo} text="A" dados={pend?.a} disabled={pend.usadoA} />}
                                                                                            {pend?.tieneB && <Drop compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoB} modelo={pend.modelo} text="B" dados={pend?.b} disabled={pend.usadoB} />}
                                                                                        </div>
                                                                                    </div>

                                                                                })}
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                },
                                                                {
                                                                    key: 'I4',
                                                                    label: 'Repo',
                                                                    children: <div className='w-[300px] h-full mr-4 border-r-2 px-1'>
                                                                        <div className='flex flex-col gap-2'>

                                                                            <div className='flex flex-col gap-2'>
                                                                                {isLoadingPendientesPlan && <div className='flex items-center justify-center'><Loader /></div>}

                                                                                {!isLoadingPendientesPlan && reposiciones?.map((pend, idx) => {
                                                                                    // console.log(pend)
                                                                                    return <div key={`repo_${idx}`} className='flex items-center gap-0 border-b-2'>

                                                                                        <span className='text-base font-bold px-2 block w-full'>{pend.modelo} - {pend.completo[0].material.codigo_interno}</span>
                                                                                        <div className='flex items-center justify-between gap-1 w-full'>
                                                                                            {/* <DropDados compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoC} modelo={pend.modelo} text="DADOS" dados={pend?.completo} disabled={false} /> */}

                                                                                            <Drop compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoC} modelo={pend.modelo} text="COMPLETO" dados={pend?.completo} disabled={(pend?.tieneA && pend.usadoA) || (pend?.tieneB && pend.usadoB)} />

                                                                                            {/* {pend?.tieneA && <Drop compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoA} modelo={pend.modelo} text="A" dados={pend?.a} disabled={pend.usadoA} />}
                                                                                            {pend?.tieneB && <Drop compartidoName={pend?.compartidoName} dadosCompartido={pend?.compartidoB} modelo={pend.modelo} text="B" dados={pend?.b} disabled={pend.usadoB} />} */}
                                                                                        </div>
                                                                                    </div>

                                                                                })}
                                                                            </div>

                                                                        </div>
                                                                    </div>
                                                                }
                                                            ]}
                                                        />
                                                        <button disabled={emptyPlanification()} onClick={() => savePlanificacion()} className='bg-green-500 disabled:opacity-80 disabled:cursor-not-allowed text-white hover:opacity-90 w-full mt-5'>Confirmar planificación</button>
                                                    </div>

                                                    <div className='w-full min-h-[50vh] flex items-start justify-between'>
                                                        {lectras.map((lectra, idx) => {
                                                            return <div key={`lec_${idx}`} className='flex flex-col items-start h-full w-full mx-1'>

                                                                <PanelHoraInicioLectra key={`phi_${idx}`} lectra={lectra} />
                                                                <PanelFrenarLectra key={`pfl_${idx}`} lectra={lectra} />

                                                                <span className='font-bold w-full text-center block text-lg bg-slate-300 py-1 px-2 rounded-tl-lg rounded-tr-lg'>LECTRA {lectra}</span>
                                                                <span className='font-bold w-full text-center block text-sm pb-1 bg-slate-300'>TIEMPO PLANIFICADO {getTiempoLectra(lectra, planificacion, false)} {`≈`}</span>

                                                                {planificacion?.filter(p => p?.lectra == lectra)?.map(p => p?.datos?.filter(p => p?.id > 0 || p?.modelo == 'ORNAMENT')?.map((d, iddx) => {

                                                                    return <div key={`dado_${iddx}`} className={`px-2 py-1 flex flex-col w-full items-start justify-between border-b-2 ${d?.fin != null && '!hidden'} ${(d?.inicio != null && d?.fin == null) && 'animate-pulse'} ${isReposicionDado(d) && '!bg-emerald-300'}  border-orange-700 ${(d?.inicio != null && d?.fin != null) && '!bg-orange-500'} ${(d?.esCompleto == 1 || d?.esCompleto == "1") ? 'bg-white' : ((d?.esB == 1 || d?.esB == "1") ? 'bg-blue-300 border-blue-400' : 'bg-yellow-300 border-yellow-500')} ${d?.modelo == 'ORNAMENT' && '!bg-rose-200 border-rose-400'} `}>
                                                                        <div className='flex items-center w-full justify-between border-b border-gray-300 py-1'>
                                                                            <div className='flex items-center gap-2'>
                                                                                <span className='text-xs font-bold text-start'>{d?.modelo ? d.modelo : d?.dado} {isReposicionDado(d) && ' (REPOSICIÓN)'}</span>
                                                                                {d?.inicio != null && d?.fin == null && <span className='px-1 bg-green-500 flex items-center text-[80%] gap-1 rounded-md'><FaPlay />EN CORTE</span>}
                                                                            </div>
                                                                            {d?.es_plan_anterior && <FaClockRotateLeft className='text-blue-500' />}
                                                                            {(d?.abastecido == true || d?.abastecido == 1 || d?.abastecido == "1") && <FiCheckCircle className='text-green-500 text-lg font-bold' />}
                                                                            <span className='font-semibold text-xs'>{d[`t_lectra${lectra}`] ? d[`t_lectra${lectra}`] : '--:--'}</span>
                                                                        </div>

                                                                        <div className='flex items-start w-full justify-between py-1'>
                                                                            <div className={`${d?.inicio != null && d?.fin == null && '!bg-green-300'} ${d?.inicio != null && d?.fin != null && '!bg-orange-300'} ${iddx % 2 == 0 ? 'bg-slate-200' : 'bg-white'} w-full mr-1 px-1`}>
                                                                                <span className='font-semibold text-[70%]'> {d?.material?.codigo_interno} -</span>
                                                                                <span className='font-semibold text-[70%]'> {d?.material?.nombre} </span>
                                                                            </div>

                                                                            <div className='flex items-center gap-1'>
                                                                                {(d?.inicio == '' || d?.inicio == null) && iddx < p?.datos?.length - 1 && <button onClick={() => changeOrderItems(lectra, iddx, iddx + 1, iddx)} className='p-0 bg-slate-300'><IoIosArrowDown className='text-xl' /></button>}
                                                                                {(d?.inicio == '' || d?.inicio == null) && iddx > 0 && <button onClick={() => changeOrderItems(lectra, iddx, iddx - 1, iddx)} className='p-0 bg-slate-300'><IoIosArrowUp className='text-xl' /></button>}
                                                                                {(d?.inicio == '' || d?.inicio == null) && <button onClick={() => quitarDePlanificacion(lectra, d?.id)} className='ml-2 p-0 text-white !bg-red-500'><CiTrash className='text-xl' /></button>}
                                                                            </div>
                                                                        </div>

                                                                        {(d?.inicio && d?.fin) &&
                                                                            <div className='flex flex-col gap-0'>
                                                                                <span className='font-semibold text-[80%]'>Inicio : {formatDateTime(d?.inicio)}</span>
                                                                                <span className='font-semibold text-[80%]'>Fin : {formatDateTime(d?.fin)}</span>
                                                                            </div>
                                                                        }

                                                                        <div className={`flex items-center gap-2 justify-center w-full ${(d?.inicio != null && (d?.fin != null || d?.fin == null)) ? '!hidden' : 'block'}`}>
                                                                            <span className='text-xs font-semibold'>MOVER A</span>
                                                                            <button onClick={() => moverALectra(lectra, d.idPapa, 1, d?.id)} className={`${lectra == 1 && 'hidden'} text-[70%] px-2 py-1 hover:bg-orange-300`}>L1</button>
                                                                            <button onClick={() => moverALectra(lectra, d.idPapa, 2, d?.id)} className={`${lectra == 2 && 'hidden'} text-[70%] px-2 py-1 hover:bg-orange-300`}>L2</button>
                                                                            <button onClick={() => moverALectra(lectra, d.idPapa, 3, d?.id)} className={`${lectra == 3 && 'hidden'} text-[70%] px-2 py-1 hover:bg-orange-300`}>L3</button>
                                                                            <button onClick={() => moverALectra(lectra, d.idPapa, 4, d?.id)} className={`${lectra == 4 && 'hidden'} text-[70%] px-2 py-1 hover:bg-orange-300`}>L4</button>
                                                                        </div>
                                                                    </div>
                                                                }))}
                                                            </div>
                                                        })}
                                                    </div>
                                                </div>
                                        },
                                        // {
                                        //     key: '2',
                                        //     label: 'Prensa/Otros',
                                        //     children: <div className='w-full'>
                                        //         <div className='flex flex-col gap-2 w-[300px]'>

                                        //             <div className='flex flex-col gap-2'>
                                        //                 {isLoadingPendientesPlan && <div className='flex items-center justify-center'><Loader /></div>}

                                        //                 {!isLoadingPendientesPlan && otrosDados?.map((pend, idx) => {
                                        //                     return <div key={`otda_${idx}`} className='flex items-center gap-0 border-b-2'>

                                        //                         <span className='text-base font-bold px-2 block w-full'>{pend.dado}</span>
                                        //                         <div className='flex items-center justify-between gap-1 w-full'>
                                        //                             <button className='bg-transparent text-blue-600'>SOLICITAR</button>
                                        //                         </div>
                                        //                     </div>

                                        //                 })}
                                        //             </div>

                                        //         </div>
                                        //     </div>
                                        // },
                                        {
                                            key: '3',
                                            label: 'Tablero',
                                            children: <TableroResultadosCorte fechaConsulta={getValues("fecha")} dadosPlan={dadosPlan} />
                                        }
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div >
    )
}
