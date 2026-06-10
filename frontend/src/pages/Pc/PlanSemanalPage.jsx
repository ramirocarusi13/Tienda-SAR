import Loader from "@components/Loader";
import TablePlanSemanal from "@components/Pc/TablePlanSemanal";
import TableStockPlanSemanal from "@components/Pc/TableStockPlanSemanal";
import { getPlanSemanal, postPlanSemanal } from "@services/PcService";
import { formatDate } from "@utils/Utils";
import { Popconfirm } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ModalOrdenPlanSemanal from "./ModalOrdenPlanSemanal";
import PrintKanbansPlan from "./PrintKanbansPlan";

const WEEKDAY_LABELS = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"];

/** Devuelve un nuevo Date con el lunes de la semana de `base` (sin mutar el original) */
function getMonday(base = new Date()) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate());
    const day = d.getDay() || 7; // domingo = 7
    if (day !== 1) d.setDate(d.getDate() - (day - 1));
    return d;
}

/** Suma días a una fecha (sin mutar el original) */
function addDays(date, days) {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    d.setDate(d.getDate() + days);
    return d;
}

export default function PlanSemanalPage() {
    const [planSemanal, setPlanSemanal] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [weekOffset, setWeekOffset] = useState(0); // -1 (prev), 0 (actual), 1 (next)
    const [modalVisible, setModalVisible] = useState(false);
    const [planificacion, setPlanificacion] = useState([]);

    // Calcula la semana visible (Lunes a Sábado) según el offset seleccionado
    const semana = useMemo(() => {
        const baseMonday = getMonday(addDays(new Date(), weekOffset * 7));
        return WEEKDAY_LABELS.map((name, i) => {
            const date = addDays(baseMonday, i);
            return {
                name,
                date: formatDate(date),
            };
        });
    }, [weekOffset]);

    // Índice por fecha para evitar filtrar en cada render
    const planByDate = useMemo(() => {
        const map = new Map();
        for (const p of planSemanal || []) {
            if (!map.has(p.fecha)) map.set(p.fecha, []);
            map.get(p.fecha).push(p);
        }
        return map;
    }, [planSemanal]);

    const fetchModelos = useCallback(async () => {
        setIsLoading(true);
        setStatus(null);
        try {
            const data = await getPlanSemanal();
            setPlanSemanal(data?.data || []);
        } catch (err) {
            setStatus({ error: true, message: "No se pudo cargar el plan semanal." });
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onSubmit = useCallback(async () => {
        setIsLoading(true);
        setStatus(null);
        try {
            const res = await postPlanSemanal(planSemanal);
            setStatus({
                error: res?.error,
                message: res?.error ? res?.message : "PLAN ACTUALIZADO CORRECTAMENTE",
            });
        } catch {
            setStatus({ error: true, message: "Error al guardar el plan." });
        } finally {
            setIsLoading(false);
        }
    }, [planSemanal]);

    const ejecutarPlan = useCallback(async () => {
        setIsLoading(true);
        setStatus(null);
        try {
            const res = await postPlanSemanal(planSemanal);
            if (!res?.error) {
                setPlanificacion(res?.data || []);
                setModalVisible(true);
            } else {
                setStatus({ error: true, message: res?.message || "Error al ejecutar el plan." });
            }
        } catch {
            setStatus({ error: true, message: "Error al ejecutar el plan." });
        } finally {
            setIsLoading(false);
        }
    }, [planSemanal]);

    useEffect(() => {
        document.title = "PC - Plan semanal";
        fetchModelos();
    }, [fetchModelos]);

    const selected =
        weekOffset === -1 ? "prev" : weekOffset === 0 ? "actual" : "next";

    return (
        <div>
            <ModalOrdenPlanSemanal
                setStatus={setStatus}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                planificacion={planificacion}
            />

            <div className="flex gap-4 items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button
                        disabled={isLoading}
                        className="bg-slate-300 w-[150px] text-sm disabled:opacity-70 disabled:cursor-not-allowed py-1"
                        onClick={onSubmit}
                    >
                        GUARDAR PLAN
                    </button>

                    <Popconfirm
                        onConfirm={ejecutarPlan}
                        title="Este proceso verificará los cortes requeridos y generará los kanban para producir. ¿Continuar?"
                        okText="Confirmar"
                        okButtonProps={{ className: "bg-green-500" }}
                    >
                        <button
                            disabled={isLoading}
                            className="bg-slate-300 w-[190px] text-sm disabled:opacity-70 disabled:cursor-not-allowed py-1"
                        >
                            GUARDAR Y EJECUTAR
                        </button>
                    </Popconfirm>
                </div>

                <PrintKanbansPlan />

                {!isLoading && status && (
                    <span
                        className={`${status?.error
                                ? "bg-error text-white px-10"
                                : "px-10 bg-green-600 text-white"
                            } font-bold text-lg text-center block`}
                    >
                        {status.message}
                    </span>
                )}
                {isLoading && <Loader />}

                <div className="flex items-center gap-2">
                    <button
                        disabled={selected === "prev"}
                        onClick={() => setWeekOffset(-1)}
                        className={`flex disabled:cursor-not-allowed disabled:opacity-80 items-center gap-1 px-4 py-1 bg-slate-300 text-sm ${selected === "prev" && "!bg-green-500"
                            }`}
                    >
                        <IoIosArrowBack />
                        Semana anterior
                    </button>

                    <button
                        disabled={selected === "actual"}
                        onClick={() => setWeekOffset(0)}
                        className={`flex disabled:cursor-not-allowed disabled:opacity-80 items-center gap-1 px-4 py-1 bg-slate-300 text-sm ${selected === "actual" && "!bg-green-500"
                            }`}
                    >
                        Actual
                    </button>

                    <button
                        disabled={selected === "next"}
                        onClick={() => setWeekOffset(1)}
                        className={`flex disabled:cursor-not-allowed disabled:opacity-80 items-center gap-1 px-4 py-1 bg-slate-300 text-sm ${selected === "next" && "!bg-green-500"
                            }`}
                    >
                        Semana siguiente
                        <IoIosArrowForward />
                    </button>
                </div>
            </div>

            <div className="flex items-start justify-start gap-1 w-full overflow-x-scroll">
                {semana.map((s) => (
                    <TablePlanSemanal
                        key={s.date}
                        setPlan={setPlanSemanal}
                        plan={planByDate.get(s.date) || []}
                        fecha={s.date}
                        title={`${s.name} ${s.date}`}
                    />
                ))}

                {/* Si lo usás como “refetch” por efecto dentro del hijo, lo dejo igual */}
                <TableStockPlanSemanal refetch={modalVisible} />
            </div>
        </div>
    );
}
