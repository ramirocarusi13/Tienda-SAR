import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, DatePicker, Divider, Form, Input, Select, Space, Typography, Upload } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { getFallas, setAnalisisDefecto } from "../../services/FallasService";
import { getModelosWms } from "../../services/ModelService";
import { getUsersNL } from "../../services/UserService";

const { Title, Text } = Typography;

const Section = ({ title, extra, children, className = "" }) => (
    <Card className={`rounded-2xl shadow-sm border border-gray-100 mb-6 ${className}`}>
        <div className="flex items-center justify-between gap-4 mb-4">
            <Title level={4} className="!m-0">{title}</Title>
            {extra}
        </div>
        {children}
    </Card>
);

const uploadProps = {
    listType: "picture-card",
    beforeUpload: () => false, // Evita auto-upload, manejamos el archivo en el submit
    multiple: true,
};

const FIVE_M = [
    { key: "metodo", label: "Método" },
    { key: "maquina", label: "Máquina" },
    { key: "mano_obra", label: "Mano de obra" },
    { key: "material", label: "Material" },
    { key: "medicion", label: "Medición" },
];

const ESTADOS_ACCION = [
    { value: "pendiente", label: "Pendiente" },
    { value: "en_progreso", label: "En progreso" },
    { value: "completada", label: "Completada" },
    { value: "no_efectiva", label: "No efectiva" },
];

const lineas = [
    { nombre: 'M1', id: '1' }, { nombre: 'M2', id: '2' }, { nombre: 'M3', id: '3' }, { nombre: 'M4', id: '4' }
    , { nombre: 'M5', id: '5' }, { nombre: 'M6', id: '6' }, { nombre: 'M7', id: '7' }, { nombre: 'M8', id: '8' }
    , { nombre: 'M9', id: '9' }, { nombre: 'M10', id: '10' }, { nombre: 'M11', id: '11' }
]

