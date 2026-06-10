import Loader from "@components/Loader"
import { Form, Select } from 'antd'
import { useState } from 'react'
import TableModificarTiempos from '../../components/Corte/TableModificarTiempos'
import { actualizaCorteTiempos, getPlanificacion } from "../../services/LectraService"
import { formatDate } from '../../utils/Utils'

const lectras = [
    {
        label: 'LECTRA 1',
        value: 1
    },
    {
        label: 'LECTRA 2',
        value: 2
    },
    {
        label: 'LECTRA 3',
        value: 3
    },
    {
        label: 'LECTRA 4',
        value: 4
    }
]

export default function ModificarTiemposPage() {
    const [form] = Form.useForm()
    const [dataDados, setDataDados] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // const watchLectra = Form.useWatch('lectra', form)

    const handleSubmit = async (data) => {
        setIsLoading(true)
        const now = formatDate(new Date())

        const response = await getPlanificacion({ fecha: now, turno: 'TM' })

        const dataLectra = response?.data?.filter(r => r?.lectra == data?.lectra)[0]?.datos?.map(item => {
            return {
                lectra: data.lectra,
                dado: item.dado,
                material: item?.material?.nombre,
                duracion: item?.[`t_lectra${data.lectra}`],
                fin_estimado: item?.fin_estimado,
                inicio: item?.inicio,
                fin: item?.fin,
                demora: item?.demora,
                id: item?.id,
                edito: false
            }
        })

        setDataDados(dataLectra)
        setIsLoading(false)
    }

    const guardaCambiosTiempos = async () => {
        // console.log(dataDados)
        setIsLoading(true)
        const data = await actualizaCorteTiempos({ items: dataDados?.filter(i => i?.edito == true) })
        // console.log(data)
        setIsLoading(false)

    }

    return (
        <div>

            <div className='flex items-center w-full'>
                <Form onFinish={handleSubmit} form={form} layout='vertical' className='flex gap-2 w-full items-center'>

                    <Form.Item
                        className='w-full'
                        label='Lectra'
                        rules={[{ required: true, message: 'Seleccione una lectra' }]}
                        name='lectra'
                    >
                        <Select
                            options={lectras.map((m) => { return { value: m?.value, label: m?.label } })}
                        />
                    </Form.Item>

                    {/* <Form.Item> */}
                    <button className='bg-blue-500'>CARGAR</button>
                    {/* </Form.Item> */}
                </Form>
            </div>

            {isLoading && <div className="w-full flex items-center justify-center flex-col"><Loader fontSize={50} /><span>CARGANDO</span></div>}

            <div className="w-full flex ">
                <button onClick={() => guardaCambiosTiempos()} className="bg-green-400">GUARDAR CAMBIOS</button>
            </div>

            <TableModificarTiempos plan={dataDados} setPlan={setDataDados} />
        </div>
    )
}
