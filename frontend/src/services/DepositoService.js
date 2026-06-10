import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const consultarPosicion = async (payload) => {
    try {
        const data = await HttpPost('ubicacion/consultar', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const consultarKanbanPosicionLibre = async (payload) => {
    try {
        const data = await HttpPost('ubicacion/kanban', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const almacenarEnDeposito = async (payload) => {
    try {
        const data = await HttpPost('deposito/almacenar', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const fetchPendientes = async () => {
    try {
        const data = await HttpGet('despachos/pendientes')
        return data
    } catch (error) {
        return error
    }
}


export const fetchHistorial = async () => {
    try {
        const data = await HttpGet('pc/despachos_historial')
        return data
    } catch (error) {
        return error
    }
}


export const verificaYPickea = async (payload) => {
    try {
        const data = await HttpPost('despachos/verifica', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }

}

export const consultaModelosDespacho = async (payload, conReserva = false) => {
    try {
        const data = await HttpPost('despachos/consulta', JSON.stringify({ pedido: payload, conReserva }))
        return data
    } catch (error) {
        return error
    }
}


export const guardarDespacho = async (payload) => {
    try {
        const data = await HttpPost('despachos', JSON.stringify({ pedido: payload }))
        return data
    } catch (error) {
        return error
    }
}


export const fetchDespacho = async (despachoId) => {
    try {
        const data = await HttpGet(`despacho/${despachoId}`)
        return data
    } catch (error) {
        return error
    }
}

export const getPosicionesDeposito = async (depositoId) => {
    try {
        const data = await HttpGet(`deposito/posiciones/${depositoId}`)
        return data
    } catch (error) {
        return error
    }
}

export const transferirEntrePosiciones = async (payload) => {
    try {
        const data = await HttpPost('deposito/transferencias', JSON.stringify(payload))

        return data
    } catch (error) {
        return error
    }
}