import { HttpGet, HttpPost, HttpPut } from "./Http"

export const stockPiezas = async (payload) => {
    try {
        const data = await HttpPost('stock/piezas', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const stockPiezasTienda = async (payload) => {
    try {
        const data = await HttpPost('stock/piezasTienda', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const egresoTienda = async (payload) => {
    try {
        const data = await HttpPost('tienda/egreso', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const egresoTiendaPedido = async (pedidoId) => {
    try {
        const data = await HttpGet(`tienda/egreso_pedido/${pedidoId}`)
        return data
    } catch (error) {
        return error
    }
}

export const ingresoTienda = async (payload) => {
    try {
        const data = await HttpPost('tienda/ingreso', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const capacidadProduccion = async (payload = []) => {
    try {
        const data = await HttpPost('capacidadProduccion', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const capacidadProduccionDepositos = async () => {
    try {
        const data = await HttpGet('capacidadProduccionDepositos')
        return data
    } catch (error) {
        return error
    }
}

export const getInventarioMaterialesData = async (date, detailed = false, tipo = null, sector = null) => {
    try {
        const payload = {
            fecha: date,
            detailed: detailed ? 1 : 0,
            tipo: tipo,
            sector: sector
        }
        const data = await HttpPost("inventarios", JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getInventarioMaterial = async (materialId, fecha, userId = null) => {
    try {
        const payload = {
            material: materialId,
            fecha: fecha,
            userId: userId
        }
        const data = await HttpPost(`inventarios/material`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const updatePesaje = async (id, payload) => {
    try {
        const data = await HttpPut(`inventarios/editarpesaje/${id}`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const updateInventarioMaterialesResultado = async (materialId, payload) => {
    try {
        const data = await HttpPut(`inventarios/materiales/resultado/${materialId}`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const stockLogisticaMesModelo = async (modelo = null) => {
    try {
        const data = await HttpGet(`logistica/stock/${modelo}`)
        return data
    } catch (error) {
        return error
    }
}

export const getStockLogisticaKanbanModificacion = async (kanban) => {
    try {
        const data = await HttpGet(`logistica/stock/modificacion/${kanban}`)
        return data
    } catch (error) {
        return error
    }
}


export const setStockLogisticaMesModelo = async (payload) => {
    try {
        const data = await HttpPost('logistica/stock', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getCuarentena = async () => {
    try {
        const data = await HttpGet(`calidad/cuarentena`)
        return data
    } catch (error) {
        return error
    }
}


export const cambiarEstadoCuarentena = async (codigoKanban, payload) => {
    try {
        const data = await HttpPut(`calidad/cuarentena/${codigoKanban}`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const actualizaStockLogistica = async (payload) => {
    try {
        const data = await HttpPut(`logistica/stock`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const filterStockLogistica = async (payload) => {
    try {
        const data = await HttpPost('logistica/stock/filters', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const setConfirmarPesaje = async (id) => {
    try {
        const data = await HttpGet(`inventario_materiales_piezas/confirmaPesaje/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const reporteStock = async (payload) => {
    try {
        const data = await HttpPost('stock/reporte', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}
