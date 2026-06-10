import mainLogo from "@assets/main_logo.jpg";
import { FiExternalLink, FiLock, FiUnlock } from "react-icons/fi";

const categorias = [
    'BUFFER',
    'LECTRA',
    'PC',
    'QC',
    'GENERAL',
    'FMDS',
    'HORA HORA',
    'OTROS'
]

const opciones = [
    {
        link: 'http://192.168.8.16:8001/production/buffer_corte',
        nombre: 'BUFFER COSTURA',
        categoria: 'BUFFER',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/corte/estado',
        nombre: 'BUFFER CORTE',
        categoria: 'BUFFER',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/corte/lectra/1',
        nombre: 'ANDON LECTRA 1',
        categoria: 'LECTRA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/corte/lectra/2',
        nombre: 'ANDON LECTRA 2',
        categoria: 'LECTRA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/corte/lectra/3',
        nombre: 'ANDON LECTRA 3',
        categoria: 'LECTRA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/corte/lectra/4',
        nombre: 'ANDON LECTRA 4',
        categoria: 'LECTRA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8004/wms/reporte/camiones',
        nombre: 'REPORTE CAMIONES',
        categoria: 'PC',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8004/wms/stock_kanbans',
        nombre: 'STOCK KANBANS',
        categoria: 'PC',
        privado: false
    },
    // {
    //     link: 'http://192.168.8.16:8002/fmds',
    //     nombre: 'FMDS',
    //     categoria: 'QC',
    //     privado: false
    // },
    {
        link: 'http://192.168.8.16:8001/calidad/reporte_qr',
        nombre: 'TRAZA QR',
        categoria: 'QC',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001',
        nombre: 'DEFECTOS INTERNOS',
        categoria: 'QC',
        privado: true
    },
    {
        link: 'http://192.168.8.16:8001',
        nombre: 'PLAN CORTE, MODELOS',
        categoria: 'GENERAL',
        privado: true
    },
    {
        link: 'http://192.168.8.16:8004',
        nombre: 'WMS',
        categoria: 'GENERAL',
        privado: true
    },
    {
        link: 'http://192.168.8.16:9050/login',
        nombre: 'ORDEN DE TRABAJO',
        categoria: 'GENERAL',
        privado: true
    },
    {
        link: 'http://192.168.8.16:8001/andon/hora_hora?linea=1',
        nombre: 'HORA HORA M1',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/andon/auditoria_hora_hora',
        nombre: 'AUDITORIA HORA HORA',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/fmds?linea=1',
        nombre: 'FMDS M1',
        categoria: 'FMDS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/andon/hora_hora?linea=2',
        nombre: 'HORA HORA M2',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/fmds?linea=2',
        nombre: 'FMDS M2',
        categoria: 'FMDS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/andon/hora_hora?linea=3',
        nombre: 'HORA HORA M3',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/fmds?linea=3',
        nombre: 'FMDS M3',
        categoria: 'FMDS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/andon/hora_hora?linea=4',
        nombre: 'HORA HORA M4',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/fmds?linea=4',
        nombre: 'FMDS M4',
        categoria: 'FMDS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/andon/hora_hora?linea=5',
        nombre: 'HORA HORA M5',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/fmds?linea=5',
        nombre: 'FMDS M5',
        categoria: 'FMDS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/andon/hora_hora?linea=6',
        nombre: 'HORA HORA M6',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/fmds?linea=6',
        nombre: 'FMDS M6',
        categoria: 'FMDS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/andon/hora_hora?linea=11',
        nombre: 'HORA HORA M11',
        categoria: 'HORA HORA',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/fmds?linea=11',
        nombre: 'FMDS M11',
        categoria: 'FMDS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8011/production',
        nombre: 'TABLERO ASISTENCIA',
        categoria: 'OTROS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8011/admin',
        nombre: 'ADMIN LAYOUT',
        categoria: 'OTROS',
        privado: false
    }
    ,
    {
        link: 'http://192.168.8.16:8002/scrap',
        nombre: 'REPORTE SCRAP',
        categoria: 'OTROS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8002/scrap/manual',
        nombre: 'CARGA SCRAP',
        categoria: 'OTROS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/production/hora_hora',
        nombre: 'HORA HORA HISTORICO',
        categoria: 'OTROS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/public/modelos/qr',
        nombre: 'MASCARAS/DISPOSITIVOS QR',
        categoria: 'OTROS',
        privado: false
    },
    {
        link: 'http://192.168.8.16:8001/public/users/qr-autorizacion',
        nombre: 'QR AUTORIZACION USERS',
        categoria: 'OTROS',
        privado: true
    }
]

export default function LinksPage() {
    return (
        <div className="h-screen w-full overflow-hidden bg-slate-100 text-slate-900">
            <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col gap-2 p-2">
                <header className="flex h-[72px] shrink-0 flex-col gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-md border border-slate-200 bg-white p-1">
                            <img src={mainLogo} className="h-full w-full object-contain" alt="Sewtech" />
                        </div>
                        <div className="min-w-0">
                            <span className="block text-[11px] font-bold uppercase tracking-[0.16em] text-main">Portal interno</span>
                            <h1 className="truncate text-xl font-black leading-tight text-slate-950 sm:text-2xl">
                                Acceso a sistemas y andones
                            </h1>
                        </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs font-bold sm:justify-end">
                        <span className="gap-2 flex items-center rounded-full border border-red-200 bg-red-50 px-4 py-1 text-red-700">
                            <FiLock />
                            Requiere autorizacion
                        </span>
                        <span className="gap-2 flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-emerald-700">
                            <FiUnlock />
                            No requiere autorizacion
                        </span>
                    </div>
                </header>

                <main className="grid  min-h-0 flex-1 grid-cols-4 grid-rows-2 gap-2 overflow-hidden">
                    {categorias?.map((categoria, id) => {
                        const linksCategoria = opciones?.filter((opcion) => opcion.categoria == categoria)

                        return (
                            <section key={`categoria_${id}`} className="flex flex-col rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                                <div className="mb-2 flex h-7 shrink-0 items-center justify-between gap-3 border-b border-slate-100 pb-1.5">
                                    <h2 className="truncate text-sm font-black leading-tight text-slate-950">{categoria}</h2>
                                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-700">
                                        {String(linksCategoria.length).padStart(2, '0')}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 content-start gap-1.5 overflow-hidden [grid-auto-rows:40px]">
                                    {linksCategoria.map((link, idx) => (
                                        <a
                                            key={`opcion_${categoria}_${idx}`}
                                            className={`group flex items-center justify-center h-10 gap-2 rounded-md border px-2.5 text-[11px] font-black uppercase leading-tight text-white shadow-sm transition hover:text-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${link.privado
                                                ? 'border-red-600 bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                                : 'border-emerald-600 bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                                                }`}
                                            target="_blank"
                                            rel="noreferrer"
                                            href={link.link}
                                        >
                                            <span className="line-clamp-2 min-w-0 text-center">{link.nombre}</span>
                                            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15 transition group-hover:bg-white/25">
                                                <FiExternalLink />
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        )
                    })}
                </main>
            </div>
        </div>
    )
}
