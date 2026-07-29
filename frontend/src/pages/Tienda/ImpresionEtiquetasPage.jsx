import React from 'react'
import EtiquetaPieza from '@components/Tienda/EtiquetaPieza'
import Loader from '@components/Loader'
import { useReactToPrint } from 'react-to-print';
import { useMemo, useRef, useState } from 'react';
import { useEffect } from 'react';
import { getEtiquetas } from '@services/TiendaService';

const normalizar = (value) => (value ?? '').toString().toLowerCase().trim()

const uniqueOptions = (items, getValue, getLabel = getValue) => {
    const map = new Map()

    items.forEach((item) => {
        const value = getValue(item)
        const label = getLabel(item)

        if (value !== undefined && value !== null && value !== '' && label !== undefined && label !== null && label !== '') {
            map.set(value, label)
        }
    })

    return Array.from(map, ([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.toString().localeCompare(b.label.toString()))
}

export default function ImpresionEtiquetasPage() {

    const [etiquetas, setEtiquetas] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [filtros, setFiltros] = useState({
        modelo: '',
        pieza: '',
        parte: '',
        lado: '',
        buscar: '',
    })
    const handlePrint = useReactToPrint({ content: () => componentRef?.current, });

    const componentRef = useRef();

    const fetchEtiquetas = async (params = {}) => {
        setIsLoading(true)
        const data = await getEtiquetas(params)
        setEtiquetas(Array.isArray(data?.data) ? data.data : [])
        setIsLoading(false)
    }

    useEffect(() => {
        fetchEtiquetas()
    }, [])

    const modelos = useMemo(() => uniqueOptions(
        etiquetas,
        (e) => e.modelo?.id,
        (e) => e.modelo?.nombre
    ), [etiquetas])

    const piezas = useMemo(() => uniqueOptions(
        etiquetas.filter((e) => !filtros.modelo || e.modelo?.id?.toString() === filtros.modelo),
        (e) => e.id,
        (e) => e.codigo
    ), [etiquetas, filtros.modelo])

    const partes = useMemo(() => uniqueOptions(
        etiquetas.filter((e) => !filtros.modelo || e.modelo?.id?.toString() === filtros.modelo),
        (e) => e.parte?.id,
        (e) => e.parte?.codigo
    ), [etiquetas, filtros.modelo])

    const lados = useMemo(() => uniqueOptions(
        etiquetas,
        (e) => e.parte?.lado?.lado
    ), [etiquetas])

    const etiquetasFiltradas = useMemo(() => {
        const buscar = normalizar(filtros.buscar)

        return etiquetas.filter((etiqueta) => {
            const modeloId = etiqueta.modelo?.id?.toString()
            const piezaId = etiqueta.id?.toString()
            const parteId = etiqueta.parte?.id?.toString()
            const lado = etiqueta.parte?.lado?.lado

            const texto = normalizar([
                etiqueta.codigo,
                etiqueta.dado,
                etiqueta.modelo?.nombre,
                etiqueta.parte?.codigo,
                lado,
            ].join(' '))

            return (!filtros.modelo || modeloId === filtros.modelo)
                && (!filtros.pieza || piezaId === filtros.pieza)
                && (!filtros.parte || parteId === filtros.parte)
                && (!filtros.lado || lado === filtros.lado)
                && (!buscar || texto.includes(buscar))
        })
    }, [etiquetas, filtros])

    const onChangeFiltro = (field) => (event) => {
        const value = event.target.value

        setFiltros((prev) => ({
            ...prev,
            [field]: value,
            ...(field === 'modelo' ? { pieza: '', parte: '' } : {}),
        }))
    }

    const limpiarFiltros = () => {
        setFiltros({
            modelo: '',
            pieza: '',
            parte: '',
            lado: '',
            buscar: '',
        })
    }

    return (
        <div className="flex flex-col items-center gap-3 p-3" >
            <div className="print:hidden w-full flex flex-col gap-3 rounded border border-gray-300 bg-white p-3">
                <div className="flex flex-wrap items-end gap-3">
                    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-gray-600">Modelo</span>
                        <select value={filtros.modelo} onChange={onChangeFiltro('modelo')} className="border border-gray-300 px-2 py-2">
                            <option value="">Todos</option>
                            {modelos.map((modelo) => (
                                <option key={modelo.value} value={modelo.value}>{modelo.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex min-w-[220px] flex-1 flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-gray-600">Pieza</span>
                        <select value={filtros.pieza} onChange={onChangeFiltro('pieza')} className="border border-gray-300 px-2 py-2">
                            <option value="">Todas</option>
                            {piezas.map((pieza) => (
                                <option key={pieza.value} value={pieza.value}>{pieza.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex min-w-[180px] flex-1 flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-gray-600">Parte</span>
                        <select value={filtros.parte} onChange={onChangeFiltro('parte')} className="border border-gray-300 px-2 py-2">
                            <option value="">Todas</option>
                            {partes.map((parte) => (
                                <option key={parte.value} value={parte.value}>{parte.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex min-w-[120px] flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-gray-600">Lado</span>
                        <select value={filtros.lado} onChange={onChangeFiltro('lado')} className="border border-gray-300 px-2 py-2">
                            <option value="">Todos</option>
                            {lados.map((lado) => (
                                <option key={lado.value} value={lado.value}>{lado.label}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex min-w-[220px] flex-1 flex-col gap-1">
                        <span className="text-xs font-semibold uppercase text-gray-600">Buscar</span>
                        <input value={filtros.buscar} onChange={onChangeFiltro('buscar')} className="border border-gray-300 px-2 py-2" placeholder="Codigo, dado, modelo..." />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-gray-700">
                        {etiquetasFiltradas.length} etiquetas visibles de {etiquetas.length}
                    </span>
                    <div className="flex gap-2">
                        <button onClick={limpiarFiltros} className="border border-gray-400 px-5 py-2 font-semibold text-gray-700">LIMPIAR</button>
                        <button onClick={() => handlePrint()} disabled={etiquetasFiltradas.length === 0} className='bg-success px-10 py-2 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50'>IMPRIMIR</button>
                    </div>
                </div>
            </div>

            {isLoading && <Loader />}



            <div ref={componentRef} className='flex mt-2 flex-wrap print:flex print:ml-2 gap-1 w-full print:items-center print:justify-center'>
                {/* <div ref={componentRef} className='flex gap-0 items-center flex-wrap print:ml-5 print:mt-5'> */}

                {/* <EtiquetaPieza codigo={"I6-SFLE_240V-H-K4-01"} modelo={""} lado={""} /> */}

                {etiquetasFiltradas?.map((e) => (
                    <EtiquetaPieza key={e.id} codigo={e.codigo} modelo={e.modelo?.nombre} lado={e.parte?.lado?.lado} />
                ))}

                {/* <div className='flex items-center flex-col gap-2'>
                    <QRCode className="w-40 h-40 " value={"INGRESO"} />
                    <span className='font-bold text-4xl block w-full text-center'>INGRESO</span>
                </div>

                <div className='flex items-center flex-col gap-2'>
                    <QRCode className="w-40 h-40" value={"DESPACHO"} />
                    <span className='font-bold text-4xl block w-full text-center'>DESPACHO</span>
                </div>

                <div className='flex items-center flex-col gap-2'>
                    <QRCode className="w-40 h-40" value={"CANCELAR"} />
                    <span className='font-bold text-4xl block w-full text-center'>CANCELAR</span>
                </div> */}

            </div>
        </div>
    )
}
