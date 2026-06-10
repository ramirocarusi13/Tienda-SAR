import Loader from "@components/Loader";
import { getEstadoLectrasTimeline, setAbastecido } from "@services/LectraService";
import { Table, Tag } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDateTime } from "../../utils/Utils";

const lectras = [{ lectra: 1 }, { lectra: 2 }, { lectra: 3 }, { lectra: 4 }];

const normalizaConsumo = (value) => {
    const parsed = parseFloat(`${value || 0}`.replace(",", "."));
    return Number.isNaN(parsed) ? 0 : parsed;
};

const getTurnoLabel = (turno) => {
    if (turno === "MANANA") return "TURNO MANANA";
    if (turno === "TARDE_NOCHE") return "TURNO TARDE/NOCHE";
    return "TURNO ACTUAL";
};

const toTime = (dateString) => {
    if (!dateString) return "--:--";
    return dateString.slice(11, 16);
};

export default function AbastecimientoLectraPage() {
    const [datosPendientes, setDatosPendientes] = useState([]);
    const [datosTurno, setDatosTurno] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [mostrarAbastecidos, setMostrarAbastecidos] = useState(false);
    const [lectraPrintFilter, setLectraPrintFilter] = useState("ALL");
    const [turnoInfo, setTurnoInfo] = useState({
        turno: null,
        ventana: null
    });

    const componentRefPendientes = useRef();
    const componentRefTurno = useRef();

    const handlePrintPendientes = useReactToPrint({
        content: () => componentRefPendientes.current
    });

    const handlePrintTurno = useReactToPrint({
        content: () => componentRefTurno.current
    });

    const fetchDatos = async () => {
        setIsLoading(true);
        const tmp = await getEstadoLectrasTimeline({ scope: "abastecimiento" });
        const dataAll = tmp?.data?.dados?.filter((d) => d?.group?.indexOf("R-") >= 0) || [];
        const dataPend = dataAll.filter((d) => d?.inicio_real_dado == null);

        setDatosTurno(dataAll);
        setDatosPendientes(dataPend);
        setTurnoInfo({
            turno: tmp?.data?.turno_abastecimiento || null,
            ventana: tmp?.data?.ventana_turno || null
        });
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDatos();
        const interval = setInterval(() => {
            fetchDatos();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const abastecer = async (id, modelo = false) => {
        setIsLoading(true);
        await setAbastecido(id, modelo);
        await fetchDatos();
    };

    const imprimirPendientes = () => {
        setTimeout(() => {
            handlePrintPendientes();
        }, 200);
    };

    const imprimirTurnoCompleto = () => {
        setTimeout(() => {
            handlePrintTurno();
        }, 200);
    };

    const lectrasPrint = useMemo(() => {
        if (lectraPrintFilter === "ALL") return lectras;
        return lectras.filter((l) => `${l.lectra}` === `${lectraPrintFilter}`);
    }, [lectraPrintFilter]);

    const datosTurnoFiltrados = useMemo(() => {
        if (lectraPrintFilter === "ALL") return datosTurno;
        return datosTurno.filter((d) => `${d?.lectra}` === `${lectraPrintFilter}`);
    }, [datosTurno, lectraPrintFilter]);

    const resumenMaterialesTurno = useMemo(() => {
        const map = {};
        datosTurnoFiltrados.forEach((item) => {
            const key = `${item?.material?.codigo_interno || "SIN_COD"}|${item?.material?.nombre || "SIN_MATERIAL"}`;
            if (!map[key]) {
                map[key] = {
                    codigo_interno: item?.material?.codigo_interno || "SIN_COD",
                    material: item?.material?.nombre || "SIN INFO - CONSULTAR CON CORTE",
                    cantidad_dados: 0,
                    total_ml: 0
                };
            }
            map[key].cantidad_dados += 1;
            map[key].total_ml += normalizaConsumo(item?.data_dado?.consumo);
        });

        return Object.values(map).sort((a, b) => `${a.codigo_interno}`.localeCompare(`${b.codigo_interno}`));
    }, [datosTurnoFiltrados]);

    const renderDataByLectra = (lectraId) => {
        if (mostrarAbastecidos) {
            return datosTurno.filter((d) => d.lectra == lectraId);
        }

        return datosPendientes
            .filter((d) => d.lectra == lectraId)
            .filter((d) => d?.abastecido == null || d?.abastecido == false || d?.abastecido == 0);
    };

    return (
        <div className="flex flex-col items-start w-full h-screen">
            <div className="w-full py-1 flex items-center gap-2 justify-end px-2">
                <span className="text-sm font-semibold bg-slate-200 px-2 py-1">
                    {getTurnoLabel(turnoInfo?.turno)} {turnoInfo?.ventana ? `(${toTime(turnoInfo.ventana.inicio)} - ${toTime(turnoInfo.ventana.fin)})` : ""}
                </span>

                <select
                    className="py-1 px-2 text-sm border border-gray-500 bg-white text-black"
                    value={lectraPrintFilter}
                    onChange={(e) => setLectraPrintFilter(e.target.value)}
                    style={{ backgroundColor: "#fff", color: "#000", colorScheme: "light" }}
                >
                    <option value="ALL" style={{ backgroundColor: "#fff", color: "#000" }}>IMPRIMIR: TODAS</option>
                    <option value="1" style={{ backgroundColor: "#fff", color: "#000" }}>IMPRIMIR: LECTRA 1</option>
                    <option value="2" style={{ backgroundColor: "#fff", color: "#000" }}>IMPRIMIR: LECTRA 2</option>
                    <option value="3" style={{ backgroundColor: "#fff", color: "#000" }}>IMPRIMIR: LECTRA 3</option>
                    <option value="4" style={{ backgroundColor: "#fff", color: "#000" }}>IMPRIMIR: LECTRA 4</option>
                </select>

                <button onClick={imprimirPendientes} className="py-1 px-6 text-sm bg-blue-400">
                    IMPRIMIR PENDIENTES
                </button>
                <button onClick={imprimirTurnoCompleto} className="py-1 px-6 text-sm bg-indigo-500 text-white">
                    IMPRIMIR TODO TURNO
                </button>
                <button
                    onClick={() => setMostrarAbastecidos(!mostrarAbastecidos)}
                    className={`py-1 px-6 text-sm ${mostrarAbastecidos ? "bg-orange-400" : "bg-green-300"}`}
                >
                    {mostrarAbastecidos ? "OCULTAR" : "MOSTRAR"} ABASTECIDOS
                </button>
            </div>

            <div className="bg-black relative w-full h-[90vh] grid grid-cols-2">
                {isLoading && (
                    <div className="absolute z-50 w-full h-full flex items-center justify-center bg-gray-400 opacity-50">
                        <Loader fontSize={200} />
                    </div>
                )}

                {lectras.map((l, idx) => (
                    <div key={`lec_${idx}`} className="py-1 h-full w-full flex flex-col border overflow-y-scroll bg-black">
                        <span className="text-2xl py-1 block text-center font-bold text-white bg-blue-600">LECTRA {l?.lectra}</span>

                        <Table
                            className="w-full !bg-black"
                            rootClassName="!bg-black"
                            rowKey={(r) => `${r?.dado}_${r?.inicio}_${r?.id_lectra_estado}`}
                            size="small"
                            dataSource={renderDataByLectra(l.lectra)}
                            loading={isLoading}
                            pagination={false}
                            rowClassName={(record) => {
                                if (record?.abastecido == true || record?.abastecido == 1) {
                                    return "bg-green-600";
                                }
                                return "bg-black";
                            }}
                            columns={[
                                {
                                    dataIndex: "codigo",
                                    title: <span className="font-bold text-lg">MOD</span>,
                                    render: (_, record) => <span className="text-white text-base font-bold">{record?.modelo}</span>
                                },
                                {
                                    dataIndex: "codigo",
                                    title: <span className="font-bold text-lg">COD</span>,
                                    render: (_, record) => <span className="text-white text-base font-bold">{record?.material?.codigo_interno}</span>
                                },
                                {
                                    dataIndex: "codigo",
                                    title: <span className="font-bold text-lg">MATERIAL</span>,
                                    render: (_, record) => {
                                        if (record?.material) {
                                            return <span className="text-white text-base font-bold">{record?.material?.nombre}</span>;
                                        }
                                        return <span className="text-white text-base font-bold bg-red-500 px-1 animate-pulse">SIN INFO - CONSULTAR CON CORTE</span>;
                                    }
                                },
                                {
                                    dataIndex: "codigo",
                                    title: <span className="font-bold text-lg">ML</span>,
                                    render: (_, record) => <span className="text-white text-base font-bold">{record?.data_dado?.consumo}</span>
                                },
                                {
                                    dataIndex: "codigo",
                                    title: <span className="font-bold text-lg">ESTADO</span>,
                                    render: (_, record) => {
                                        if (record?.abastecido == true || record?.abastecido == 1 || record?.abastecido == "1") {
                                            return (
                                                <button onClick={() => abastecer(record?.id_lectra_estado)} className="!p-0 bg-transparent flex items-center justify-center w-full">
                                                    <Tag color="blue-inverse" className="text-base w-full text-center animate-pulse ">
                                                        ABASTECIDO
                                                    </Tag>
                                                </button>
                                            );
                                        }

                                        return (
                                            <button onClick={() => abastecer(record?.id_lectra_estado)} className="!p-0 bg-transparent flex items-center justify-center w-full">
                                                <Tag color="red-inverse" className="text-base animate-pulse text-center">
                                                    ABASTECER {record?.horaInicio}
                                                </Tag>
                                            </button>
                                        );
                                    }
                                }
                            ]}
                        />
                    </div>
                ))}
            </div>

            <div className="w-full px-4 pt-2 hidden print:block" ref={componentRefPendientes}>
                <span className="block w-full text-end text-xs pb-2">FECHA IMPRESION: {formatDateTime(new Date())}</span>
                <span className="block w-full text-start text-xs pb-2">
                    {getTurnoLabel(turnoInfo?.turno)} {turnoInfo?.ventana ? `| ${toTime(turnoInfo.ventana.inicio)} - ${toTime(turnoInfo.ventana.fin)}` : ""}
                </span>

                {lectrasPrint.map((l, idx) => (
                    <div className={`flex flex-col border-b-2 border-black w-full ${l?.lectra == 2 && "break-after-page"}`} key={`pend_${idx}`}>
                        <span className="font-bold text-xl w-full block text-center border-b border-gray-500">LECTRA {l?.lectra} - PENDIENTES</span>
                        {datosPendientes
                            ?.filter((d) => d.lectra == l.lectra)
                            ?.filter((d) => d?.abastecido == null || d?.abastecido == 0)
                            ?.map((i, idxx) => (
                                <div key={`itp_${idxx}`} className="flex gap-2 items-center justify-between w-full border-b border-dotted border-gray-500">
                                    <span className={`${i?.modelo?.length > 4 ? "text-xs w-[250px]" : "w-[200px]"}`}>{i?.modelo}</span>
                                    <span className="w-[130px]">{i?.data_dado?.consumo} ML</span>
                                    <span className="w-[100px]">{i?.horaInicio}</span>
                                    <span className="w-full">
                                        {i?.material?.codigo_interno} - {i?.material?.nombre}
                                    </span>
                                    <span className="w-[400px]">{i?.material?.codigo}</span>
                                    <div className="h-4 w-4 border-black border-2"></div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>

            <div className="w-full px-4 pt-2 hidden print:block" ref={componentRefTurno}>
                <span className="block w-full text-end text-xs pb-2">FECHA IMPRESION: {formatDateTime(new Date())}</span>
                <span className="block w-full text-start text-xs pb-2 font-semibold">
                    REPORTE TOTAL TURNO | {getTurnoLabel(turnoInfo?.turno)} {turnoInfo?.ventana ? `| ${toTime(turnoInfo.ventana.inicio)} - ${toTime(turnoInfo.ventana.fin)}` : ""}
                </span>

                <div className="mb-3 border border-black">
                    <span className="block w-full text-center font-bold border-b border-black">TOTAL MATERIALES TURNO</span>
                    {resumenMaterialesTurno.map((r, idx) => (
                        <div key={`res_${idx}`} className="flex items-center justify-between w-full border-b border-dotted border-gray-500 px-2 py-1">
                            <span className="w-[140px] text-xs">{r.codigo_interno}</span>
                            <span className="flex-1 text-xs">{r.material}</span>
                            <span className="w-[120px] text-right text-xs">DADOS: {r.cantidad_dados}</span>
                            <span className="w-[120px] text-right text-xs">ML: {r.total_ml.toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {lectrasPrint.map((l, idx) => (
                    <div className={`flex flex-col border-b-2 border-black w-full ${l?.lectra == 2 && "break-after-page"}`} key={`turno_${idx}`}>
                        <span className="font-bold text-xl w-full block text-center border-b border-gray-500">LECTRA {l?.lectra} - TODO TURNO</span>
                        {datosTurno
                            ?.filter((d) => d.lectra == l.lectra)
                            ?.map((i, idxx) => (
                                <div key={`itt_${idxx}`} className="flex gap-2 items-center justify-between w-full border-b border-dotted border-gray-500">
                                    <span className={`${i?.modelo?.length > 4 ? "text-xs w-[250px]" : "w-[200px]"}`}>{i?.modelo}</span>
                                    <span className="w-[110px]">{i?.data_dado?.consumo} ML</span>
                                    <span className="w-[80px]">{i?.horaInicio}</span>
                                    <span className="w-full">
                                        {i?.material?.codigo_interno} - {i?.material?.nombre}
                                    </span>
                                    <span className="w-[140px] text-xs">{i?.abastecido ? "ABASTECIDO" : "PENDIENTE"}</span>
                                    <div className="h-4 w-4 border-black border-2"></div>
                                </div>
                            ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
