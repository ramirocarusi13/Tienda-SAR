import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { FaStopwatch } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { DatePicker, IconButton, Input, InputNumber, Table } from 'rsuite';
import { getPlanHoraHora, savePlanHoraHora } from '../services/HoraHoraService';
import ModalParadaLineaHoraHora from './ModalParadaLineaHoraHora';
import SelectModelo from './SelectModelo';

const { Column, HeaderCell, Cell, ColumnGroup } = Table;
const defaultData = [
    {
        id: 1,
        intervalo: '06:12 - 07:00',
        plan_hora: '18',
        plan_acumulado: '18'
    },
    {
        id: 2,
        intervalo: '07:00 - 08:20',
        plan_hora: '26',
        plan_acumulado: '44'
    },
    {
        id: 3,
        intervalo: '08:20 - 09:00',
        plan_hora: '15',
        plan_acumulado: '59'
    },
    {
        id: 4,
        intervalo: '09:00 - 10:00',
        plan_hora: '23',
        plan_acumulado: '82'
    },
    {
        id: 5,
        intervalo: '10:00 - 10:50',
        plan_hora: '18',
        plan_acumulado: '100'
    },
    {
        id: 6,
        intervalo: '10:50 - 12:20',
        plan_hora: '22',
        plan_acumulado: '122'
    },
    {
        id: 7,
        intervalo: '12:20 - 13:00',
        plan_hora: '15',
        plan_acumulado: '137'
    },
    {
        id: 8,
        intervalo: '13:00 - 14:00',
        plan_hora: '18',
        plan_acumulado: '155'
    },
    {
        id: 9,
        intervalo: '14:00 - 15:05',
        plan_hora: '25',
        plan_acumulado: '180'
    }
];

const styles = `
.table-cell-editing .rs-table-cell-content {
  padding: 2px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
`

