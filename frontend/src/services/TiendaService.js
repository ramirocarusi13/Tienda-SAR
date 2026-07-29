import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const getPedidosPendientes = async () => {

    try {
        const data = await HttpGet("tienda/pedidos")
        return data
    } catch (error) {
        return error
    }
}

export const getPedidosEntrantes = async () => {

    try {
        const data = await HttpGet("tienda/pedidos/entrantes")
        return data
    } catch (error) {
        return error
    }
}

export const getEtiquetas = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams()

        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                queryParams.append(key, value)
            }
        })

        const query = queryParams.toString()
        const data = await HttpGet(`tienda/etiquetas${query ? `?${query}` : ''}`)
        return data
    } catch (error) {
        return error
    }
}


export const getInfoByKanban = async (kanban) => {
    try {
        const data = await HttpGet(`tienda/info/${kanban}`)
        return data
    } catch (error) {
        return error
    }
}


export const setPedido = async (payload) => {
    try {
        const data = await HttpPost(`tienda/pedido`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const fetchDataFromPedido = async (kanban) => {
    try {
        const data = await HttpGet(`tienda/pedido/${kanban}`)
        return data
    } catch (error) {
        return error
    }
}


export const finalizarPedidoTienda = async (payload) => {
    try {
        const data = await HttpPost(`tienda/pedido/finalizar`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}
