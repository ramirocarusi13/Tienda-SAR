import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Alert, Button, DatePicker, Select, Spin, Tag } from "antd";
import { fetchMovimientosFg } from "../../services/FgMovimientosService";
import { formatDateTime } from "../../utils/Utils";

const { RangePicker } = DatePicker;

// const formatDate = (value) => dayjs(value).format("YYYY-MM-DD HH:mm");

const aggregateByKey = (items, key) => {
    return items.reduce((acc, cur) => {
        const name = cur?.[key] || "SIN_DATO";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});
};

export default function MovimientosFGPage() {
    const [range, setRange] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [tipos, setTipos] = useState([]);

    const { data, isFetching, error, refetch, isFetched } = useQuery({
        queryKey: ["fg-movimientos"],
        queryFn: async () => {
            const payload = {
                desde: range?.[0]?.format("YYYY-MM-DD HH:mm:ss"),
                hasta: range?.[1]?.format("YYYY-MM-DD HH:mm:ss")
            };
            const response = await fetchMovimientosFg(payload);
            return response;
        },
        enabled: false,
        refetchOnWindowFocus: false
    });

    const movimientos = useMemo(() => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.data)) return data.data;
        return [];
    }, [data]);

    const modelosDisponibles = useMemo(
        () => Array.from(new Set(movimientos.map((m) => m?.nombre).filter(Boolean))),
        [movimientos]
    );

    const tiposDisponibles = useMemo(
        () => Array.from(new Set(movimientos.map((m) => m?.tipo).filter(Boolean))),
        [movimientos]
    );

    const filtrados = useMemo(() => {
        return movimientos.filter((m) => {
            const byModelo = modelos.length === 0 || modelos.includes(m?.nombre);
            const byTipo = tipos.length === 0 || tipos.includes(m?.tipo);
            return byModelo && byTipo;
        });
    }, [movimientos, modelos, tipos]);

    const totalesPorModelo = useMemo(() => aggregateByKey(filtrados, "nombre"), [filtrados]);
    const totalesPorTipo = useMemo(() => aggregateByKey(filtrados, "tipo"), [filtrados]);

    const handleBuscar = () => {
        // if (!range?.[0] || !range?.[1]) return;
        refetch();
    };

    const handleExport = () => {
        if (!filtrados?.length) return;
        const header = ["Modelo", "Fecha y hora", "Tipo"];
        const rows = filtrados.map((item) => [
            item?.nombre ?? "",
            formatDateTime(item?.fecha) ?? "",
            item?.tipo ?? ""
        ]);

        // Exporta como XLS sencillo usando tabla HTML (compatible con Excel)
        const table = `
            <table>
                <thead>
                    <tr>${header.map((h) => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>
                    ${rows
                        .map(
                            (r) =>
                                `<tr>${r
                                    .map((c) => `<td>${(c + "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`)
                                    .join("")}</tr>`
                        )
                        .join("")}
                </tbody>
            </table>
        `;

        const blob = new Blob([table], { type: "application/vnd.ms-excel;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "movimientos_fg.xls";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen w-full bg-gray-50 text-slate-900">
            <div className="max-w-7xl mx-auto px-4 md:px-7 py-2 space-y-2">
                <header className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Finish Good</p>
                    <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
                        Kanbans escaneados
                    </h1>
                    {/* <p className="text-slate-600">
                        Visualiza los modelos escaneados en una franja horaria, filtra por modelo y
                        tipo y consulta los totales al instante.
                    </p> */}
                </header>

                <section className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 md:p-6">
                    <div className="flex flex-wrap items-end gap-3">
                        <div className="flex-1 min-w-[280px] space-y-1">
                            <span className="block text-sm text-slate-600">Franja horaria</span>
                            <RangePicker
                                value={range}
                                onChange={(val) => setRange(val)}
                                showTime
                                format="DD-MM-YYYY HH:mm"
                                className="w-full"
                            />
                        </div>

                        {data?.data?.length > 0 && (
                            <div className="min-w-[200px] space-y-1">
                                <span className="block text-sm text-slate-600">Modelo</span>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Todos"
                                    value={modelos}
                                    onChange={setModelos}
                                    options={modelosDisponibles.map((m) => ({ value: m, label: m }))}
                                    className="w-full"
                                />
                            </div>
                        )}

                        {data?.data?.length > 0 && (
                            <div className="min-w-[180px] space-y-1">
                                <span className="block text-sm text-slate-600">Tipo</span>
                                <Select
                                    mode="multiple"
                                    allowClear
                                    placeholder="Todos"
                                    value={tipos}
                                    onChange={setTipos}
                                    options={tiposDisponibles.map((t) => ({ value: t, label: t }))}
                                    className="w-full min-w-[200px]"
                                />
                            </div>
                        )}

                        <div className="min-w-[140px] flex md:justify-end">
                            <Button
                                // type="primary"
                                onClick={handleBuscar}
                                loading={isFetching}
                                // disabled={!range?.[0] || !range?.[1]}
                                className="w-full md:w-auto bg-green-700 text-white hover:!bg-green-600 hover:!border-green-600 border border-green-700 shadow-md transition duration-150 hover:-translate-y-0.5"
                            >
                                Buscar
                            </Button>
                        </div>
                    </div>
                </section>

                {error && (
                    <Alert
                        type="error"
                        message="No se pudo cargar la información"
                        description="Verifica la conexión con el endpoint de movimientos."
                        showIcon
                    />
                )}

                <section className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-gray-200 bg-orange-100 p-4">
                        <p className="text-xs uppercase tracking-wide text-orange-800">Total registros</p>
                        <p className="text-3xl font-semibold mt-1 text-orange-800">{filtrados.length}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 !bg-blue-100 text-blue-600 shadow-sm p-4">
                        <p className="text-xs uppercase tracking-wide text-blue-600">Modelos</p>
                        <p className="text-3xl font-semibold mt-1">{Object.keys(totalesPorModelo).length}</p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-green-200 shadow-sm p-4">
                        <p className="text-xs uppercase tracking-wide text-green-600">Tipos</p>
                        <p className="text-3xl font-semibold mt-1 text-green-600">{Object.keys(totalesPorTipo).length}</p>
                    </div>
                </section>

                <section className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Totales por modelo</h3>
                            <Tag color="blue">{filtrados.length}</Tag>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(totalesPorModelo).map(([modelo, qty]) => (
                                <span
                                    key={modelo}
                                    className="px-3 py-2 rounded-xl bg-slate-100 border border-gray-200 text-sm"
                                >
                                    <strong>{modelo} :</strong> {qty}
                                </span>
                            ))}
                            {Object.keys(totalesPorModelo).length === 0 && (
                                <span className="text-slate-500 text-sm">Sin datos en el rango.</span>
                            )}
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Totales por tipo</h3>
                            <Tag color="geekblue">{filtrados.length}</Tag>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(totalesPorTipo).map(([tipo, qty]) => (
                                <span
                                    key={tipo}
                                    className="px-3 py-2 rounded-xl bg-slate-100 border border-gray-200 text-sm"
                                >
                                    <strong>{tipo} :</strong> {qty}
                                </span>
                            ))}
                            {Object.keys(totalesPorTipo).length === 0 && (
                                <span className="text-slate-500 text-sm">Sin datos en el rango.</span>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5 md:p-6">
                    <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                        <h3 className="text-lg font-semibold">Detalle</h3>
                        <div className="flex items-center gap-2">
                            <Button
                                size="small"
                                disabled={!filtrados.length}
                                onClick={handleExport}
                                className="border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                            >
                                Descargar Excel
                            </Button>
                            {isFetching && <Spin size="small" />}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filtrados.map((item, idx) => (
                            <div
                                key={`${item.nombre}-${item.tipo}-${idx}`}
                                className="rounded-xl border border-gray-200 bg-slate-50 px-3 py-3 flex flex-col gap-1"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">{item.nombre}</span>
                                    <Tag color="green">{item.tipo}</Tag>
                                </div>
                                <span className="text-xs text-slate-600">{formatDateTime(item.fecha)}</span>
                            </div>
                        ))}
                    </div>
                    {!isFetching && isFetched && filtrados.length === 0 && (
                        <div className="flex items-center justify-center py-10 text-slate-500">
                            No hay movimientos en el rango seleccionado.
                        </div>
                    )}
                    {!isFetched && (
                        <div className="flex items-center justify-center py-10 text-slate-500">
                            Define el rango y presiona Buscar para ver resultados.
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