export default function TableEditHoraHora({ datosTablero }) {
    const [data, setData] = useState(defaultData);
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isVisibleModalParada, setIsVisibleModalParada] = useState(false)
    const [idInformarParada, setIdInformarParada] = useState(null)

    const { turno, linea, fecha, nombreTurno } = datosTablero

    const fectchPlan = async () => {
        setIsLoading(true)
        const response = await getPlanHoraHora(datosTablero)

        if (!response.error) {
            setData(response.data)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        fectchPlan()
    }, [turno, linea, fecha, nombreTurno])

    useEffect(() => {
        if (!isVisibleModalParada) {
            fectchPlan()
        }
    }, [isVisibleModalParada])

    const handleChange = (id, key, value) => {
        const nextData = Object.assign([], data);
        const pItem = nextData.find(item => item.id === id)
        pItem[`${key}_prev`] = pItem[key];
        nextData.find(item => item.id === id)[key] = value;

        // console.log(nextData)
        setData(nextData);
    };

    const handleEdit = async id => {
        let nextData = Object.assign([], data);
        const activeItem = nextData.find(item => item.id === id);

        if (activeItem.status == 'EDIT') {
            setIsSaving(true)
            const data = await savePlanHoraHora(activeItem)

            if (!data?.error) {
                nextData = data?.data
            }

            setIsSaving(false)
        }

        setData(nextData);
        activeItem.status = activeItem.status ? null : 'EDIT';
    };

    const handleCancel = id => {

        const nextData = Object.assign([], data);
        const activeItem = nextData.find(item => item.id === id);
        activeItem.status = null;

        //DEBO TOMAR LOS VALORES PREV
        activeItem.modelo = activeItem?.modelo_prev
        activeItem.real = activeItem?.real_prev
        activeItem.piezas_reparadas = activeItem?.piezas_reparadas_prev
        activeItem.piezas_scrap = activeItem?.piezas_scrap_prev
        // console.log(activeItem)
        setData(nextData);
    }

    return (
        <div className='w-full'>
            <style>{styles}</style>

            <ModalParadaLineaHoraHora
                isVisible={isVisibleModalParada}
                setIsVisible={setIsVisibleModalParada}
                idEdit={idInformarParada}
                dataSource={data}
            />
            <Table loading={isLoading} headerHeight={60} rowHeight={40} height={450} bordered data={data}  >
                <Column fixed='left'>
                    <HeaderCell>Intervalo</HeaderCell>
                    <Cell dataKey="intervalo" dataType="string" />
                </Column>

                <Column fixed='left' width={50}>
                    <HeaderCell>
                        <div className='flex flex-col'>
                            <span>Plan</span>
                            <span>Hora</span>
                        </div>
                    </HeaderCell>
                    <Cell dataKey="plan" dataType="string" />
                </Column>

                <Column width={50} fixed='left'>
                    <HeaderCell>
                        <div className='flex flex-col'>
                            <span>Plan</span>
                            <span>Acum.</span>
                        </div>
                    </HeaderCell>
                    <Cell dataKey="plan_acumulado" dataType="string" />
                </Column>

                <Column width={150}>
                    <HeaderCell>Modelo</HeaderCell>
                    <EditableCell
                        linea={linea}
                        dataKey="modelo"
                        dataType="string"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    // onSave={handleSave}
                    />
                </Column>

                <Column width={80}>
                    <HeaderCell>Real</HeaderCell>
                    <EditableCell
                        dataKey="real"
                        dataType="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                        className='bg-red-500'
                    />

                    {/* <ValueCell
                        dataKey="real"
                        dataType="number"
                        onChange={handleChange}
                        editable={true}
                        onEdit={handleEdit}
                    // keyCompare
                    /> */}
                </Column>

                <Column width={60}>
                    <HeaderCell>Acum.</HeaderCell>
                    <ValueCell
                        dataKey="acumulado"
                        dataType="number"
                        keyCompare='plan_acumulado'
                    />
                </Column>

                <ColumnGroup header="Diferencia" align='center' verticalAlign='middle'>
                    <Column width={100} align='center' colSpan={2}>
                        <HeaderCell>Hora</HeaderCell>
                        {/* <Cell
                            dataKey="diferencia"
                            dataType="number"
                            className="text-red-500 font-bold"
                        /> */}

                        <ValueCell
                            dataKey="diferencia"
                            dataType="number"
                        />
                    </Column>

                    <Column width={100} align='center'>
                        <HeaderCell>Acumulada</HeaderCell>
                        {/* <Cell
                            dataKey="diferencia_acumulado"
                            dataType="number"
                        /> */}

                        <ValueCell
                            dataKey="diferencia_acumulado"
                            dataType="number"
                        />
                    </Column>
                </ColumnGroup>

                <Column width={100} align='center'>
                    <HeaderCell>
                        <div className='flex flex-col text-center'>
                            <span>Piezas</span>
                            <span>reparadas</span>
                        </div>
                    </HeaderCell>
                    <EditableCell
                        className='text-center'
                        dataKey="piezas_reparadas"
                        dataType="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    />
                </Column>

                <Column width={100} align='center'>
                    <HeaderCell>
                        <div className='flex flex-col text-center'>
                            <span>Piezas</span>
                            <span>scrap</span>
                        </div>
                    </HeaderCell>
                    <EditableCell
                        className='text-center'
                        dataKey="piezas_scrap"
                        dataType="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    />
                </Column>

                <Column width={50} align='center'>
                    <HeaderCell>RRHH</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="RRHH"
                        dataType="number"
                    />
                </Column>

                <Column width={50} align='center'>
                    <HeaderCell>KZN</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="KZN"
                        dataType="number"
                    />
                </Column>

                <Column width={50} align='center'>
                    <HeaderCell>QC</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="QC"
                        dataType="number"
                    />
                </Column>

                <Column width={50} align='center'>
                    <HeaderCell>MH</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="MH"
                        dataType="number"
                    />
                </Column>

                <Column width={50} align='center'>
                    <HeaderCell>MTTO</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="MTTO"
                        dataType="number"
                    />
                </Column>



                <Column fixed={'right'} width={140}>
                    <HeaderCell></HeaderCell>
                    <ActionCell isSaving={isSaving} setIdInformarParada={setIdInformarParada} setIsVisibleModalParada={setIsVisibleModalParada} dataKey="id" onEdit={handleEdit} onRemove={handleCancel} />
                </Column>
            </Table >
        </div>
    );
};

