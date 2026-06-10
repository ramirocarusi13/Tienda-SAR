import Loader from '@components/Loader';
import SelectUseForm from "@components/SelectUseForm";
import useKanban from '@hooks/useKanban';
import useModels from "@hooks/useModels";
import { TIPO_KANBAN, estados, meses } from '@utils/Constants';
import { formatDate } from '@utils/Utils';
import { Table, Tag, notification } from 'antd';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';


export default function ListKanbanPage() {
    const { isLoading, response, getData, changeStatus } = useKanban(false)
    const { isLoading: isLoadingModels, response: models } = useModels()
    const { register, control, handleSubmit, setValue, reset, getValues, formState: { errors } } = useForm();
    const [kanbans, setKanbans] = useState(null)
    const [filtered, setFiltered] = useState(null)
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        fetchKanbans()
    }, [])

    const fetchKanbans = async () => {
        const data = await getData(true)
        setKanbans(data)
        setFiltered(data)

        // handleSubmit(filterKanbans)()
    }

    const filterKanbans = async (data) => {
        // console.log(data)
        let response = kanbans;

        // console.log(response)

        if (data?.estado) {
            response = response?.filter(k => parseInt(k?.estado?.estado_id) == parseInt(data?.estado))
        }

        if (data?.modelo) {
            response = response?.filter(k => k?.modelo?.id == data?.modelo)
        }

        setFiltered(response)
    }

    const changeStatusKanban = async (kanbanId, codigo) => {
        const estado = getValues(`estado_${kanbanId}`)
        if (!estado) {
            api.error({
                message: `Alerta`,
                description: <span >Debe seleccionar un estado</span>,
                placement: "topRight"
            });
            return
        }

        //CAMBIO ESTADO
        const response = await changeStatus({
            status: estado,
            linea: null,
            kanban: codigo.replaceAll("'", "-"),
            fuerza: true
        })

        if (response?.error) {
            api.error({ message: `Alerta`, description: response?.message, placement: "topRight" });
            return
        }

        setValue(`estado_${kanbanId}`, null)
        await fetchKanbans()
        // handleSubmit(filterKanbans)()
    }

    const columns = [
        {
            title: 'Kanban',
            dataIndex: 'codigo',
            key: 'codigo',
            // render: (text) => <a>{text}</a>,}
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            render: (_, record) => {
                if (record.codigo.substring(0, 1) == TIPO_KANBAN.PRODUCTIVO) {
                    return <Tag color="blue-inverse">Productivo</Tag>
                } else if (record.codigo.substring(0, 1) == TIPO_KANBAN.REEMPLAZO) {
                    return <Tag color="green-inverse">Reemplazo</Tag>
                }
            },
        },
        {
            title: 'Mes',
            dataIndex: 'mes',
            key: 'mes',
            render: (text) => {
                if (!text) {
                    return ""
                }

                return meses.filter(m => m.value == text)[0].label
            }
        },

        {
            title: 'Modelo',
            dataIndex: 'modelo',
            key: 'modelo',
            render: (_, record) => record?.modelo?.nombre
        },
        {
            title: 'Fecha',
            dataIndex: 'fecha',
            key: 'fecha',
            render: (text) => formatDate(text),
        },
        {
            title: 'Estado',
            key: 'estado',
            render: (_, record) => (
                <Tag color="blue">{record?.estado?.estado?.descripcion}</Tag>
            ),
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <div className='flex items-start gap-2'>
                    <SelectUseForm
                        label=""
                        name={`estado_${record.id}`}
                        size="default"
                        placeholder="Cambiar estado"
                        register={register}
                        errors={errors}
                        className="w-[200px]"
                        search={true}
                        control={control}
                        options={[
                            { value: estados.GENERADO, label: 'Generado' },
                            { value: estados.EN_CORTE, label: 'En Corte' },
                            { value: estados.EN_BUFFER_CORTE, label: 'En Buffer de Corte' },
                            { value: estados.EN_BUFFER, label: 'En Buffer' },
                            { value: estados.SUB_ASSY, label: 'Pre Ensamble' },
                            { value: estados.COSTURA, label: 'Ensamble' },
                            { value: estados.CALIDAD, label: 'Calidad' },
                            { value: estados.FINALIZADO, label: 'Finalizado' },
                            { value: estados.DEFECTO, label: 'Defecto' },
                            { value: estados.RECHAZADO, label: 'Rechazado' },
                            { value: estados.APROBADO, label: 'Aprobado' },
                            { value: estados.REVISION, label: 'Revisión' },
                            { value: estados.PLANIFICADO, label: 'Planificado' },
                            { value: estados.EN_REVISION_CORTE, label: 'En Revisión Corte' },
                            { value: estados.EN_PLANIFICACION, label: 'En Planificación' },
                        ]}
                    />
                    <button onClick={() => {
                        changeStatusKanban(record?.id, record?.codigo)
                    }} className='text-sm p-0 bg-blue-600 px-2 py-1'>CAMBIAR</button>
                </div>
            )
        }
    ];

    return (
        <div className='flex w-full items-center flex-col'>
            {contextHolder}

            <div className='w-full flex items-center gap-2' >
                <SelectUseForm
                    label="Estado"
                    name="estado"
                    size="default"
                    placeholder="Seleccione un estado"
                    register={register}
                    errors={errors}
                    // rules={{ required: "Debe seleccionar el material" }}
                    className="w-full"
                    search={true}
                    control={control}
                    options={[
                        { value: estados.GENERADO, label: 'Generado' },
                        { value: estados.EN_CORTE, label: 'En Corte' },
                        { value: estados.EN_BUFFER_CORTE, label: 'En Buffer de Corte' },
                        { value: estados.EN_BUFFER, label: 'En Buffer' },
                        { value: estados.SUB_ASSY, label: 'Pre Ensamble' },
                        { value: estados.COSTURA, label: 'Ensamble' },
                        { value: estados.CALIDAD, label: 'Calidad' },
                        { value: estados.FINALIZADO, label: 'Finalizado' },
                        { value: estados.DEFECTO, label: 'Defecto' },
                        { value: estados.RECHAZADO, label: 'Rechazado' },
                        { value: estados.APROBADO, label: 'Aprobado' },
                        { value: estados.REVISION, label: 'Revisión' },
                        { value: estados.PLANIFICADO, label: 'Planificado' },
                        { value: estados.EN_REVISION_CORTE, label: 'En Revisión Corte' },
                        { value: estados.EN_PLANIFICACION, label: 'En Planificación' },
                    ]}
                />

                <SelectUseForm
                    label="Modelo"
                    size="default"
                    name="modelo"
                    placeholder="Seleccione un modelo"
                    register={register}
                    errors={errors}
                    // rules={{ required: "Debe seleccionar el modelo" }}
                    className="w-full "
                    search={true}
                    loading={isLoadingModels}
                    control={control}
                    options={models.map((model) => { return { value: model.id, label: model.nombre } })}
                />

                <button onClick={handleSubmit(filterKanbans)} className='text-sm p-1 mt-6 px-10 bg-blue-500'>Buscar</button>
            </div>

            <Table
                locale={{
                    emptyText: "No se encontraron registros",
                }}
                pagination={{
                    pageSize: 50,
                    defaultPageSize: 50
                }}
                columns={columns}
                dataSource={filtered}
                loading={{
                    indicator: <Loader />,
                    spinning: isLoading
                }}
                rowKey={(item) => item.id}
                size="small"
                className='w-full'
            />
        </div>
    )
}

