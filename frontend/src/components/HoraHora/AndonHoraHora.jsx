import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getTurnoActual } from '../../services/UserService';
import HoraHoraTurno from './HoraHoraTurno';

export default function AndonHoraHora() {
    const [searchParams] = useSearchParams();

    const linea = searchParams.get('linea');
    // const [turnos, setTurnos] = useState(null)

    const fetchTurnoActual = async () => {
        const data = await getTurnoActual()
        if (data?.turno) {
            return [
                data?.turno,
                data?.turno == "A" ? "B" : "A"
            ]
        } else {
            return []
        }
    }

    // useEffect(() => {
    //     fetchTurnoActual()
    // }, [])

    const query = useQuery({ queryKey: [`turno_actual`], refetchIntervalInBackground: true, queryFn: fetchTurnoActual, staleTime: 1000, refetchInterval: 120000 })


    return (
        <div className='flex flex-col gap-0 w-full'>

            <div className='bg-gray-700 text-white py-3 w-full text-center items-center justify-between'>
                <span className='font-semibold text-5xl'>M{linea} - </span>
                <span className='font-semibold text-5xl'>TABLERO DE PRODUCCIÓN</span>
            </div>

            {query?.data?.length > 0 &&
                <div className='flex flex-col gap-4 w-full'>
                    {query?.data?.map((t, idx) => {
                        // console.log("J", t, idx)
                        return <HoraHoraTurno key={`turno_${idx}`} pos={idx} turno={t} linea={linea} subtitulo={`${idx == 0 ? 'ACTUAL' : 'ANTERIOR'}`} />
                    })}
                    {/* <HoraHoraTurno turno="A" linea={linea} /> */}
                </div>
            }
        </div>
    )
}