function toValueString(value, dataType) {
    return dataType === 'date' ? value?.toLocaleDateString() : value;
}

const fieldMap = {
    string: Input,
    number: InputNumber,
    date: DatePicker
};

const EditableCell = ({ rowData, dataType, dataKey, onChange, onEdit, ...props }) => {
    const editing = rowData.status === 'EDIT';

    const Field = fieldMap[dataType];
    const value = rowData[dataKey];
    const text = toValueString(value, dataType);

    console.log(linea)
    return (
        <Cell
            {...props}
            className={editing ? 'table-cell-editing' : ''}
        // onDoubleClick={() => {
        //     onEdit?.(rowData.id);
        // }}
        >
            {dataKey == 'modelo' ?
                (editing ?
                    // ((linea == '7' || linea == '8') ?
                    // <SelectDoorTrim defaultValue={value} onChange={value => { onChange?.(rowData.id, dataKey, value); }} />
                    <SelectModelo line={rowData} multiple={true} defaultValue={value} onChange={value => { onChange?.(rowData.id, dataKey, value); }} />
                    : text) :
                editing ? (
                    <Field
                        defaultValue={value}
                        onChange={value => {
                            onChange?.(rowData.id, dataKey, value);
                        }}
                    />
                ) : (
                    text
                )
            }

            {/* {dataKey == 'modelo' ?
                (editing ?
                    <SelectModelo defaultValue={value} onChange={value => {
                        onChange?.(rowData.id, dataKey, value);
                    }} />
                    : text) :
                editing ? (
                    <Field
                        defaultValue={value}
                        onChange={value => {
                            onChange?.(rowData.id, dataKey, value);
                        }}
                    />
                ) : (
                    text
                )
            } */}

        </Cell>
    );
};

const ValueCell = ({ rowData, editable = false, keyCompare = null, valueCompare = 0, ...props }) => {
    let className;

    if (keyCompare) {
        className = parseInt(rowData[keyCompare]) > parseInt(rowData[props.dataKey]) ? 'bg-red-100 text-red-700 font-semibold text-center' : 'bg-green-100 text-green-700 font-semibold text-center';
    } else {
        className = rowData[props.dataKey] < valueCompare ? 'bg-red-100 text-red-700 font-semibold text-center' : 'bg-green-100 text-green-700 font-semibold text-center';
    }

    return (
        <Cell {...props} className={className}>
            {rowData[props.dataKey]}
        </Cell>
    );
};

const ActionCell = ({ rowData, dataKey, onEdit, onRemove, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px' }}>

            {(rowData.status === 'EDIT' && !props?.isSaving) &&
                <IconButton
                    appearance="subtle"
                    icon={<MdOutlineCancel className='!text-xl text-red-500' />}
                    onClick={() => {
                        onRemove(rowData.id);
                    }}
                />
            }

            <IconButton
                appearance="subtle"
                icon={rowData.status === 'EDIT' ? (props?.isSaving ? <Spin /> : <FiSave className='!text-xl text-blue-500' />) : <CiEdit className='!text-xl text-orange-500' />}
                onClick={() => {
                    onEdit(rowData.id);
                }}
            />

            {rowData.status != 'EDIT' &&
                <button
                    onClick={() => {
                        props?.setIsVisibleModalParada(true)
                        props?.setIdInformarParada(rowData.id)
                    }}
                    className='text-xs p-0 flex items-center gap-1 px-1 bg-lime-200'>
                    <FaStopwatch /> Parada
                </button>
            }
            {/* <IconButton
                appearance="subtle"
                icon={<FaStopwatch className='!text-xl' />}
                onClick={() => {

                }}
            /> */}
        </Cell>
    );
};