
import { useEffect, useState } from 'react'
import { fetchAusentismoHoraHora, setAusentismoHoraHora } from '../../services/HoraHoraService'
import { formatDate } from '../../utils/Utils'
import TableAusentismo from './TableAusentismo'
import { jerarquias } from '../../utils/Constants'
import { Spin } from 'antd'


export default function TablaAusentismoHoraHora({ datosTablero }) {

    const { fecha, nombreTurno } = datosTablero
    const [users, setUsers] = useState([])
    const [usersLineas, setUsersLineas] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchUsers = async () => {
        setIsLoading(true)
        const data = await fetchAusentismoHoraHora({ turno: nombreTurno, fecha: fecha })
        const res = data?.data

        setUsers(res.users)
        setUsersLineas(res.users_lineas)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchUsers()
    }, [datosTablero])

    const saveAusentismoHoraHora = async () => {
        setIsLoading(true)
        const data = await setAusentismoHoraHora({ data: users, userLineas: usersLineas, fecha: fecha, turno: nombreTurno })
        setIsLoading(false)
    }

    return (
        <div className='w-full '>
            <button className='w-full text-xl py-2 bg-green-300 mb-1' onClick={() => saveAusentismoHoraHora()}>GUARDAR CAMBIOS</button>
            <div className="flex items-center w-full justify-between bg-[#4f81bd] py-0 px-2 text-white">
                <span className="text-3xl font-semibold">TURNO:  {nombreTurno == 'A' ? 'AMARILLO' : 'BLANCO'}</span>
                <span className="text-3xl font-bold">CONTROL AUSENTISMO PRODUCCIÓN</span>
                <span className="text-3xl font-semibold">FECHA: {formatDate(fecha, false)}</span>
            </div>

            {isLoading && <div className='flex items-center w-full justify-center my-4'><Spin size='large' /></div>}
            <div className={`grid grid-cols-2 w-full ${isLoading && 'hidden'}`}>
                <div className='flex flex-col gap-2 w-full '>

                    <div className='flex flex-col gap-2 w-full'>
                        {/* <span className='text-center font-semibold text-xl '>CUT</span> */}
                        <TableAusentismo users={users?.filter(u => u?.area == 'CORTE')} setUsers={setUsers} headerName='CUT' />
                    </div>

                    <div className='flex flex-col gap-2 w-full'>
                        {/* <span className='text-center font-semibold text-xl'>MH</span> */}
                        <TableAusentismo users={users?.filter(u => u?.area == 'MH')} setUsers={setUsers} headerName='MH' />
                    </div>

                    <TableAusentismo users={users?.filter(u => u?.area == 'DOJO')} setUsers={setUsers} headerName='DOJO' />

                </div>

                <div className='w-full'>
                    <div className='flex flex-col gap-2 w-full'>
                        {/* <span className='text-center font-semibold text-xl'>SEW</span> */}
                        <TableAusentismo users={users?.filter(u => { return u?.area == 'COSTURA' && (u?.rol == jerarquias.GROUP_LEADER || u?.rol == jerarquias.TEAM_LEADER || u?.rol == jerarquias.UTILITY) })} setUsers={setUsers} headerName='SEW' withHeader={true} />
                        {/* <TableAusentismo users={users?.filter(u => u?.area == 'COSTURA' && u?.rol == jerarquias.TEAM_LEADER)} setUsers={setUsers} withHeader={false} /> */}
                        {/* <TableAusentismo users={users?.filter(u => u?.area == 'COSTURA' && u?.rol == jerarquias.UTILITY)} setUsers={setUsers} withHeader={false} /> */}

                        {/* <span>SEP</span> */}
                        {/* {lineas?.map((linea, idx) => { */}
                        {/* return <div key={`linea_${idx}`} className='w-full flex flex-col gap-1'> */}
                        {/* <span className='w-full text-center font-semibold bg-sky-700 text-xl text-white'>{linea.nombre}</span> */}
                        <TableAusentismo linea={true} headerName='M1' users={usersLineas?.filter(u => u?.operacion != null)?.sort((a, b) => { return a.linea_id - b.linea_id })?.sort((a, b) => { return a.id - b.id })} setUsers={setUsersLineas} withHeader={true} />
                        {/* <TableAusentismo linea={true} headerName='M1' users={usersLineas?.filter(u => { return u?.area == 'COSTURA' && u?.rol == jerarquias.MEMBER && u?.titular == 1 })?.sort((a, b) => { return a.linea_id - b.linea_id })} setUsers={setUsersLineas} withHeader={true} /> */}
                        {/* </div> */}
                        {/* <span className='w-full text-center font-semibold bg-sky-700 text-xl text-white'>S1</span>
                            <TableAusentismo users={users?.filter(u => u?.area == 'COSTURA' && u?.rol == jerarquias.MEMBER && u.linea_id == 1 && u?.sublinea == 1 && u?.titular == 1)} setUsers={setUsers} withHeader={false} /> */}
                        {/* })} */}
                    </div>



                </div>
            </div>
        </div>
    )
}
