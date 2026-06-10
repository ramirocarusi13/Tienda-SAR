import { Button, Checkbox, Select, Spin } from "antd";
import QRCode from "react-qr-code";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { getModelosWms, getPartesByModeloWms } from "@services/ModelService";

const qrTypes = {
    MASCARA: "mascara",
    DISPOSITIVO: "dispositivo",
};

const normalizeTipo = (tipo) => {
    const value = tipo?.toUpperCase()?.trim();

    if (value === "BACK") return "BC";
    if (value === "CUSHION") return "CS";

    return value;
};

const normalizeLado = (lado) => {
    const value = lado?.toUpperCase()?.trim();

    return value === "-" ? "" : value;
};

const buildQrValue = ({ modelo, tipo, lado, qrType }) => {
    const parts = [modelo, tipo, lado].filter(Boolean);

    if (qrType === qrTypes.DISPOSITIVO) {
        return ["D", ...parts].join("|");
    }

    return parts.join("|");
};

const buildQrLabel = ({ modelo, tipo, lado }) => [modelo, tipo, lado].filter(Boolean).join(" ");

export default function ModeloPartesQrPrintPage() {
    const printRef = useRef(null);
    const [modelos, setModelos] = useState([]);
    const [selectedModeloId, setSelectedModeloId] = useState(null);
    const [selectedTypes, setSelectedTypes] = useState([qrTypes.MASCARA]);
    const [partes, setPartes] = useState([]);
    const [isLoadingModelos, setIsLoadingModelos] = useState(false);
    const [isLoadingPartes, setIsLoadingPartes] = useState(false);
    const [error, setError] = useState("");

    const selectedModelo = useMemo(() => {
        return modelos.find((modelo) => modelo.id === selectedModeloId);
    }, [modelos, selectedModeloId]);

    const qrItems = useMemo(() => {
        if (!selectedModelo?.nombre) return [];

        const items = partes.flatMap((parte) => {
            const tipo = normalizeTipo(parte?.tipo?.tipo);
            const lado = normalizeLado(parte?.lado?.lado);

            if (!tipo) return [];

            return selectedTypes.map((qrType) => {
                const value = buildQrValue({
                    modelo: selectedModelo.nombre,
                    tipo,
                    lado,
                    qrType,
                });

                return {
                    key: `${qrType}-${value}`,
                    value,
                    label: buildQrLabel({ modelo: selectedModelo.nombre, tipo, lado }),
                    qrType,
                };
            });
        });

        return [...new Map(items.map((item) => [item.key, item])).values()];
    }, [partes, selectedModelo, selectedTypes]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    useEffect(() => {
        const fetchModelos = async () => {
            setIsLoadingModelos(true);
            setError("");

            try {
                const response = await getModelosWms();

                // console.log("Modelos response:", response);
                if (response?.error) {
                    setError(response?.message || "No se pudieron obtener los modelos.");
                    return;
                }

                setModelos(response?.data || []);
            } catch (err) {
                setError("No se pudieron obtener los modelos.");
            } finally {
                setIsLoadingModelos(false);
            }
        };

        fetchModelos();
    }, []);

    const handleLoadPartes = async () => {
        if (!selectedModeloId) {
            setError("Seleccione un modelo.");
            return;
        }

        if (!selectedTypes.length) {
            setError("Seleccione mascara, dispositivo o ambos.");
            return;
        }

        setIsLoadingPartes(true);
        setError("");
        setPartes([]);

        try {
            const response = await getPartesByModeloWms(selectedModeloId);

            // console.log("Partes response:", response);
            if (response?.error) {
                setError(response?.message || "No se pudieron obtener las partes del modelo.");
                return;
            }

            setPartes(response?.data || []);
        } catch (err) {
            setError("No se pudieron obtener las partes del modelo.");
        } finally {
            setIsLoadingPartes(false);
        }
    };

    return (
        <div className="min-h-screen bg-white p-4 text-slate-900 print:p-0">
            <div className="mx-auto max-w-6xl print:hidden">
                <div className="mb-4 border-b border-slate-200 pb-3">
                    <h1 className="text-2xl font-bold">Impresion QR partes modelo</h1>
                    <p className="text-sm text-slate-600">Pagina publica sin login</p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
                    <div>
                        <span className="mb-1 block text-sm font-semibold">Modelo</span>
                        <Select
                            className="w-full"
                            showSearch
                            size="large"
                            loading={isLoadingModelos}
                            value={selectedModeloId}
                            optionFilterProp="label"
                            placeholder="Seleccione un modelo"
                            onChange={setSelectedModeloId}
                            options={modelos.map((modelo) => ({
                                value: modelo.id,
                                label: modelo.nombre,
                            }))}
                        />
                    </div>

                    <div>
                        <span className="mb-1 block text-sm font-semibold">Tipo QR</span>
                        <Checkbox.Group
                            className="flex h-10 items-center gap-4"
                            value={selectedTypes}
                            onChange={setSelectedTypes}
                            options={[
                                { label: "Mascara", value: qrTypes.MASCARA },
                                { label: "Dispositivo", value: qrTypes.DISPOSITIVO },
                            ]}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button size="large" onClick={handleLoadPartes} loading={isLoadingPartes}>
                            Generar
                        </Button>
                        <Button size="large" onClick={handlePrint} disabled={!qrItems.length}>
                            Imprimir
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="mt-3 rounded border border-red-200 bg-red-50 p-2 text-sm font-semibold text-red-700">
                        {error}
                    </div>
                )}

                {isLoadingPartes && (
                    <div className="mt-8 flex justify-center">
                        <Spin />
                    </div>
                )}
            </div>

            <div ref={printRef} className="mx-auto mt-6 max-w-6xl print:mt-0 print:max-w-none">
                {qrItems.length > 0 && (
                    <div className="mb-4 hidden text-center print:block">
                        <span className="text-2xl font-bold">{selectedModelo?.nombre}</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 md:grid-cols-4 print:grid-cols-3 print:gap-10">
                    {qrItems.map((item) => (
                        <div key={item.key} className="flex break-inside-avoid flex-col items-center">
                            <QRCode value={item.value} size={150} />
                            <span className="mt-2 block text-center text-xl font-bold">{item.label}</span>
                            {item.qrType === qrTypes.DISPOSITIVO && (
                                <span className="block text-center text-sm font-semibold">DISPOSITIVO</span>
                            )}
                        </div>
                    ))}
                </div>

                {!isLoadingPartes && !qrItems.length && (
                    <div className="mt-12 text-center text-slate-500 print:hidden">
                        Seleccione un modelo y genere los QR.
                    </div>
                )}
            </div>
        </div>
    );
}
