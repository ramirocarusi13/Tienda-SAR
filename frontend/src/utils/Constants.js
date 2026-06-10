export const routesNames = {
    INDEX: '/',
    LINKS: '/links',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    CONFIGURATION: '/configuration',
    IMPRESION_ETIQUETAS_DEV: '/cfg/impresion_et',
    GANTT: '/gantt',
    CONFIG: {
        BUFFER: '/config/buffer'
    },
    KANBAN: {
        REPORT: '/kanban/reporte'
    },
    PUBLIC: {
        QR_PARTES_MODELO: '/public/modelos/qr',
        QR_USERS_AUTORIZACION: '/public/users/qr-autorizacion'
    },
    ANDON: {
        LINEAS: '/andon/lineas',
        DEFECTOS_LINEA_HORAHORA: '/andon/defectos/linea_hora_hora',
        HORA_HORA: 'andon/hora_hora',
        AUDITORIA_HORA_HORA: 'andon/auditoria_hora_hora'
    },
    PRODUCTION: {
        KANBAN_HISTORY: '/production/kanban/history',
        KANBAN_CREATE: '/production/kanban_create',
        KANBAN_LIST: '/production/kanbans',
        KANBAN_PRINT: '/production/kanban_print',
        KANBAN_BLOCK: '/production/kanban_block',
        BUFFER_IN: '/production/buffer',
        BUFFER_CORTE: '/production/buffer_corte',
        SUBASSY_IN: '/production/subassy',
        ASSY_IN: '/production/assy',
        CORTE_IN: '/production/corte',
        LECTRAS: '/production/lectras',
        PANEL_OPERACIONES: '/production/panel_operaciones',
        PANEL_OPERACIONES_LINEA: '/production/panel_operaciones_linea',
        PANEL_OPERACIONES_LINEA_USER: '/production/panel_operaciones_linea/user',
        // RETRABAJO: '/production/retrabajo',
        CONTRAMEDIDA: '/production/contramedidas',
        HORA_HORA: '/production/hora_hora',
        MODIFICAR_TIEMPOS_CORTE: '/production/modificar_tiempos_corte',
        REPORTE_HORA_HORA: '/production/reporte_hora_hora'
    },
    MODELS: {
        ABM: '/master/models'
    },
    IMPORT: {
        PIEZAS: '/import/piezas',
        MATERIALES_PIEZAS: '/import/materiales_piezas',
        DADOS: '/import/dados',
        MATERIALES_PIEZAS_PROV: '/import/materiales_piezas_prov',
        DATOS_CORTE: '/import/datos_corte',
        FALLAS: '/import/fallas',
        TIENDA: '/import/tienda',
    },
    STOCK: {
        PIEZAS: '/stock/piezas',
        TIENDA_EGRESO: '/stock/egreso/tienda',
        TIENDA_INGRESO: '/stock/ingreso/tienda',
        TIENDA_INGRESO_MANUAL: '/stock/ingreso/manual/tienda',
        TIENDA_STOCK: '/stock/tienda',
        INVENTARIO_MATERIALES: '/stock/inventario/materiales',
        INVENTARIO_CUEROS: '/stock/inventario/cueros',
        INVENTARIO_MATERIALES_RESULTADO: '/stock/inventario/materiales/resultado',
        INVENTARIO_CUEROS_RESULTADO: '/stock/inventario/cueros/resultado',
        INVENTARIO_MATERIALES_EDIT: '/stock/inventario/materiales/editar'
    },
    TABLAS: {
        INDEX: '/tablas',
        LINEAS: '/lineas'
    },
    LOGISTICA: {
        STOCK_DISPONIBLE: '/logistica/stock',
        REPORTE_RUNS_KANBAN: '/logistica/reporte'
    },
    CALIDAD: {
        CUARENTENA: '/calidad/cuarentena',
        FIN_DE_LINEA: '/calidad/fin_de_linea',
        REPORTE_INTERNO_DEFECTOS: '/calidad/reporte_defectos',
        CONTROL_STRAP: '/calidad/control_strap',
        REGISTRO_EGRESO_STRAP: '/calidad/registro_egreso_strap',
        // IMPRESION_ETIQUETAS_USER: '/calidad/impresion_et',
        REPORTE_TRAZA_AIRBAG: '/calidad/reporte_trazabilidad',
        REPORTE_ETIQUETA_QR: '/calidad/reporte_qr',
        ANALISIS_DEFECTO: '/calidad/analisis_defectos'
    },
    CORTE: {
        INDEX: '/corte',
        STATUS: '/corte/estado',
        PLAN: '/corte/plan',
        GESTION_DADOS: '/corte/gestion',
        LECTRA_ESTADO: '/corte/lectra',
        ACTUALIZAR_TIEMPOS: '/corte/actualizar'
    },
    PC: {
        PENDIENTES_IMPRESION: '/pc/planificacion',
        MINIMOS_MODELOS: '/pc/minimos',
        PLAN: '/pc/plan_semanal',
        REIMPRIMIR: '/pc/reimprimir_kanbans',
        LAYOUT: '/pc/layout',
        TRASVASO: '/pc/trasvaso',
        DESPACHO: '/pc/despacho',
        ALMACENAR: '/pc/almacenar',
        REPORTE_STOCK: '/pc/reporte_stock',
        ABASTECIMIENTO_LECTRAS: '/pc/abastecimiento',
        FINISH_GOOD: '/pc/finish_good',
        MOVIMIENTOS_FG: '/pc/movimientos_fg'
    },
    TIENDA: {
        IMPRESION_ETQ: '/tienda/etiquetas',
        PEDIDO_REPOSICION: '/tienda/pedido',
        EGRESO: '/tienda/egreso'
    }
}

