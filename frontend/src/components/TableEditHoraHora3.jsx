import React, { useState } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
import SelectModelo from './SelectModelo';
// import 'antd/dist/reset.css'; // Use reset.css for Ant Design v5+
// import './index.css';

const { Column, ColumnGroup } = Table;

const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = <Input />;

    // console.log(dataIndex)
    return (
        <td {...restProps}>
            {editing ? (
                dataIndex == 'modelo' ?
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                    // rules={[{ required: true, message: `Please input ${title}` }]}
                    >
                        <SelectModelo />
                    </Form.Item>
                    :
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                    // rules={[{ required: true, message: `Please input ${title}` }]}
                    >
                        {inputNode}
                    </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default function TableEditHoraHora2() {
    const [form] = Form.useForm();
    const [data, setData] = useState([
        { key: '1', intervalo: '06:12 - 07:00', price: '1.00', modelo: null },
        { key: '2', intervalo: '07:00 - 08:20', price: '1.00', modelo: null },
        { key: '3', intervalo: '08:20 - 09:00', price: '1.00', modelo: null },
        { key: '4', intervalo: '09:00 - 10:00', price: '1.00', modelo: null },
        { key: '5', intervalo: '10:00 - 10:50', price: '1.00', modelo: null },
        { key: '6', intervalo: '10:50 - 12:20', price: '1.00', modelo: null },
        { key: '7', intervalo: '12:20 - 13:00', price: '1.00', modelo: null },
        { key: '8', intervalo: '13:00 - 14:00', price: '1.00', modelo: null },
        { key: '9', intervalo: '14:00 - 15:05', price: '1.00', modelo: null, ausentismo: 0 },

    ]);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ name: '', price: '', ...record });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => item.key === key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        { title: 'Intervalo', dataIndex: 'intervalo', editable: true },
        { title: <span>Plan<br />Hora</span>, dataIndex: 'hora', editable: true },
        { title: <span>Plan<br />Acumulado</span>, dataIndex: 'acum', editable: true },
        { title: 'Modelo', dataIndex: 'modelo', editable: true },
        { title: 'Real', dataIndex: 'real', editable: true },

        {
            title: 'RRHH',
            editable: true,
            dataIndex: 'rrhh',
            children: [
                {
                    title: 'Ausentismo',
                    dataIndex: 'ausentismo',
                    editable: true
                },
                {
                    title: 'Rotación',
                    dataIndex: 'rotacion',
                    editable: true
                }
            ]

        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button onClick={() => save(record.key)} type="link">Save</Button>
                        <Popconfirm title="Cancel changes?" onConfirm={cancel}>
                            <Button type="link">Cancel</Button>
                        </Popconfirm>
                    </span>
                ) : (
                    <Button type="link" disabled={editingKey !== ''} onClick={() => edit(record)}>Edit</Button>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) =>
        !col.editable ? col : {
            ...col,
            onCell: (record) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        }
    );

    return (
        <div className="p-4 w-full mx-auto">
            <Form form={form} component={false}>
                <Table
                    size='small'
                    components={{ body: { cell: EditableCell } }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancel }}
                />
            </Form>
        </div>
    );
};