import { HttpDelete, HttpGet, HttpPost, HttpPut } from "./Http"

export const getStrap = async () => {
    try {
        const data = await HttpGet('strap')
        return data
    } catch (error) {
        return error
    }
}

export const insertStrap = async (payload) => {
    try {
        const data = await HttpPost('strap', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getKanbanRemoto = async (kanban) => {
    try {
        const data = await HttpGet(`strap/kanban/${kanban}`)
        return data
    } catch (error) {
        return error
    }
}

export const getPlanillaRemoto = async (partNumber) => {
    try {
        const data = await HttpGet(`strap/planilla/${partNumber}`)
        return data
    } catch (error) {
        return error
    }
}

export const verificaModeloStrap = async (modelo) => {
    try {
        const data = await HttpGet(`strap/modelo/${modelo}`)
        return data
    } catch (error) {
        return error
    }
}

export const getVerificaKanbanStrap = async (payload) => {
    try {
        const data = await HttpPost('strap/verificar_modelo', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const filterStrap = async (payload) => {
    try {
        const data = await HttpPost('strap/filter', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const filterStrapMovimientos = async (payload) => {
    try {
        const data = await HttpPost('strap/filterMovimientos', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getPartsModel = async (modelo) => {
    try {
        const data = await HttpGet(`strap/parts/${modelo}`)
        return data
    } catch (error) {
        return error
    }
}

export const verifyPartNumber = async (partNumber) => {
    try {
        const data = await HttpGet(`strap/part_number/${partNumber}`)
        return data
    } catch (error) {
        return error
    }
}


export const validaEventoStrap = async (payload) => {
    try {
        const data = await HttpPost('strap/valida_evento', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const verificarEventoPendiente = async () => {
    try {
        const data = await HttpGet(`strap/evento_pendiente`)
        return data
    } catch (error) {
        return error
    }
}

export const verificarCantidadReposicion = async (payload) => {
    try {
        const data = await HttpPost(`strap/verificar_cantidad_reposicion`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const validaUsuarioPorCodigoValidacion = async (codigo) => {

    const payload = {
        codigo: codigo
    }

    try {
        const data = await HttpPost(`strap/validar_usuario`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const verificaUsuarioValidoStrap = async (codigo, tl = 0) => {

    const payload = {
        codigo: codigo,
        tl: tl
    }

    try {
        const data = await HttpPost(`strap/user_valido`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const anularStrap = async (id, userId) => {
    try {
        const data = await HttpDelete(`strap/${id}/${userId}`)
        return data
    } catch (error) {
        return error
    }
}

export const modificaStrap = async (id, payload) => {
    try {
        const data = await HttpPut(`strap/${id}`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}