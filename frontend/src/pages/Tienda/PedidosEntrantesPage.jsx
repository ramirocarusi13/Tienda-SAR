import Loader from "@components/Loader";
import { useQuery } from "@tanstack/react-query";
import { Tag } from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import AutoDismissMessage from "../../components/AutoDismissMessage";
import { getPedidosEntrantes } from "../../services/TiendaService";
import { diferenciaTiempo, formatDateTime } from "../../utils/Utils";

const REFRESH_INTERVAL = 5000;

const getModeloPedido = (pedido) => pedido?.items?.[0]?.pieza?.parte?.modelo?.[0]?.nombre || "SIN MODELO";

const getLineaPedido = (pedido) => pedido?.linea?.nombre || pedido?.linea?.codigo || (pedido?.linea_id ? `M${pedido.linea_id}` : "SIN LINEA");

const getTotalPiezas = (pedido) => pedido?.items?.reduce((total, item) => total + parseInt(item?.cantidad || 0), 0) || 0;

const getOrigenPedido = (pedido) => {
    if (pedido?.kanban_id) {
        return "SCRAP / KANBAN";
    }

    if (pedido?.linea_id) {
        return "LINEA";
    }

    return "MANUAL";
};

const esReciente = (pedido) => {
    if (!pedido?.created_at) {
        return false;
    }

    return (new Date().getTime() - new Date(pedido.created_at).getTime()) < 90000;
};

const PedidoEntranteCard = ({ pedido }) => {
    const reciente = esReciente(pedido);

    return (
        <div className={`min-h-[265px] border-2 p-4 flex flex-col justify-between ${reciente ? "border-red-500 bg-red-950" : "border-zinc-700 bg-zinc-900"}`}>
            <div>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-xl font-semibold">PEDIDO #{pedido.id}</span>
                        <span className="text-white text-5xl font-bold leading-tight">{getLineaPedido(pedido)}</span>
                    </div>
                    {reciente && <Tag color="red-inverse" className="!text-lg !px-3 !py-1">NUEVO</Tag>}
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    <Tag color="volcano" className="!text-base">{getOrigenPedido(pedido)}</Tag>
                    <Tag color="blue" className="!text-base">{getModeloPedido(pedido)}</Tag>
                    {pedido?.falla?.nombre && <Tag color="red" className="!text-base">{pedido.falla.nombre}</Tag>}
                    <Tag color="purple" className="!text-base">Hace {diferenciaTiempo(pedido?.created_at)}</Tag>
                </div>
            </div>

            <div className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                    {pedido?.items?.slice(0, 6)?.map((item) => (
                        <div key={item.id} className="bg-zinc-800 border border-zinc-700 px-3 py-2">
                            <span className="block text-zinc-300 text-sm">x{item?.cantidad}</span>
                            <span className="block text-white text-xl font-semibold truncate">{item?.pieza?.codigo}</span>
                        </div>
                    ))}
                </div>
                {pedido?.items?.length > 6 && <span className="block mt-2 text-zinc-300 text-sm">+{pedido.items.length - 6} piezas mas</span>}
            </div>

            <div className="mt-4 flex items-end justify-between border-t border-zinc-700 pt-3">
                <span className="text-zinc-300 text-lg">{pedido?.user?.email?.toUpperCase() || "SIN USUARIO"}</span>
                <span className="text-white text-4xl font-bold">{getTotalPiezas(pedido)} piezas</span>
            </div>
        </div>
    );
};

export default function PedidosEntrantesPage() {
    const pedidosConocidosRef = useRef([]);
    const [status, setStatus] = useState({ message: null, error: false, rand: null });
    const [now, setNow] = useState(new Date());

    const query = useQuery({
        queryKey: ["pedidos_entrantes_tienda"],
        queryFn: async () => {
            const data = await getPedidosEntrantes();

            return {
                items: data?.data || [],
                fecha: new Date()
            };
        },
        staleTime: 1000,
        refetchInterval: REFRESH_INTERVAL
    });

    const pedidos = useMemo(() => query?.data?.items || [], [query?.data?.items]);

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const ids = pedidos.map((pedido) => pedido.id);

        if (pedidosConocidosRef.current.length > 0) {
            const nuevos = pedidos.filter((pedido) => !pedidosConocidosRef.current.includes(pedido.id));

            if (nuevos.length > 0) {
                setStatus({
                    error: false,
                    message: `Nuevo pedido #${nuevos[0].id}`,
                    rand: Math.random()
                });
            }
        }

        pedidosConocidosRef.current = ids;
    }, [pedidos]);

    return (
        <div className="min-h-screen bg-neutral-950 text-white relative">
            <div className="sticky top-0 z-10 bg-neutral-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-5xl font-bold leading-none">PEDIDOS ENTRANTES</span>
                    <span className="text-zinc-400 text-lg">Pantalla de visualizacion de Tienda</span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <span className="block text-zinc-400 text-sm">Actualizado</span>
                        <span className="block text-white text-xl font-semibold">{query?.data?.fecha ? formatDateTime(query.data.fecha) : "-"}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-zinc-400 text-sm">Hora</span>
                        <span className="block text-white text-4xl font-bold">{now.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="bg-red-600 min-w-[150px] px-5 py-3 text-center">
                        <span className="block text-sm font-semibold">PENDIENTES</span>
                        <span className="block text-5xl font-bold leading-none">{pedidos.length}</span>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {query?.isLoading &&
                    <div className="h-[70vh] flex items-center justify-center">
                        <Loader fontSize={120} />
                    </div>
                }

                {!query?.isLoading && pedidos.length == 0 &&
                    <div className="h-[70vh] flex items-center justify-center">
                        <span className="text-6xl font-bold text-zinc-500">SIN PEDIDOS PENDIENTES</span>
                    </div>
                }

                {!query?.isLoading && pedidos.length > 0 &&
                    <div className="grid grid-cols-3 gap-4">
                        {pedidos.map((pedido) => (
                            <PedidoEntranteCard key={pedido.id} pedido={pedido} />
                        ))}
                    </div>
                }
            </div>

            {query?.isFetching && !query?.isLoading && <span className="fixed bottom-3 right-4 text-zinc-500 text-sm">Actualizando...</span>}

            {status?.message &&
                <AutoDismissMessage
                    message={status.message}
                    type={status.error ? "error" : "success"}
                    duration={5000}
                    random={status.rand}
                />
            }
        </div>
    );
}
