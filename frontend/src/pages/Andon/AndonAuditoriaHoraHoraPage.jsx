import Loader from "@components/Loader";
import Reloj from "@components/Reloj";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { getAndonAuditoriaHoraHora } from "../../services/HoraHoraService";

const estadoIntervaloOptions = [
    { value: "todos", label: "Todos" },
    { value: "dentro", label: "Dentro de plan" },
    { value: "fuera", label: "Fuera de plan" },
    { value: "sin_timestamp", label: "Sin carab / sin timestamp" }
];

const toToday = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const toInt = (value) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
};

const kpiClass = (value, goodWhenPositive = true) => {
    if (goodWhenPositive) {
        if (value >= 0) return "bg-green-600 text-white";
        return "bg-red-700 text-white";
    }

    if (value <= 0) return "bg-green-600 text-white";
    return "bg-red-700 text-white";
};

const HeaderCell = ({ children, className = "" }) => (
    <th className={`px-3 py-2 bg-gray-900 text-gray-100 text-lg font-bold border-b border-gray-700 ${className}`}>
        {children}
    </th>
);

const DataCell = ({ children, className = "" }) => (
    <td className={`px-3 py-2 border-b border-gray-800 text-lg ${className}`}>
        {children}
    </td>
);

const diagnosticoConfig = (diagnostico) => {
    if (diagnostico === "FUERA_DE_HORARIO") {
        return {
            titulo: "FUERA DE HORARIO",
            subtitulo: "Escaneos fuera de intervalo del plan",
            clase: "bg-red-700 text-white"
        };
    }
    if (diagnostico === "SIN_CARAB") {
        return {
            titulo: "SIN CARAB",
            subtitulo: "Escaneos en linea 1 sin timestamp principal",
            clase: "bg-yellow-500 text-black"
        };
    }
    if (diagnostico === "DEFICIT_PRODUCTIVO") {
        return {
            titulo: "DEFICIT PRODUCTIVO",
            subtitulo: "La produccion real quedo por debajo del plan",
            clase: "bg-orange-600 text-white"
        };
    }
    return {
        titulo: "EN OBJETIVO",
        subtitulo: "Sin anomalias graves en el horario de plan",
        clase: "bg-green-700 text-white"
    };
};