export default function CargaAnalisisDefectoPage() {
    const [form] = Form.useForm();
    const [defectos, setDefectos] = useState([])
    const [modelos, setModelos] = useState([])
    const [users, setUsers] = useState([])
    const lineaOpts = useMemo(() => lineas.map(l => ({ label: l?.nombre ?? l, value: l?.id ?? l })), [lineas]);

    const fetchFallas = async () => {
        const fallas = await getFallas()
        setDefectos(fallas?.data?.map(f => ({ label: f.nombre, value: f.id })))
    }

    const fetchModelos = async () => {
        const modelos = await getModelosWms()
        setModelos(modelos?.data?.map(f => ({ label: f.nombre, value: f.id })))
    }

    const fetchUsers = async () => {
        const usuarios = await getUsersNL()
        setUsers(usuarios?.data?.map(f => ({ label: f.email?.toUpperCase(), value: f.id })))
    }

    useEffect(() => {
        fetchFallas()
        fetchModelos()
        fetchUsers()
    }, [])


    const handleFinish = async (values) => {
        const normFiles = (fileList) => (fileList || []).map(f => f.originFileObj ?? f);

        const payload = {
            meta: {
                fecha: values?.meta?.fecha?.format?.("YYYY-MM-DD") ?? null,
                modelo_id: values?.meta?.modelo_id ?? null,
                linea_id: values?.meta?.linea_id ?? null,
                turno: values?.meta?.turno ?? "",
                sello: values?.meta?.sello ?? "",
                defecto: values?.meta?.defecto ?? "",
                participantes: values?.meta?.participantes ?? [],
            },
            causa_raiz: {
                origen: values?.causa_raiz?.causa_raiz ?? "",
                cincoPorQue: (values?.cincoPorQue || []).map(item => ({
                    respuesta: item?.respuesta ?? "",
                })),
            },
            origen: {
                origen: values?.origen?.causa_raiz ?? "",
                imagenes: normFiles(values?.origen?.imagenes),
                cincoPorQue: (values?.cincoPorQueOrigen || []).map(item => ({
                    respuesta: item?.respuesta ?? "",
                })),
            },
            escape: {
                origen: values?.escape?.causa_raiz ?? "",
                imagenes: normFiles(values?.escape?.imagenes),
                cincoPorQue: (values?.cincoPorQueEscape || []).map(item => ({
                    respuesta: item?.respuesta ?? "",
                })),
            },

            acciones: (values?.acciones || []).map(a => ({
                que: a?.que ?? "",
                responsable_id: a?.responsable_id ?? null,
                fecha_compromiso: a?.fecha_compromiso?.format?.("YYYY-MM-DD") ?? null,
                estado: a?.estado ?? "pendiente",
                evidencia: normFiles(a?.evidencia),
            })),
            eficacia: {
                resultado: values?.eficacia?.resultado ?? "",
                comentario: values?.eficacia?.comentario ?? "",
                imagenes: normFiles(values?.eficacia?.imagenes),
            },
        };

        console.log(payload)

        const res = await setAnalisisDefecto(payload)
        console.log(res)
        // try {
        //     if (onSubmit) await onSubmit(payload);
        //     message.success("Reporte creado correctamente");
        //     form.resetFields();
        // } catch (e) {
        //     console.error(e);
        //     message.error("No se pudo crear el reporte");
        // }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 lg:p-8">
            <Title level={3} className="!mb-2">Alta de Análisis de Defecto</Title>
            <Text type="secondary">Completa los campos basados en el formato del reporte Naze‑Naze. Sube evidencias fotográficas cuando aplique.</Text>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="mt-6"
                initialValues={{ meta: { fecha: dayjs() } }}
            >
                {/* META */}
                <Section title="Meta del Reporte">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <Form.Item name={["meta", "fecha"]} label="Fecha" rules={[{ required: true, message: "La fecha es obligatoria" }]}>
                            <DatePicker className="w-full" format="DD-MM-YYYY" />
                        </Form.Item>
                        <Form.Item name={["meta", "defecto"]} label="Nombre del defecto" rules={[{ required: true, message: "Completa el nombre del defecto" }]}>
                            {/* <Input placeholder="Ej: Costura no toma material" /> */}
                            <Select showSearch allowClear optionFilterProp="label" options={defectos} placeholder="Seleccione un defecto" />
                        </Form.Item>
                        <Form.Item name={["meta", "modelo_id"]} label="Modelo">
                            <Select options={modelos} showSearch allowClear placeholder="Selecciona modelo" />
                        </Form.Item>
                        <Form.Item name={["meta", "linea_id"]} label="Línea">
                            <Select options={lineaOpts} showSearch allowClear placeholder="Selecciona línea" />
                        </Form.Item>
                        <Form.Item name={["meta", "turno"]} label="Turno">
                            <Select options={[
                                { label: 'Amarillo', value: 'A' },
                                { label: 'Blanco', value: 'B' },
                            ]} showSearch allowClear placeholder="Seleccione turno" />
                        </Form.Item>
                        <Form.Item name={["meta", "sello"]} label="Sello">
                            <Input placeholder="Identificación del inspector" />
                        </Form.Item>
                    </div>
                    <Form.Item name={["meta", "participantes"]} label="Participantes">
                        <Select mode="tags" optionFilterProp="label" options={users} placeholder="Agrega o selecciona participantes" />
                    </Form.Item>
                </Section>


                {/* 5 POR QUÉ */}
                <Section title="5 Por Qué (Causa raíz)">
                    <Form.Item name={["causa_raiz", "causa_raiz"]} label="Causa raíz">
                        <Input placeholder="Causa raíz" />
                    </Form.Item>
                    <Form.List name="cincoPorQue">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, idx) => (
                                    <Card key={field.key} className="mb-4 border border-gray-100 shadow-none">
                                        <div className="flex items-center justify-between mb-2">
                                            <Text strong>Por qué #{idx + 1}</Text>
                                            <Button danger type="text" onClick={() => remove(field.name)}>Eliminar</Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                                            <Form.Item name={[field.name, "respuesta"]} label="Respuesta" rules={[{ required: true, message: "Completa la respuesta" }]}>
                                                <Input placeholder="Porque..." />
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}
                                <Button onClick={() => add()} icon={<PlusOutlined />}>Agregar por qué</Button>
                            </>
                        )}
                    </Form.List>
                </Section>

                <Section title="5 Por Qué (Origen)">
                    <Form.Item name={["origen", "causa_raiz"]} label="Origen">
                        <Input placeholder="Origen" />
                    </Form.Item>

                    <Form.Item name={["origen", "imagenes"]} label="Imágenes" valuePropName="fileList" getValueFromEvent={e => e?.fileList} className="md:col-span-3">
                        <Upload {...uploadProps}>
                            <button type="button" className="ant-upload-select-picture-card">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Subir</div>
                            </button>
                        </Upload>
                    </Form.Item>

                    <Form.List name="cincoPorQueOrigen">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, idx) => (
                                    <Card key={field.key} className="mb-4 border border-gray-100 shadow-none">
                                        <div className="flex items-center justify-between mb-2">
                                            <Text strong>Por qué #{idx + 1}</Text>
                                            <Button danger type="text" onClick={() => remove(field.name)}>Eliminar</Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                            <Form.Item name={[field.name, "respuesta"]} label="Respuesta" rules={[{ required: true, message: "Completa la respuesta" }]}>
                                                <Input placeholder="Porque..." />
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}
                                <Button onClick={() => add()} icon={<PlusOutlined />}>Agregar por qué</Button>
                            </>
                        )}
                    </Form.List>
                </Section>

                <Section title="5 Por Qué (Escape)">
                    <Form.Item name={["escape", "causa_raiz"]} label="Escape">
                        <Input placeholder="Escape" />
                    </Form.Item>

                    <Form.Item name={["escape", "imagenes"]} label="Imágenes" valuePropName="fileList" getValueFromEvent={e => e?.fileList} className="md:col-span-3">
                        <Upload {...uploadProps}>
                            <button type="button" className="ant-upload-select-picture-card">
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Subir</div>
                            </button>
                        </Upload>
                    </Form.Item>

                    <Form.List name="cincoPorQueEscape">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, idx) => (
                                    <Card key={field.key} className="mb-4 border border-gray-100 shadow-none">
                                        <div className="flex items-center justify-between mb-2">
                                            <Text strong>Por qué #{idx + 1}</Text>
                                            <Button danger type="text" onClick={() => remove(field.name)}>Eliminar</Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                            <Form.Item name={[field.name, "respuesta"]} label="Respuesta" rules={[{ required: true, message: "Completa la respuesta" }]}>
                                                <Input placeholder="Porque..." />
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}
                                <Button onClick={() => add()} icon={<PlusOutlined />}>Agregar por qué</Button>
                            </>
                        )}
                    </Form.List>
                </Section>

                {/* PLAN DE ACCIONES */}
                <Section title="Plan de acciones">
                    <Form.List name="acciones">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, idx) => (
                                    <Card key={field.key} className="mb-4 border border-gray-100 shadow-none">
                                        <div className="flex items-center justify-between mb-2">
                                            <Text strong>Acción #{idx + 1}</Text>
                                            <Button danger type="text" onClick={() => remove(field.name)}>Eliminar</Button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Form.Item name={[field.name, "que"]} label="¿Qué hacer?" rules={[{ required: true, message: "La acción es obligatoria" }]}>
                                                <Input placeholder="Describe la acción correctiva/preventiva" />
                                            </Form.Item>
                                            <Form.Item name={[field.name, "responsable_id"]} label="Responsable" rules={[{ required: true, message: "Selecciona el responsable" }]}>
                                                <Select options={users} showSearch placeholder="Selecciona usuario" />
                                            </Form.Item>
                                            <Form.Item name={[field.name, "fecha_compromiso"]} label="Fecha compromiso" rules={[{ required: true, message: "Indica la fecha" }]}>
                                                <DatePicker className="w-full" />
                                            </Form.Item>
                                            <Form.Item name={[field.name, "estado"]} label="Estado" initialValue="pendiente">
                                                <Select options={ESTADOS_ACCION} />
                                            </Form.Item>
                                            <Form.Item name={[field.name, "evidencia"]} label="Evidencia (imágenes)" valuePropName="fileList" getValueFromEvent={e => e?.fileList} className="md:col-span-2">
                                                <Upload {...uploadProps}>
                                                    <button type="button" className="ant-upload-select-picture-card">
                                                        <PlusOutlined />
                                                        <div style={{ marginTop: 8 }}>Subir</div>
                                                    </button>
                                                </Upload>
                                            </Form.Item>
                                        </div>
                                    </Card>
                                ))}
                                <Button onClick={() => add({ estado: "pendiente" })} icon={<PlusOutlined />}>Agregar acción</Button>
                            </>
                        )}
                    </Form.List>
                </Section>

                {/* EFICACIA */}
                <Section title="Medición de la eficacia">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item name={["eficacia", "resultado"]} label="Resultado">
                            <Input.TextArea rows={2} placeholder="Describe cómo se midió la eficacia" />
                        </Form.Item>
                        <Form.Item name={["eficacia", "comentario"]} label="Comentario">
                            <Input.TextArea rows={2} placeholder="Observaciones adicionales" />
                        </Form.Item>
                        <Form.Item name={["eficacia", "imagenes"]} label="Imágenes" valuePropName="fileList" getValueFromEvent={e => e?.fileList} className="md:col-span-2">
                            <Upload {...uploadProps}>
                                <button type="button" className="ant-upload-select-picture-card">
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Subir</div>
                                </button>
                            </Upload>
                        </Form.Item>
                    </div>
                </Section>

                <Divider />
                <Space className="w-full justify-end">
                    <Button onClick={() => form.resetFields()}>Limpiar</Button>
                    <Button className="bg-green-500" type="primary" htmlType="submit">Guardar reporte</Button>
                </Space>
            </Form>
        </div>
    );
}
