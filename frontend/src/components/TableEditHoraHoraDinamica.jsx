import { InputNumber, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { CiEdit } from "react-icons/ci";
import { FaStopwatch } from "react-icons/fa";
import { FiSave } from "react-icons/fi";
import { MdOutlineCancel } from "react-icons/md";
import { DatePicker, IconButton, Input, Table, TimePicker } from 'rsuite';
import { getPlanHoraHora, savePlanHoraHora, setSoporteLinea } from '../services/HoraHoraService';
import ModalParadaLineaHoraHora from './ModalParadaLineaHoraHora';
import SelectModelo from './SelectModelo';
import { formatDate, getFormatLengthZero } from '../utils/Utils';
import dayjs from 'dayjs';

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

const bgColor = (valor) => {

    if (valor < 50) {
        // return '!bg-green-500 text-black'
        return '!bg-red-500 text-black'
    } else if (valor >= 50 && valor < 80) {
        return '!bg-yellow-300 text-black'
    } else if (valor >= 80 && valor < 90) {
        return '!bg-green-300 text-black'
    } else {
        return '!bg-green-500 text-black'
    }


}

export default function TableEditHoraHoraDinamica({ datosTablero }) {
    const [data, setData] = useState(defaultData);
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isVisibleModalParada, setIsVisibleModalParada] = useState(false)
    const [idInformarParada, setIdInformarParada] = useState(null)
    const [soporte, setSoporte] = useState(0)
    const [datos, setDatos] = useState({
        volumen: 0,
        volumenReal: 0,
        ef: 0,
        oa: 0,
        paradas: 0
    })

    const { linea } = datosTablero

    const fectchPlan = async () => {
        setIsLoading(true)
        const response = await getPlanHoraHora(datosTablero)

        if (!response.error) {
            let hc = 0, ttime = 0
            if (linea == 1) {
                hc = 21
                ttime = 159.4
            } else if (linea == 2) {
                hc = 16
                ttime = 169
            } else if (linea == 3) {
                hc = 10
                ttime = 229
            } else if (linea == 4) {
                hc = 7
                ttime = 239
            } else if (linea == 5) {
                hc = 8
                ttime = 382
            } else if (linea == 6) {
                hc = 4
                ttime = 399
            } else if (linea == 7) {
                hc = 4
                ttime = 82.9
            } else if (linea == 8) {
                hc = 6
                ttime = 82.9
            } else if (linea == 9) {
                hc = 1
                ttime = 111
            } else if (linea == 10) {
                hc = 7
                ttime = 334
            } else if (linea == 11) {
                hc = 5
                ttime = 0
            }

            const minParadas = response?.data?.data?.reduce((p, c) => {
                let total = p

                total = total + (c?.RRHH ? parseInt(c?.RRHH) : 0)
                total = total + (c?.KZN ? parseInt(c?.KZN) : 0)
                total = total + (c?.QC ? parseInt(c?.QC) : 0)
                total = total + (c?.MH ? parseInt(c?.MH) : 0)
                total = total + (c?.MTTO ? parseInt(c?.MTTO) : 0)

                return total
            }, 0)

            const volumen = response?.data?.data?.reduce((p, c) => p + parseInt(c.plan), 0)
            let real = response?.data?.data?.reduce((p, c) => {
                if (c) {
                    if (c?.real) {
                        return p + parseInt(c.real)
                    }
                }

                return p
            }, 0)

            if (isNaN(real)) {
                real = 0
            }

            let tSoporte = parseInt(response.data?.soporte?.soporte)
            if (isNaN(tSoporte)) {
                tSoporte = 0
            }

            const hsReales = ((7.97 * hc) + tSoporte - minParadas) / real
            const ef = (((7.97 * hc) / volumen) / hsReales) * 100
            const oa = ((real * ttime) / (3600 * 7.97)) * 100

            setDatos({
                volumen: volumen,
                volumenReal: real,
                ef: ef?.toFixed(2),
                oa: oa?.toFixed(2),
                paradas: minParadas
            })
            setData(response.data?.data)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        fectchPlan()
    }, [datosTablero])

    useEffect(() => {
        if (!isVisibleModalParada) {
            fectchPlan()
        }
    }, [isVisibleModalParada])

    const handleChange = (id, key, value) => {
        const nextData = Object.assign([], data);
        const pItem = nextData.find(item => item.id === id)
        pItem[`${key}_prev`] = pItem[key];

        if (key == 'real_tiempo') {
            const date = new Date(value)
            nextData.find(item => item.id === id)[key] = getFormatLengthZero(date.getHours(), 2) + ':' + getFormatLengthZero(date.getMinutes(), 2) //+ ' - ' + getFormatLengthZero(value[1].getHours(), 2) + ':' + getFormatLengthZero(value[1].getMinutes(), 2);

        } else {
            nextData.find(item => item.id === id)[key] = value;
        }

        // console.log(nextData)
        setData(nextData);
    };

    const handleEdit = async id => {
        let nextData = Object.assign([], data);
        const activeItem = nextData.find(item => item.id === id);

        if (activeItem.status == 'EDIT') {
            setIsSaving(true)
            // console.log(activeItem)
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
        if (activeItem?.modelo_prev) {
            activeItem.modelo = activeItem?.modelo_prev
        }
        activeItem.real = activeItem?.real_prev
        activeItem.piezas_reparadas = activeItem?.piezas_reparadas_prev
        activeItem.piezas_scrap = activeItem?.piezas_scrap_prev
        // console.log(activeItem)
        setData(nextData);
    }

    return (
        <div className='w-full'>
            <style>{styles}</style>

            <button onClick={() => {
                setData([
                    {
                        id: null,
                        fecha: datosTablero.fecha,
                        turno: datosTablero.turno,
                        linea: datosTablero.linea,
                        turno_nombre: datosTablero.turno_nombre,
                        status: 'EDIT',
                        intervalo: '',
                        plan: 0,
                        plan_acumulado: 0,
                        real: 0,
                        acumulado: 0,
                        diferencia: 0,
                        diferencia_acumulado: 0,
                        piezas_reparadas: 0,
                        piezas_scrap: 0,
                        modelo: null
                    },
                    ...data
                ]);
            }}>Agregar fila</button>

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
                    <Cell dataKey="intervalo" dataType="string" />
                </Column>

                <Column fixed='left' width={100} align='center'>
                    <HeaderCell className='!text-xl'>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Plan</span>
                            <span>Hora</span>
                        </div>
                    </HeaderCell>
                    {/* <Cell dataKey="plan" dataType="string" /> */}
                    <EditableCell
                        dataKey="plan"
                        dataType="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    // onSave={handleSave}
                    />
                </Column>

                <Column width={100} fixed='left' align='center'>
                    <HeaderCell className='!text-xl' align='center'>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Plan</span>
                            <span>Acum.</span>
                        </div>
                    </HeaderCell>
                    <Cell dataKey="plan_acumulado" dataType="string" />
                </Column>

                <Column width={150}>
                    <HeaderCell className='text-xl font-semibold text-black'>Modelo</HeaderCell>
                    <EditableCell
                        dataKey="modelo"
                        dataType="string"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    // onSave={handleSave}
                    />
                </Column>

                <Column width={200} align='center'>
                    <HeaderCell className='text-xl font-semibold text-black'>
                        <div className='flex flex-col text-center'>
                            <span>Fin Real</span>
                        </div>
                    </HeaderCell>
                    <EditableCell
                        dataKey="real_tiempo"
                        dataType="number"
                        turno={datosTablero.turno}
                        onChange={handleChange}
                        onEdit={handleEdit}
                        className='bg-red-500'
                    />
                </Column>

                <Column width={100}>
                    <HeaderCell className='text-xl font-semibold text-black'>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Atraso</span>
                            <span>(Min.)</span>
                        </div>
                    </HeaderCell>
                    <ValueCell
                        dataKey="minutos_atraso"
                        dataType="number"
                        valueCompare={9999990}
                    />
                </Column>

                {/* <Column width={100} align='center' colSpan={2}>
                    <HeaderCell className='text-xl'>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
                            <span>Dif.</span>
                            <span>Hora.</span>
                        </div>
                    </HeaderCell>
                    <ValueCell
                        dataKey="diferencia"
                        dataType="number"
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
                        dataType="number"
                    />
                </Column> */}


                <Column width={110} align='center' className='text-xl'>
                    <HeaderCell>
                        <div className='flex flex-col font-semibold text-black !py-0 !my-0 leading-5 text-center'>
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
                        dataType="number"
                        onChange={handleChange}
                        onEdit={handleEdit}
                    />
                </Column>

                <Column width={70} align='center' >
                    <HeaderCell className='text-xl font-semibold text-black'>RRHH</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="RRHH"
                        dataType="number"
                    />
                </Column>

                <Column width={70} align='center' >
                    <HeaderCell className='text-xl font-semibold text-black'>KZN</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="KZN"
                        dataType="number"
                    />
                </Column>

                <Column width={70} align='center' >
                    <HeaderCell className='text-xl font-semibold text-black'>QC</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="QC"
                        dataType="number"
                    />

                </Column>

                <Column width={70} align='center'>
                    <HeaderCell className='text-xl font-semibold text-black'>MH</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="MH"
                        dataType="number"
                    />
                </Column>

                <Column width={70} align='center'>
                    <HeaderCell className='!text-xl font-semibold text-black'>MTTO</HeaderCell>
                    <Cell
                        className='text-center'
                        dataKey="MTTO"
                        dataType="number"
                    />
                </Column>
                {datosTablero?.edita &&
                    <Column fixed={'right'} width={250}>
                        <HeaderCell></HeaderCell>
                        <ActionCell isSaving={isSaving} setIdInformarParada={setIdInformarParada} setIsVisibleModalParada={setIsVisibleModalParada} dataKey="id" onEdit={handleEdit} onRemove={handleCancel} />
                    </Column>
                }
            </Table >

            <div className='flex items-center justify-between w-full'>
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
            </div>
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

    return (
        <Cell
            {...props}
            className={editing ? 'table-cell-editing' : ''}
        >
            {(dataKey == 'real_tiempo') ?
                (editing ?
                    // <TimePicker format={"HH:mm"} onChange={value => { onChange?.(rowData.id, dataKey, value); }} className='w-full' />

                    <TimePicker      
                        // value={value}              
                        className='w-full !text-2xl text-center'
                        hideHours={hour => {
                            if (props.turno == 'M') {
                                return hour == 0 || hour == 1 || hour == 2 || hour == 3 || hour == 4 || hour == 5 || hour > 15
                            } else {
                                return hour > 0 && hour < 15
                            }
                        }}
                        size='lg' format='HH:mm' character='-' onChange={value => { onChange?.(rowData.id, dataKey, value); }}
                    />
                    :
                    text
                )
                :
                (dataKey == 'modelo') ?
                    (editing ?
                        <SelectModelo modoTactil={true} multiple={true} defaultValue={value} onChange={value => { onChange?.(rowData.id, dataKey, value); }} />
                        : text) :
                    editing ? (
                        <Field
                            type={dataType}
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
                    <SelectModelo modoTactil={true} multiple={true} defaultValue={value} onChange={value => { onChange?.(rowData.id, dataKey, value); }} />
                    : text) :
                editing ? (
                    <Field
                        type={dataType}
                        className="!text-3xl"
                        defaultValue={value}
                        onChange={value => {
                            onChange?.(rowData.id, dataKey, value);
                        }}
                    />
                ) : (
                    text
                )
            } */}

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
        <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '10px' }}>
            <IconButton
                appearance="subtle"
                icon={rowData.status === 'EDIT' ? (props?.isSaving ? <Spin /> : <FiSave className='!text-5xl text-blue-500' />) : <CiEdit className='!text-5xl text-orange-500' />}
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
                    className='text-xl p-0 flex items-center gap-1 px-4 bg-lime-200'>
                    <FaStopwatch /> Parada
                </button>
            }

            {(rowData.status === 'EDIT' && !props?.isSaving) &&
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