export default function AndonAuditoriaHoraHoraPage() {
    const initialFilters = {
        fecha: toToday(),
        linea: "",
        turno: "",
        operador: "",
        estado_intervalo: "todos",
        buscar: ""
    };

    const [draftFilters, setDraftFilters] = useState(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState(initialFilters);
    const [autoRefresh, setAutoRefresh] = useState(true);

    const fetchReporte = async () => {
        const response = await getAndonAuditoriaHoraHora(appliedFilters);
        if (response?.error) {
            throw new Error(response?.message || "No se pudo cargar el reporte");
        }
        return response?.data || {};
    };

    const query = useQuery({
        queryKey: ["andon_auditoria_hora_hora", appliedFilters],
        queryFn: fetchReporte,
        staleTime: 10000,
        refetchInterval: autoRefresh ? 30000 : false,
        refetchIntervalInBackground: true
    });

    const lineasOptions = useMemo(() => {
        const fromApi = query?.data?.filters?.options?.lineas || [];
        return [{ value: "", label: "Todas" }, ...fromApi];
    }, [query?.data?.filters?.options?.lineas]);

    const turnosOptions = useMemo(() => {
        const fromApi = query?.data?.filters?.options?.turnos || [];
        return [{ value: "", label: "Todos" }, ...fromApi];
    }, [query?.data?.filters?.options?.turnos]);

    const operadoresOptions = useMemo(() => {
        const fromApi = query?.data?.filters?.options?.operadores || [];
        return [{ value: "", label: "Todos" }, ...fromApi];
    }, [query?.data?.filters?.options?.operadores]);

    const resumen = query?.data?.resumen || {};
    const intervalos = query?.data?.intervalos || [];
    const fundas = query?.data?.fundas || [];
    const erroresResumen = query?.data?.errores_scaneo?.resumen || [];
    const erroresUltimos = query?.data?.errores_scaneo?.ultimos || [];
    const topOperadores = query?.data?.top_operadores || [];
    const diagnostico = diagnosticoConfig(resumen?.diagnostico_principal);

    const onApplyFilters = () => {
        setAppliedFilters({ ...draftFilters });
    };

    const onResetFilters = () => {
        const clean = {
            fecha: toToday(),
            linea: "",
            turno: "",
            operador: "",
            estado_intervalo: "todos",
            buscar: ""
        };
        setDraftFilters(clean);
        setAppliedFilters(clean);
    };

    return (
        <div className="w-full h-screen bg-black text-white flex flex-col gap-3 p-3 overflow-hidden">
            <div className="flex items-center justify-between border-b-2 border-gray-700 pb-2">
                <div className="flex flex-col">
                    <span className="text-5xl font-black tracking-wide">AUDITORIA HORA HORA</span>
                    <span className="text-2xl font-semibold text-gray-300">Fundas fuera de intervalo, eventos y trazabilidad diaria</span>
                </div>
                <div className="flex items-center gap-6">
                    {query?.isFetching && <Loader fontSize={54} />}
                    <span className="text-2xl font-semibold text-gray-300">Auto refresh</span>
                    <button
                        className={`px-4 py-2 text-xl font-bold ${autoRefresh ? "bg-green-600" : "bg-gray-600"}`}
                        onClick={() => setAutoRefresh(!autoRefresh)}
                    >
                        {autoRefresh ? "ON" : "OFF"}
                    </button>
                    <Reloj className="text-5xl font-bold" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-3 bg-gray-950 border border-gray-800 p-3">
                <label className="col-span-2 flex flex-col">
                    <span className="text-lg font-semibold text-gray-300 mb-1">Fecha</span>
                    <input
                        className="bg-gray-900 border border-gray-700 px-3 py-2 text-2xl"
                        type="date"
                        value={draftFilters.fecha}
                        onChange={(e) => setDraftFilters({ ...draftFilters, fecha: e.target.value })}
                    />
                </label>

                <label className="col-span-2 flex flex-col">
                    <span className="text-lg font-semibold text-gray-300 mb-1">Linea</span>
                    <select
                        className="bg-gray-900 border border-gray-700 px-3 py-2 text-2xl"
                        value={draftFilters.linea}
                        onChange={(e) => setDraftFilters({ ...draftFilters, linea: e.target.value })}
                    >
                        {lineasOptions.map((option) => (
                            <option key={`linea_${option.value || "all"}`} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="col-span-2 flex flex-col">
                    <span className="text-lg font-semibold text-gray-300 mb-1">Turno</span>
                    <select
                        className="bg-gray-900 border border-gray-700 px-3 py-2 text-2xl"
                        value={draftFilters.turno}
                        onChange={(e) => setDraftFilters({ ...draftFilters, turno: e.target.value })}
                    >
                        {turnosOptions.map((option) => (
                            <option key={`turno_${option.value || "all"}`} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="col-span-2 flex flex-col">
                    <span className="text-lg font-semibold text-gray-300 mb-1">Operador</span>
                    <select
                        className="bg-gray-900 border border-gray-700 px-3 py-2 text-2xl"
                        value={draftFilters.operador}
                        onChange={(e) => setDraftFilters({ ...draftFilters, operador: e.target.value })}
                    >
                        {operadoresOptions.map((option) => (
                            <option key={`operador_${option.value || "all"}`} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="col-span-2 flex flex-col">
                    <span className="text-lg font-semibold text-gray-300 mb-1">Estado</span>
                    <select
                        className="bg-gray-900 border border-gray-700 px-3 py-2 text-2xl"
                        value={draftFilters.estado_intervalo}
                        onChange={(e) => setDraftFilters({ ...draftFilters, estado_intervalo: e.target.value })}
                    >
                        {estadoIntervaloOptions.map((option) => (
                            <option key={`estado_${option.value}`} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>

                <label className="col-span-2 flex flex-col">
                    <span className="text-lg font-semibold text-gray-300 mb-1">Buscar QR/Kanban/Modelo</span>
                    <input
                        className="bg-gray-900 border border-gray-700 px-3 py-2 text-2xl"
                        value={draftFilters.buscar}
                        onChange={(e) => setDraftFilters({ ...draftFilters, buscar: e.target.value })}
                    />
                </label>

                <div className="col-span-12 flex items-center justify-end gap-3">
                    <button className="px-6 py-2 bg-gray-700 text-2xl font-bold" onClick={onResetFilters}>
                        Limpiar
                    </button>
                    <button className="px-8 py-2 bg-blue-600 text-2xl font-black" onClick={onApplyFilters}>
                        Aplicar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
                <div className={`col-span-4 border border-gray-800 p-3 ${diagnostico.clase}`}>
                    <span className="block text-xl font-bold opacity-95">Diagnostico principal</span>
                    <span className="block text-6xl font-black leading-tight">{diagnostico.titulo}</span>
                    <span className="block text-2xl font-semibold mt-1">{diagnostico.subtitulo}</span>
                </div>

                <div className="col-span-2 bg-gray-950 border border-gray-800 p-3">
                    <span className="block text-xl text-gray-300">Plan (fundas)</span>
                    <span className="text-6xl font-black">{toInt(resumen?.plan_total)}</span>
                </div>
                <div className={`col-span-2 border border-gray-800 p-3 ${kpiClass(toInt(resumen?.diferencia), true)}`}>
                    <span className="block text-xl opacity-90">Real (fundas)</span>
                    <span className="text-6xl font-black">{toInt(resumen?.real_dentro_intervalo)}</span>
                </div>
                <div className={`col-span-2 border border-gray-800 p-3 ${kpiClass(toInt(resumen?.diferencia), true)}`}>
                    <span className="block text-xl opacity-90">Brecha</span>
                    <span className="text-6xl font-black">{toInt(resumen?.diferencia)}</span>
                </div>
                <div className={`col-span-2 border border-gray-800 p-3 ${kpiClass(toInt(resumen?.errores_scaneo), false)}`}>
                    <span className="block text-xl opacity-90">Errores</span>
                    <span className="text-6xl font-black">{toInt(resumen?.errores_scaneo)}</span>
                </div>

                <div className="col-span-3 border border-gray-800 p-3 bg-red-900 text-white">
                    <span className="block text-xl font-semibold">Fuera de plan</span>
                    <span className="block text-4xl font-black">{toInt(resumen?.fundas_fuera_intervalo)} etiq</span>
                    <span className="block text-2xl font-bold">~ {toInt(resumen?.fundas_fuera_intervalo_equivalente_fundas_aprox)} fundas</span>
                </div>
                <div className="col-span-3 border border-gray-800 p-3 bg-yellow-500 text-black">
                    <span className="block text-xl font-semibold">Sin carab</span>
                    <span className="block text-4xl font-black">{toInt(resumen?.fundas_sin_timestamp_principal)} etiq</span>
                    <span className="block text-2xl font-bold">~ {toInt(resumen?.fundas_sin_timestamp_principal_equivalente_fundas_aprox)} fundas</span>
                </div>
                <div className="col-span-3 border border-gray-800 p-3 bg-blue-700 text-white">
                    <span className="block text-xl font-semibold">Dentro por alternativo</span>
                    <span className="block text-4xl font-black">{toInt(resumen?.en_intervalo_por_timestamp_alternativo)} etiq</span>
                    <span className="block text-2xl font-bold">impacto horario</span>
                </div>
                <div className="col-span-3 border border-gray-800 p-3 bg-gray-900">
                    <span className="block text-xl font-semibold text-gray-300">Etiquetas dentro plan</span>
                    <span className="block text-5xl font-black">{toInt(resumen?.real_dentro_intervalo_etiquetas)}</span>
                </div>
            </div>

            <div className="flex-1 min-h-0 flex gap-3">
                <section className="w-[56%] min-h-0 bg-gray-950 border border-gray-800 flex flex-col">
                    <div className="px-3 py-2 border-b border-gray-800">
                        <span className="text-3xl font-black">Detalle por intervalo</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <HeaderCell>Linea</HeaderCell>
                                    <HeaderCell>Turno</HeaderCell>
                                    <HeaderCell>Intervalo</HeaderCell>
                                    <HeaderCell className="text-right">Plan</HeaderCell>
                                    <HeaderCell className="text-right">Etiq</HeaderCell>
                                    <HeaderCell className="text-right">Real</HeaderCell>
                                    <HeaderCell className="text-right">Dif</HeaderCell>
                                </tr>
                            </thead>
                            <tbody>
                                {intervalos.map((item, idx) => (
                                    <tr key={`intervalo_${idx}`} className={idx % 2 === 0 ? "bg-black" : "bg-gray-900"}>
                                        <DataCell className="font-bold">M{item?.linea}</DataCell>
                                        <DataCell className="font-bold">{item?.turno}</DataCell>
                                        <DataCell>{item?.intervalo}</DataCell>
                                        <DataCell className="text-right font-bold">{toInt(item?.plan)}</DataCell>
                                        <DataCell className="text-right font-bold text-sky-400">{toInt(item?.real_etiquetas)}</DataCell>
                                        <DataCell className={`text-right font-bold ${toInt(item?.real) >= toInt(item?.plan) ? "text-green-400" : "text-red-400"}`}>{toInt(item?.real)}</DataCell>
                                        <DataCell className={`text-right font-bold ${toInt(item?.diferencia) >= 0 ? "text-green-400" : "text-red-400"}`}>{toInt(item?.diferencia)}</DataCell>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="w-[44%] min-h-0 flex flex-col gap-3">
                    <div className="h-[40%] min-h-0 bg-gray-950 border border-gray-800 flex flex-col">
                        <div className="px-3 py-2 border-b border-gray-800">
                            <span className="text-3xl font-black">Etiquetas auditadas (segun filtro)</span>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <HeaderCell>Hora</HeaderCell>
                                        <HeaderCell>Lin</HeaderCell>
                                        <HeaderCell>Estado</HeaderCell>
                                        <HeaderCell>Carab</HeaderCell>
                                        <HeaderCell>Modelo</HeaderCell>
                                        <HeaderCell>QR</HeaderCell>
                                        <HeaderCell>Motivo</HeaderCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fundas.map((item, idx) => (
                                        <tr key={`funda_${item?.id}_${idx}`} className={idx % 2 === 0 ? "bg-black" : "bg-gray-900"}>
                                            <DataCell className="text-base">{item?.timestamp_referencia ? item.timestamp_referencia.slice(11, 16) : "-"}</DataCell>
                                            <DataCell className="text-base font-bold">M{item?.linea}</DataCell>
                                            <DataCell className={`text-base font-bold ${item?.estado_intervalo === "DENTRO" ? "text-green-400" : "text-red-400"}`}>{item?.estado_visual || item?.estado_intervalo}</DataCell>
                                            <DataCell className={`text-base font-bold ${item?.carab_estado === "SIN_CARAB" ? "text-yellow-400" : "text-gray-200"}`}>{item?.carab_estado || "-"}</DataCell>
                                            <DataCell className="text-base">{item?.modelo || "-"}</DataCell>
                                            <DataCell className="text-base">{item?.qr || "-"}</DataCell>
                                            <DataCell className="text-base">{item?.motivo || "-"}</DataCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="h-[28%] min-h-0 bg-gray-950 border border-gray-800 flex flex-col">
                        <div className="px-3 py-2 border-b border-gray-800">
                            <span className="text-3xl font-black">Errores de escaneo</span>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto grid grid-cols-2 gap-2 p-2">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <HeaderCell>Evento</HeaderCell>
                                        <HeaderCell className="text-right">Cant</HeaderCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {erroresResumen.slice(0, 8).map((item, idx) => (
                                        <tr key={`er_res_${idx}`} className={idx % 2 === 0 ? "bg-black" : "bg-gray-900"}>
                                            <DataCell className="text-base">{item?.evento}</DataCell>
                                            <DataCell className="text-base text-right font-bold">{toInt(item?.cantidad)}</DataCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <HeaderCell>Ultimo</HeaderCell>
                                        <HeaderCell>Lin</HeaderCell>
                                        <HeaderCell>Op</HeaderCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {erroresUltimos.slice(0, 8).map((item, idx) => (
                                        <tr key={`er_last_${idx}`} className={idx % 2 === 0 ? "bg-black" : "bg-gray-900"}>
                                            <DataCell className="text-base">{item?.evento_resumen}</DataCell>
                                            <DataCell className="text-base font-bold">{item?.linea ? `M${item.linea}` : "-"}</DataCell>
                                            <DataCell className="text-base">{item?.operador || (item?.operador_id ? `#${item?.operador_id}` : "-")}</DataCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="h-[32%] min-h-0 bg-gray-950 border border-gray-800 flex flex-col">
                        <div className="px-3 py-2 border-b border-gray-800">
                            <span className="text-3xl font-black">Top operadores</span>
                        </div>
                        <div className="flex-1 min-h-0 overflow-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <HeaderCell>Operador</HeaderCell>
                                        <HeaderCell className="text-right">Total</HeaderCell>
                                        <HeaderCell className="text-right">Dentro</HeaderCell>
                                        <HeaderCell className="text-right">Fuera</HeaderCell>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topOperadores.map((item, idx) => (
                                        <tr key={`top_op_${idx}`} className={idx % 2 === 0 ? "bg-black" : "bg-gray-900"}>
                                            <DataCell>{item?.operador || `#${item?.operador_id}`}</DataCell>
                                            <DataCell className="text-right font-bold">{toInt(item?.cantidad)}</DataCell>
                                            <DataCell className="text-right font-bold text-green-400">{toInt(item?.dentro_intervalo)}</DataCell>
                                            <DataCell className="text-right font-bold text-red-400">{toInt(item?.fuera_intervalo)}</DataCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