export const meses = [
    { label: 'Enero', value: '01' },
    { label: 'Febrero', value: '02' },
    { label: 'Marzo', value: '03' },
    { label: 'Abril', value: '04' },
    { label: 'Mayo', value: '05' },
    { label: 'Junio', value: '06' },
    { label: 'Julio', value: '07' },
    { label: 'Agosto', value: '08' },
    { label: 'Septiembre', value: '09' },
    { label: 'Octubre', value: '10' },
    { label: 'Noviembre', value: '11' },
    { label: 'Diciembre', value: '12' },
]

export const estados = {
    EN_CORTE: 1,
    EN_BUFFER: 2,
    SUB_ASSY: 3,
    COSTURA: 4,
    CALIDAD: 5,
    FINALIZADO: 6,
    GENERADO: 7,
    DEFECTO: 8,
    RECHAZADO: 9,
    APROBADO: 10,
    REVISION: 11,
    PLANIFICADO: 12,
    EN_REVISION_CORTE: 13,
    EN_PLANIFICACION: 14,
    EN_BUFFER_CORTE: 15,
    ANULADO: 16
}

export const depositos = {
    ALMACEN: 1,
    BUFFER: 2,
    SUB_ASSY: 3,
    COSTURA: 4,
    TIENDA: 5,
    SCRAP: 6,
    CORTE: 7,
    RACKS: 8,
    DOLLYS: 9,
    TEMPORAL_A: 10,
    TEMPORAL_B: 11
}

export const TIPO_KANBAN = {
    PRODUCTIVO: 'P',
    REEMPLAZO: 'R'
}

export const ROLES = {
    DESARROLLO: 1,
    ADMINISTRADOR: 2,
    KANBAN: 3,
    BUFFER: 4,
    TIENDA: 5,
    SUBASSY: 6,
    COSTURA: 7,
    LOGISTICA: 8,
    CALIDAD: 9,
    IT: 10,
    INVENTARIO: 11,
    STRAP: 12
}

export const TIPO_MATERIALES = {
    TELA: 'TELA',
    CUERO: 'CUERO'
}

export const estadosRetrabajo = {
    PENDIENTE: 'PENDIENTE',
    RETRABAJADO: 'RETRABAJADO',
    RECHAZADO: 'RECHAZADO',
    SCRAP: 'SCRAP'
}

export const jerarquias = {
    MEMBER: 10,
    UTILITY: 15,
    TEAM_LEADER: 20,
    GROUP_LEADER: 30,
    JEFE: 40,
    COORDINADOR: 50,
    GERENTE: 60,
    DEV: 70
}

export const siglaJerarquia = {
    10: 'TM',
    15: 'UT',
    20: 'TL',
    30: 'GL',
    40: 'JF',
    50: 'CO',
    60: 'GE',
    70: 'DE',
    0: ''
}

export const sectoresInventario = [
    {
        value: 'tienda',
        label: 'Tienda'
    },
    {
        value: 'bufferhr',
        label: 'Buffer H/R'
    },
    {
        value: 'doortrimplanta',
        label: 'Door Trim Planta'
    },
    {
        value: 'corte',
        label: 'Corte'
    },
    {
        value: 'cajassobrestock',
        label: 'Cajas Sobre Stock'
    },
    {
        value: 'carrossobrestock',
        label: 'Carros Sobre Stock'
    }
]


export const sectoresInventarioCueros = [
    {
        value: 'tiendadesbalanceo',
        label: 'Tienda Desbalanceo'
    },
    {
        value: 'desbalanceod',
        label: 'Desbalanceo Depósito'
    },
    {
        value: 'depoestanteria',
        label: 'Depósito sets completos (estantería)'
    },
    {
        value: 'deporampa',
        label: 'Depósito sets completos (rampa)'
    },
    {
        value: 'depopiso',
        label: 'Depósito sets completos (piso)'
    },
    {
        value: 'uchikiri',
        label: 'Uchikiri'
    },
    {
        value: 'depositoexterno',
        label: 'Depósito Externo'
    }
]
