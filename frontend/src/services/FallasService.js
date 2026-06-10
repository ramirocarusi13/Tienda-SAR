import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const getFallas = async () => {
    try {
        const data = await HttpGet('fallas')
        return data
    } catch (error) {
        return error
    }
}

export const getFallasTienda = async () => {
    try {
        const data = await HttpGet('fallastienda')
        return data
    } catch (error) {
        return error
    }
}

export const getQrDataEndOfLine = async (qrCode) => {
    const payload = {
        qr: qrCode
    }
    try {
        const data = await HttpPost(`etiqueta/findelinea`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}


export const getKanbanEndOfLine = async (kanbanCode) => {
    try {
        const data = await HttpGet(`kanban/${kanbanCode}/findelinea`)
        return data
    } catch (error) {
        return error
    }
}

export const storeEOL = async (payload) => {
    try {
        const data = await HttpPost(`eol`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getReporteInternoFallas = async (payload) => {
    try {
        const data = await HttpPost(`fallas_informadas`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const retrabajarFunda = async (payload) => {
    try {
        const data = await HttpPost(`retrabajo`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setearOperador = async (payload) => {
    try {
        const data = await HttpPost(`set_operador`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setAnalisisDefecto = async (payload) => {

    try {
        const data = await HttpPost(`fallas/analisis`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}