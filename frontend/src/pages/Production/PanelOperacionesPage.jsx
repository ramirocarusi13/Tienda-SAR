import Loader from "@components/Loader";
import ContainerOperation from "@components/PanelOperaciones/ContainerOperation";
import MembersDisponibles from "@components/PanelOperaciones/MembersDisponibles";
import { useDragAndDrop } from "@hooks/useDragAndDrop";
import useLineaOperaciones from "@hooks/useLineaOperaciones";
import { useEffect, useState } from "react";
import { actualizarLinea } from "../../services/LineaOperacionesService";
import { jerarquias } from "../../utils/Constants";
import { getLineName } from "../../utils/Utils";


export default function PanelOperacionesPage() {

    const [filter, setFilter] = useState('')
    const [turno, setTurno] = useState("A")
    const [updatingLineas, setUpdatingLineas] = useState({})
    // const [isLoading, setIsLoading] = useState(false)

    const { isLoadingUsers, isDragging, listItems, handleSetDisponible, handleDragging, handleUpdateList, setEstadoInicial, fetchUsuarios, usersDisponible } = useDragAndDrop(turno)
    const { response: operaciones, getData, reasignarOperarios, isLoading } = useLineaOperaciones(true, true, turno)


    // console.log(listItems)

    useEffect(() => {
        if (operaciones) {
            setEstadoInicial(operaciones)
        }
    }, [operaciones, turno])

    const handleToggleLinea = async (lineaId, checked) => {
        const habilitado = checked ? 1 : 0
        if (turno == "A") {
            setEstadoInicial(prev => prev?.map(l => l.linea == lineaId ? { ...l, turno_amarillo: habilitado } : l))
        } else {
            setEstadoInicial(prev => prev?.map(l => l.linea == lineaId ? { ...l, turno_blanco: habilitado } : l))
        }
        // const prevHabilitado = listItems?.find(l => l.linea == lineaId)



        // setEstadoInicial(prev => prev?.map(l => l.linea == lineaId ? { ...l, habilitado } : l))
        setUpdatingLineas(prev => ({ ...prev, [lineaId]: true }))

        try {
            const res = await actualizarLinea({ linea_id: lineaId, turno, habilitado })
            if (res?.error) {
                throw new Error(res?.message || "Error al actualizar la linea")
            }
        } catch (error) {
            // setEstadoInicial(prev => prev?.map(l => l.linea == lineaId ? { ...l, habilitado: prevHabilitado } : l))
        } finally {
            setUpdatingLineas(prev => ({ ...prev, [lineaId]: false }))
        }
    }

    if (isLoading) {
        return <div className="w-full h-[90vh] flex flex-col gap-1 items-center justify-center">
            <Loader fontSize={100} />
            <span className="text-sm font-semibold">Cargando</span>
        </div>
    }

    // console.log(listItems)

    return (
        <div className="flex flex-col items-start w-full gap-2 ">

            <div className="flex items-center gap-2">

                <button onClick={() => setTurno("A")} className={`px-10 bg-yellow-300 ${turno == "A" && ' !border-2 border-black'}`}>AMARILLO</button>
                <button onClick={() => setTurno("B")} className={`px-10 bg-blue-300  ${turno == "B" && ' !border-2 border-black'}`}>BLANCO</button>

                <span className={`px-20 ml-10 ${turno == "A" ? 'bg-yellow-300' : 'bg-blue-300'} py-2 font-semibold rounded-md`}>TURNO {turno == "A" ? "AMARILLO" : "BLANCO"}</span>
            </div>

            <div className="flex items-start w-full gap-2 ">
                <div className="grid grid-cols-3 gap-4 w-full">
                    {listItems?.filter(l => l.linea != 0).map((l, idx) => (
                        <div key={`l${idx}`} className='w-full flex flex-col items-center border border-black pb-2'>
                            <span className={`text-center font-semibold text-sm block w-full ${turno == "A" ? 'bg-yellow-300' : 'bg-blue-300'} py-1`}>TL: {l?.teamLeader}</span>

                            <div className='bg-gray-300 border border-black w-[50%] flex items-center justify-between px-4 mt-2 '>
                                <span className='text-xl font-semibold'>{getLineName(l.linea)}</span>
                                <span className='font-semibold'>{l?.operaciones?.filter(i => i.operario != null)?.length}/{l?.operaciones?.filter(i => i.habilitado == 1)?.length}</span>
                                <span className='font-semibold'>TM</span>
                            </div>

                            <label className="flex items-center gap-2 text-sm font-semibold mt-2">
                                <input
                                    type="checkbox"
                                    checked={turno == "A" ? l.turno_amarillo == 1 : l.turno_blanco == 1}
                                    disabled={updatingLineas?.[l.linea]}
                                    onChange={(e) => handleToggleLinea(l.linea, e.target.checked)}
                                />
                                Habilitado para el turno
                            </label>

                            <div className='w-full mt-5'>
                                <div className='flex gap-6 items-start justify-between'>
                                    <div className='w-[50%] flex flex-col gap-2 items-start'>
                                        {l?.operaciones?.filter(i => parseInt(i.orden) < 7).map((item, idx) => {
                                            return <ContainerOperation
                                                turno={turno}
                                                item={{ ...item, linea: l.linea }}
                                                operation={item}
                                                key={idx}
                                                isDragging={isDragging}
                                                handleDragging={handleDragging}
                                                handleUpdateList={handleUpdateList}
                                                handleSetDisponible={handleSetDisponible}
                                            />
                                        })}
                                    </div>

                                    <div className='w-[50%] flex flex-col gap-2 items-start'>
                                        {l?.operaciones?.filter(i => parseInt(i.orden) > 6).map((item, idx) => {
                                            return <ContainerOperation
                                                turno={turno}
                                                item={{ ...item, linea: l.linea }}
                                                operation={item}
                                                key={idx}
                                                isDragging={isDragging}
                                                handleDragging={handleDragging}
                                                handleSetDisponible={handleSetDisponible}
                                                handleUpdateList={handleUpdateList}
                                            />
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-[15%] flex flex-col items-center gap-4">
                    <div className="w-full">
                        <span className="text-xl block text-center font-semibold w-full mb-2">TM Disponibles</span>
                        {usersDisponible?.length == 0 &&
                            <span className="block text-center pb-2 font-semibold text-red-400">No hay operadores disponibles</span>
                        }
                        <div className="flex flex-col h-[110%]">
                            <div className="mb-1">
                                <input value={filter} onChange={e => setFilter(e.target.value)} type="search" className="w-full border rounded-md p-2" placeholder="Buscar" />
                            </div>

                            {isLoadingUsers && <Loader />}
                            {!isLoadingUsers && usersDisponible?.sort((a, b) => a.rol - b.rol)?.filter(u => u.turno == turno && u.departamento == "PRODUCCION" && u.area == "COSTURA" && u.rol <= jerarquias.GROUP_LEADER)?.filter(u => u.email?.toUpperCase().indexOf(filter?.toUpperCase()) > -1)?.map((item, idx) => (
                                <MembersDisponibles
                                    item={{ ...item, linea: 0 }}
                                    key={idx}
                                    isDragging={isDragging}
                                    handleDragging={handleDragging}
                                    handleUpdateList={handleUpdateList}
                                />
                            ))}
                        </div>
                    </div>

                    {/* <div className="w-full ">
                    <span className="text-xl block text-center w-full mb-2">Ausentes</span>
                    <div className="flex flex-col items-center gap-1">
                        {ausentes.map((a, idx) => (
                            <div key={`ause_${idx}`} className={`w-full flex items-center h-[40px] bg-red-400 justify-center hover:cursor-default`}>
                                <img className="h-[40px]" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-IFVAnDFmPDjhijJijwlt_XvLuLh3FJV-Ug&usqp=CAU" />
                                <span className='text-xs font-semibold block text-center w-full '>{a}</span>
                            </div>
                        ))}
                    </div>
                </div> */}
                </div>
            </div >
        </div >
    )
}
