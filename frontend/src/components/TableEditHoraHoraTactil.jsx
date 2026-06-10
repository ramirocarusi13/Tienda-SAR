import { InputNumber, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { FaStopwatch } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { DatePicker, IconButton, Input, Table } from 'rsuite';
import { getPlanHoraHora, savePlanHoraHora, setSoporteLinea } from '../services/HoraHoraService';
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


export default function TableEditHoraHoraTactil({ datosTablero }) {
    const [data, setData] = useState(defaultData);
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isVisibleModalParada, setIsVisibleModalParada] = useState(false)
    const [idInformarParada, setIdInformarParada] = useState(null)
    // const [soporte, setSoporte] = useState(0)
    // const [datos, setDatos] = useState({
    //     volumen: 0,
    //     volumenReal: 0,
    //     ef: 0,
    //     oa: 0,
    //     paradas: 0
    // })

    const { linea } = datosTablero

    const fectchPlan = async () => {
        setIsLoading(true)
        const response = await getPlanHoraHora(datosTablero)

        if (!response.error) {
            setData(response.data?.data)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        fectchPlan()
    }, [datosTablero])

    useEffect(() => {
        if (!isVisibleModalParada && idInformarParada) {
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
        // activeItem.piezas_reparadas = activeItem?.piezas_reparadas_prev
        activeItem.piezas_scrap = activeItem?.piezas_scrap_prev
        // console.log(activeItem)
        setData(nextData);
        fectchPlan()
    }

    return (
        <div className='w-full'>
            <style>{styles}</style>

            <ModalParadaLineaHoraHora
                isVisible={isVisibleModalParada}
                setIsVisible={setIsVisibleModalParada}
                idEdit={idInformarParada}
                dataSource={data}
                modoTactil={true}
            />

            <Table loading={isLoading} headerHeight={60} rowHeight={60} height={650} bordered={true} cellBordered={true} data={data} className='text-3xl !overflow-hidden'  >
                <Column fixed='left' width={200}>
                    <HeaderCell className='text-xl font-semibold text-black'>Intervalo</HeaderCell>
                    <Cell dataKey="intervalo" datatype="string" />
                </Column>

                <Column fixed='left' width={100} align='center'>
                    <HeaderCell className='!text-xl'>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Plan</span>
                            <span>Hora</span>
                        </div>
                    </HeaderCell>
                    <Cell dataKey="plan" datatype="string" />
                </Column>

                <Column width={100} fixed='left' align='center'>
                    <HeaderCell className='!text-xl' align='center'>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Plan</span>
                            <span>Acum.</span>
                        </div>
                    </HeaderCell>
                    <Cell dataKey="plan_acumulado" datatype="string" />
                </Column>

                <Column width={250}>
                    <HeaderCell className='text-xl font-semibold text-black'>Modelo</HeaderCell>
                    <EditableCell
                        dataKey="modelo"
                        datatype="string"
                        onChange={handleChange}
                        onEdit={handleEdit}
                        linea={linea}
                    />
                </Column>

                <Column width={110} align='center'>
                    <HeaderCell className='text-xl font-semibold text-black'>
                        <div className='flex flex-col text-center'>
                            <span>Real</span>
                        </div>
                    </HeaderCell>
                    <EditableCell
                        dataKey="real"
                        datatype="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                        className='bg-red-500'
                    />
                </Column>

                <Column width={100}>
                    <HeaderCell className='text-xl font-semibold text-black'>Acum.</HeaderCell>
                    <ValueCell
                        dataKey="acumulado"
                        datatype="number"
                        keyCompare='plan_acumulado'
                    />
                </Column>

                <Column width={100} align='center' colSpan={2}>
                    <HeaderCell className='text-xl'>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Dif.</span>
                            <span>Hora.</span>
                        </div>
                    </HeaderCell>

                    <ValueCell
                        dataKey="diferencia"
                        datatype="number"
                    />
                </Column>

                <Column width={100} align='center' className='text-xl'>
                    <HeaderCell>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Dif.</span>
                            <span>Acum.</span>
                        </div>
                    </HeaderCell>

                    <ValueCell
                        dataKey="diferencia_acumulado"
                        datatype="number"
                    />
                </Column>

                <Column width={110} align='center' className='!text-xl'>
                    <HeaderCell className='!text-xl'>
                        <div className='flex flex-col !font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Piezas</span>
                            <span>reparadas</span>
                        </div>
                    </HeaderCell>

                    {/* <Cell dataKey="piezas_reparadas" datatype="string" /> */}
                    <ValueCell
                        dataKey="piezas_reparadas"
                        datatype="number"
                    />
                </Column>

                <Column width={110} align='center' className='text-xl'>
                    <HeaderCell>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Piezas</span>
                            <span>scrap</span>
                        </div>
                    </HeaderCell>
                    <EditableCell
                        className='text-center'
                        dataKey="piezas_scrap"
                        datatype="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    />
                </Column>

                <Column width={70} align='center' >
                    <HeaderCell className='text-xl font-semibold text-black'>RRHH</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="RRHH"
                        datatype="number"
                    />
                </Column>

                <Column width={70} align='center' >
                    <HeaderCell className='text-xl font-semibold text-black'>KZN</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="KZN"
                        datatype="number"
                    />
                </Column>

                <Column width={70} align='center' >
                    <HeaderCell className='text-xl font-semibold text-black'>QC</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="QC"
                        datatype="number"
                    />

                </Column>

                <Column width={70} align='center'>
                    <HeaderCell className='text-xl font-semibold text-black'>MH</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="MH"
                        datatype="number"
                    />
                </Column>

                <Column width={70} align='center'>
                    <HeaderCell className='!text-xl font-semibold text-black'>MTTO</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="MTTO"
                        datatype="number"
                    />
                </Column>
                {datosTablero?.edita &&
                    <Column fixed={'right'} width={250}>
                        <HeaderCell></HeaderCell>
                        <ActionCell issaving={isSaving} setIdInformarParada={setIdInformarParada} setIsVisibleModalParada={setIsVisibleModalParada} dataKey="id" onEdit={handleEdit} onRemove={handleCancel} />
                    </Column>
                }
            </Table >

            {/* <div className='flex items-center justify-between w-full'>
                <span className='font-bold text-4xl'>VOL : {datos.volumenReal} / {datos.volumen}</span>

                <div className='flex items-center gap-2 justify-center'>
                    <label className='font-bold text-4xl'>SOPORTE</label>
                    <input value={soporte} onChange={(e) => setSoporte(e.target.value)} className='border rounded-md p-1 w-24 text-2xl' />
                    <button onClick={async () => {
                        await setSoporteLinea({ soporte: soporte, turno: datosTablero.turno, linea: datosTablero.linea, fecha: datosTablero.fecha })
                        fectchPlan()
                    }} className='p-2 bg-green-400'>ACTUALIZAR</button>
                </div>

                <span className='font-bold text-4xl'>PARADAS : {datos?.paradas}min</span>

                <div className='flex items-center justify-between gap-4'>
                    <span className={`font-bold text-4xl px-2 rounded-md ${bgColor(datos?.ef)}`}>EF : {datos?.ef}%</span>
                    <span className={`font-bold text-4xl px-2 rounded-md ${bgColor(datos?.oa)}`}>OA : {datos?.oa}%</span>
                </div>
            </div> */}
        </div>
    );
};

function toValueString(value, datatype) {
    return datatype === 'date' ? value?.toLocaleDateString() : value;
}

const fieldMap = {
    string: Input,
    number: InputNumber,
    date: DatePicker
};

const EditableCell = ({ rowData, datatype, dataKey, onChange, onEdit, ...props }) => {
    const editing = rowData.status === 'EDIT';

    const Field = fieldMap[datatype];
    const value = rowData[dataKey];
    const text = toValueString(value, datatype);

    // console.log(props)
    // if (dataKey == 'modelo') {
    // console.log(value, typeof value)
    // }

    return (
        <Cell
            {...props}
            className={editing ? 'table-cell-editing' : ''}
        >
            {dataKey == 'modelo' ?
                (editing ?
                    // ((linea == '7' || linea == '8') ?
                    // <SelectDoorTrim defaultValue={value} onChange={value => { onChange?.(rowData.id, dataKey, value); }} />
                    <SelectModelo
                        line={props.linea}
                        modoTactil={true}
                        multiple={true}
                        defaultValue={typeof value == 'object' ? value : value?.trim()}
                        onChange={value => { onChange?.(rowData.id, dataKey, value); }}
                    />
                    : text) :
                editing ? (
                    <Field
                        type={datatype}
                        className="!text-3xl"
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
    if (props?.dataKey == 'piezas_reparadas') {

    } else {
        if (keyCompare) {
            className = parseInt(rowData[keyCompare]) > parseInt(rowData[props.dataKey]) ? 'bg-red-100 text-red-700 font-semibold text-center' : 'bg-green-100 text-green-700 font-semibold text-center';
        } else {
            className = rowData[props.dataKey] < valueCompare ? 'bg-red-100 text-red-700 font-semibold text-center' : 'bg-green-100 text-green-700 font-semibold text-center';
        }
    }

    return (
        <Cell {...props} className={className}>
            {rowData[props.dataKey]}
        </Cell>
    );
};

const ActionCell = ({ rowData, dataKey, onEdit, onRemove, ...props }) => {
    return (
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '10px' }}>
            {/* <IconButton
                appearance="subtle"
                icon={rowData.status === 'EDIT' ? (props?.issaving ? <Spin /> : <FiSave className='!text-5xl text-blue-500' />) : <CiEdit className='!text-5xl text-orange-500' />}
                onClick={() => {
                    onEdit(rowData.id);
                }}
            /> */}

            {rowData.status != 'EDIT' &&
                <button
                    onClick={() => {
                        props?.setIsVisibleModalParada(true)
                        props?.setIdInformarParada(rowData.id)
                    }}
                    className='text-xl p-0 flex items-center gap-1 px-4 bg-lime-200'>
                    <FaStopwatch /> Parada
                </button>
            }

            {(rowData.status === 'EDIT' && !props?.issaving) &&
                <IconButton
                    appearance="subtle"
                    icon={<MdOutlineCancel className='!text-5xl text-red-500' />}
                    onClick={() => {
                        onRemove(rowData.id);
                    }}
                />
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