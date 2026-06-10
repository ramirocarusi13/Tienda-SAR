import { DatePicker, Form, Select } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import 'rsuite/dist/rsuite.min.css';
import ModalAutorizarIngreso from '../../components/ModalAutorizarIngreso';
import TableEditHoraHoraDinamica from '../../components/TableEditHoraHoraDinamica';
import TableEditHoraHoraTactil from '../../components/TableEditHoraHoraTactil';
import { jerarquias } from '../../utils/Constants';
import { formatDateEn } from '../../utils/Utils';

export default function CargaHoraHoraPage() {
    // const { userData } = useAuth();
    const [isAdmin, setIsAdmin] = useState(false)
    const [userVigente, setUserVigente] = useState(null)

    const [form] = Form.useForm();

    const [datosTablero, setDatosTablero] = useState({
        linea: null,
        turno: null,
        fecha: null,
        nombreTurno: null
    })

    const validaCampos = (d) => {
        const fecha = new Date(d.fecha)

        const now = new Date()

        const diferenciaEnMilisegundos = now - fecha;
        const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

        setDatosTablero({
            linea: d.linea,
            turno: d.turno,
            fecha: formatDateEn(fecha),
            nombreTurno: d.turno_nombre,
            edita: diferenciaEnDias <= 2
        })
    }

    const clear = () => {
        setUserVigente(null)
    }

    useEffect(() => {
        if (userVigente?.email) {
            setIsAdmin(parseInt(userVigente?.rol) >= jerarquias.GROUP_LEADER)

            form.setFieldValue('turno_nombre', userVigente?.turno)
            form.setFieldValue('linea', userVigente?.linea?.linea_id)
        }

        form.setFieldValue("fecha", dayjs())
    }, [userVigente])

    return (
        <div className='relative flex flex-col items-center gap-2 w-full px-2 mt-4 h-screen'>

            <ModalAutorizarIngreso userVigente={userVigente} setUserVigente={setUserVigente} />
            <div className='w-full flex items-center  justify-between'>
                <div></div>
                <Form onFinish={validaCampos} form={form} layout='vertical' className='flex items-end gap-2 justify-start'>
                    <Form.Item
                        className='w-40'
                        label='Turno'
                        name={"turno"}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Seleccione un turno' }]}
                    >
                        <Select
                            size='large'
                            options={[
                                { label: 'Mañana', value: 'M' },
                                { label: 'Tarde', value: 'T' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        className='w-40'
                        label='Turno'
                        name={"turno_nombre"}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Seleccione un turno' }]}
                    >
                        <Select
                            size='large'
                            disabled={!isAdmin}
                            // value={userData?.turno}
                            options={[
                                { label: 'Amarillo', value: 'A' },
                                { label: 'Blanco', value: 'B' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        className='w-28'
                        label='Linea'
                        name={"linea"}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Seleccione una linea' }]}
                    >
                        <Select
                            size='large'
                            disabled={!isAdmin}
                            options={[
                                { label: 'M1', value: '1' },
                                { label: 'M2', value: '2' },
                                { label: 'M3', value: '3' },
                                { label: 'M4', value: '4' },
                                { label: 'M5', value: '5' },
                                { label: 'M6', value: '6' },
                                { label: 'M7', value: '7' },
                                { label: 'M8', value: '8' },
                                { label: 'M9', value: '9' },
                                { label: 'M10', value: '10' },
                                { label: 'M11', value: '11' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        className='w-30'
                        label='Fecha'
                        name={"fecha"}
                        style={{ margin: 0 }}
                        rules={[{ required: true, message: 'Seleccione una linea' }]}
                    >
                        <DatePicker size='large' format={'DD/MM/YYYY'} />
                    </Form.Item>

                    <button className='text-base px-10 py-3 bg-blue-300' >CARGAR</button>
                </Form>

                <button className='text-base px-10 py-3 bg-green-300 mt-5'>REPORTE</button>


            </div>

            {(datosTablero.linea && datosTablero.turno && datosTablero.nombreTurno && datosTablero.fecha) ?
                datosTablero?.linea == 7 ?
                    <TableEditHoraHoraDinamica datosTablero={datosTablero} />
                    :
                    <TableEditHoraHoraTactil datosTablero={datosTablero} />
                :
                <span className='text-4xl mt-10 w-full block px-2 bg-cyan-700 font-semibold py-4 text-center text-white'>SELECCIONE TURNO, LINEA Y FECHA PARA COMENZAR</span>
            }

            {!userVigente ?
                <div className='w-full bg-red-500 text-center  left-0 bottom-0 fixed z-20'>
                    <span className='block p-4 text-5xl text-white font-semibold'>NO HAY USUARIOS LOGUEADOS</span>
                </div>
                :
                <div className='w-full bg-yellow-400 text-center flex items-center justify-center gap-2 left-0 bottom-0 fixed z-20'>
                    <span className='block p-2 text-lg text-black font-semibold'>USUARIO ACTUAL : {userVigente?.email?.toUpperCase()}</span>
                    <button onClick={() => clear()} className='p-0 px-4 text-lg'>SALIR</button>
                </div>
            }
        </div>
    )
}
