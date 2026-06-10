import { Alert, Button, Input, Select, Spin } from "antd";
import QRCode from "react-qr-code";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { FiLogIn, FiPrinter, FiRefreshCw, FiSearch, FiX } from "react-icons/fi";
import { getUsersQrAutorizacion, validarImpresionQrAutorizacion } from "@services/UserService";

const getUserLabel = (user) => user?.email || user?.name || "";
const getUserSector = (user) => [user?.departamento, user?.area].filter(Boolean).join(" - ");
const isCalidad = (user) => String(user?.departamento || "").trim().toUpperCase() === "CALIDAD";

export default function UserAuthorizationQrPrintPage() {
    const printRef = useRef(null);
    const [codigo, setCodigo] = useState("");
    const [authCode, setAuthCode] = useState("");
    const [authUser, setAuthUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [sector, setSector] = useState("");
    const [selectedIds, setSelectedIds] = useState([]);
    const [isAuthLoading, setIsAuthLoading] = useState(false);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [error, setError] = useState("");

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
    });

    const fetchUsers = async (filters = {}) => {
        const codigoAutorizante = filters.codigo || authCode;

        if (!codigoAutorizante) return;

        setIsUsersLoading(true);
        setError("");

        try {
            const response = await getUsersQrAutorizacion({
                codigo: codigoAutorizante,
                search: filters.search || "",
                sector: filters.sector || "",
            });

            if (response?.error) {
                setError(response?.message || "No se pudieron obtener los usuarios.");
                return;
            }

            setUsers(response?.data || []);
            setSelectedIds([]);
        } catch (err) {
            setError("No se pudieron obtener los usuarios.");
        } finally {
            setIsUsersLoading(false);
        }
    };

    const handleAuth = async (event) => {
        event?.preventDefault();

        if (!codigo.trim()) {
            setError("Ingrese el codigo de autorizacion.");
            return;
        }

        setIsAuthLoading(true);
        setError("");

        try {
            const response = await validarImpresionQrAutorizacion(codigo.trim());

            if (response?.error) {
                setError(response?.message || "Codigo de autorizacion invalido.");
                return;
            }

            setAuthUser(response?.data);
            setAuthCode(codigo.trim());
            setCodigo("");
            await fetchUsers({ codigo: codigo.trim() });
        } catch (err) {
            setError("No se pudo verificar el codigo de autorizacion.");
        } finally {
            setIsAuthLoading(false);
        }
    };

    const sectorOptions = useMemo(() => {
        const values = users
            .flatMap((user) => [user?.departamento, user?.area])
            .filter(Boolean)
            .map((value) => String(value).trim())
            .filter(Boolean);

        return [...new Set(values)]
            .sort((a, b) => a.localeCompare(b))
            .map((value) => ({ value, label: value }));
    }, [users]);

    const filteredUsers = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();
        const normalizedSector = sector.trim().toLowerCase();

        return users.filter((user) => {
            const searchable = [
                user?.name,
                user?.email,
                user?.departamento,
                user?.area,
                user?.turno,
            ].filter(Boolean).join(" ").toLowerCase();

            const sectorText = getUserSector(user).toLowerCase();
            const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);
            const matchesSector = !normalizedSector || sectorText.includes(normalizedSector);

            return matchesSearch && matchesSector;
        });
    }, [users, search, sector]);

    const selectedUsers = useMemo(() => {
        if (!selectedIds.length) return filteredUsers;

        const selected = new Set(selectedIds);
        return filteredUsers.filter((user) => selected.has(user.id));
    }, [filteredUsers, selectedIds]);

    const toggleUser = (userId) => {
        setSelectedIds((current) => {
            if (current.includes(userId)) {
                return current.filter((id) => id !== userId);
            }

            return [...current, userId];
        });
    };

    const clearFilters = () => {
        setSearch("");
        setSector("");
        setSelectedIds([]);
    };

    useEffect(() => {
        if (!authUser) return;

        setSelectedIds((current) => current.filter((id) => filteredUsers.some((user) => user.id === id)));
    }, [filteredUsers, authUser]);

    if (!authUser) {
        return (
            <div className="min-h-screen bg-white p-4 text-slate-900">
                <div className="mx-auto max-w-md">
                    <div className="mb-4 border-b border-slate-200 pb-3">
                        <h1 className="text-2xl font-bold">Impresion QR autorizacion</h1>
                        <p className="text-sm text-slate-600">Requiere group leader o usuario de Calidad</p>
                    </div>

                    <form onSubmit={handleAuth} className="flex flex-col gap-3">
                        <div>
                            <span className="mb-1 block text-sm font-semibold">Codigo de autorizacion</span>
                            <Input.Password
                                size="large"
                                value={codigo}
                                autoFocus
                                placeholder="Escanee o ingrese el codigo"
                                onChange={(event) => setCodigo(event.target.value)}
                            />
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            htmlType="submit"
                            loading={isAuthLoading}
                            icon={<FiLogIn />}
                        >
                            Verificar
                        </Button>
                    </form>

                    {error && <Alert className="mt-3" type="error" showIcon message={error} />}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-4 text-slate-900 print:p-0">
            <div className="mx-auto max-w-6xl print:hidden">
                <div className="mb-4 border-b border-slate-200 pb-3">
                    <h1 className="text-2xl font-bold">Impresion QR autorizacion</h1>
                    <p className="text-sm text-slate-600">
                        Autorizado: {getUserLabel(authUser)} - {isCalidad(authUser) ? "Calidad" : "GL o superior"}.
                        {" "}Solo se muestran usuarios hasta rol GL.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_260px_auto] md:items-end">
                    <div>
                        <span className="mb-1 block text-sm font-semibold">Nombre</span>
                        <Input
                            size="large"
                            allowClear
                            prefix={<FiSearch />}
                            value={search}
                            placeholder="Buscar por nombre"
                            onChange={(event) => setSearch(event.target.value)}
                        />
                    </div>

                    <div>
                        <span className="mb-1 block text-sm font-semibold">Sector</span>
                        <Select
                            className="w-full"
                            showSearch
                            allowClear
                            size="large"
                            value={sector || undefined}
                            placeholder="Todos"
                            optionFilterProp="label"
                            onChange={(value) => setSector(value || "")}
                            options={sectorOptions}
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button size="large" onClick={() => fetchUsers({ search, sector })} loading={isUsersLoading} icon={<FiRefreshCw />}>
                            Buscar
                        </Button>
                        <Button size="large" onClick={clearFilters} icon={<FiX />}>
                            Limpiar
                        </Button>
                        <Button size="large" onClick={handlePrint} disabled={!selectedUsers.length} icon={<FiPrinter />}>
                            Imprimir
                        </Button>
                    </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
                    <span>
                        {filteredUsers.length} usuarios encontrados
                        {selectedIds.length ? ` - ${selectedIds.length} seleccionados` : ""}
                    </span>
                    <span>Seleccione tarjetas para imprimir solo algunas.</span>
                </div>

                {error && <Alert className="mt-3" type="error" showIcon message={error} />}

                {isUsersLoading && (
                    <div className="mt-8 flex justify-center">
                        <Spin />
                    </div>
                )}
            </div>

            <div ref={printRef} className="mx-auto mt-6 max-w-6xl print:mt-0 print:max-w-none">
                {selectedUsers.length > 0 && (
                    <div className="mb-4 hidden text-center print:block">
                        <span className="text-2xl font-bold">QR codigos de autorizacion</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3 md:grid-cols-4 print:grid-cols-3 print:gap-10">
                    {filteredUsers.map((user) => {
                        const isSelected = selectedIds.includes(user.id);
                        const shouldPrint = !selectedIds.length || isSelected;

                        return (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => toggleUser(user.id)}
                                className={`flex break-inside-avoid flex-col items-center rounded border p-3 transition print:border-0 print:p-0 ${isSelected
                                    ? "border-main bg-blue-50"
                                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                                    } ${shouldPrint ? "" : "print:hidden"}`}
                            >
                                <QRCode value={user.cod_autorizacion} size={150} />
                                <span className="mt-2 block text-center text-xl font-bold">{getUserLabel(user)}</span>
                                {getUserSector(user) && (
                                    <span className="block text-center text-sm font-semibold">{getUserSector(user)}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {!isUsersLoading && !filteredUsers.length && (
                    <div className="mt-12 text-center text-slate-500 print:hidden">
                        No hay usuarios para los filtros seleccionados.
                    </div>
                )}
            </div>
        </div>
    );
}
