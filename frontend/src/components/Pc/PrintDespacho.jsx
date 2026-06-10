import React from 'react'
import { depositos } from "@utils/Constants";
import { formatDate, formatDateEn, getFullDay, getFullMonth } from '../../utils/Utils';

const getCurrentDate = () => {
    let date = new Date()
    // date = formatDate(formatDateEn(date))
    date = `${getFullDay(date, true)}/${getFullMonth(date)}/${date.getFullYear()}`
    return date
}

export default function PrintDespacho({ componentRef, run, posicionesSeleccionadas }) {
    return (
        <div ref={componentRef} className=" w-full  p-4 print:flex flex-col justify-between h-screen hidden">
            <div className="flex flex-col min-h-[29.7cm]">
                <div className="flex items-center w-full mb-2 p-2 justify-between border-gray-300 border">
                    <span className="font-semibold text-md text-2xl">HOJA DE PREPARACIÓN</span>
                    <span className="block text-center font-bold text-5xl ">RUN {run}</span>
                    <span className="font-semibold text-md text-2xl">FECHA: {getCurrentDate()}</span>
                </div>

                <div className="flex flex-col justify-start items-start h-full mt-2">
                    <div className="w-full border-r border-gray-300">
                        <span className="text-3xl font-bold text-black border-b border-gray-300 py-2 block w-full text-center">RETIRAR DE DOLLYS</span>

                        <div className="grid grid-cols-3 items-start gap-2 mt-2 p-2">
                            {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.DOLLYS)?.map((i, idx) => (
                                <span key={`km1_${idx}`} className="font-semibold text-lg border-b border-gray-400 border-r w-full block">{i.modelo} - {i.kanban.codigo}</span>
                            ))}
                        </div>
                    </div>

                    {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.TEMPORAL_A)?.length > 0 &&
                        <div className="w-full border-r border-gray-300">
                            <span className="text-3xl font-bold text-black border-b border-gray-300 py-2 block w-full text-center">RETIRAR DE TEMPORAL A</span>

                            <div className="grid grid-cols-3 items-start gap-2 mt-2 p-2">
                                {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.TEMPORAL_A)?.map((i, idx) => (
                                    <span key={`km2_${idx}`} className="font-semibold text-lg border-b border-gray-400 border-r w-full block">{i.modelo} - {i.kanban.codigo}</span>
                                ))}
                            </div>
                        </div>
                    }

                    {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.TEMPORAL_B)?.length > 0 &&
                        <div className="w-full border-r border-gray-300">
                            <span className="text-3xl font-bold text-black border-b border-gray-300 py-2 block w-full text-center">RETIRAR DE TEMPORAL B</span>

                            <div className="grid grid-cols-3 items-start gap-2 mt-2 p-2">
                                {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.TEMPORAL_B)?.map((i, idx) => (
                                    <span key={`km2_${idx}`} className="font-semibold text-lg border-b border-gray-400 border-r w-full block">{i.modelo} - {i.kanban.codigo}</span>
                                ))}
                            </div>
                        </div>
                    }

                    <div className="w-full mt-2">
                        <span className="text-3xl font-bold text-black border-b border-gray-300 py-2 block w-full text-center">RETIRAR DE CAJA</span>

                        <div className="grid grid-cols-2 items-start gap-2 mt-2 p-2">
                            {posicionesSeleccionadas?.filter(pos => pos?.deposito == depositos.RACKS)?.map((i, idx) => (
                                <span key={`km_${idx}`} className="font-semibold text-lg border-b border-gray-400 border-r w-full block">{i.modelo} - {i.kanban.codigo} - POS : {i?.ubicacion?.nombre}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* <style>
                {`@media print {body{margin:auto; margin-bottom:5px; margin:0; margin-left:20px; padding-top:10px;} div.saltopagina{display:block; page-break-before:always}}`}

            </style> */}
            <div className="flex items-center w-full flex-col gap-4">
                {posicionesSeleccionadas?.map((p, idx) => (
                    <div key={`ka_${idx}`} className={`w-full flex flex-col items-center border-2 border-gray-400 h-[70mm] `}>
                        <div className="w-full flex gap-10 border-gray-400 border-b p-2">
                            <span className="text-xl font-semibold">FO-019-CEX</span>
                            <span className="text-xl font-semibold">Revisión: A</span>
                            <span className="text-xl font-semibold">Vigencia: 05/08/2022</span>
                        </div>

                        <span className="font-semibold text-9xl p-4">{p?.modelo}</span>

                        <div className="w-full flex items-center justify-between gap-10 border-gray-400 border-t p-2">
                            <span className="text-2xl font-semibold">Entrega a TBAR</span>
                            <span className="text-2xl font-semibold">RUN {run}</span>
                            <span className="text-2xl font-semibold">{getCurrentDate()}</span>
                        </div>


                    </div>

                ))}
            </div>
        </div>
    )
}
