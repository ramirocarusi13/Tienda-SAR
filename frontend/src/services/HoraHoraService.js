import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const savePlanHoraHora = async (payload) => {
    try {
        const data = await HttpPost('hora_hora', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const actualizaPlanHoraHoraSegunAndon = async (payload) => {
    try {
        const data = await HttpPost('hora_hora/actualizar', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setSoporteLinea = async (payload) => {
    try {
        const data = await HttpPost('hora_hora/soporte', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getPlanHoraHora = async (payload) => {
    try {
        const data = await HttpPost(`hora_hora/search`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const saveParadaLinea = async (payload) => {
    try {
        const data = await HttpPost('hora_hora/parada', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const searchParadasLinea = async (payload) => {
    try {
        const data = await HttpPost('hora_hora/parada/search', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const deleteParada = async (id) => {
    try {
        const data = await HttpDelete(`hora_hora/parada/eliminar/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const fetchModelosHoraHora = async (payload) => {
    try {
        const data = await HttpPost('hora_hora/modelos/search', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setModelosHoraHora = async (payload) => {
    try {
        const data = await HttpPost('hora_hora/modelos', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const fetchAusentismoHoraHora = async (payload) => {
    try {
        const data = await HttpPost('users/ausentismo/search', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const setAusentismoHoraHora = async (payload) => {
    try {
        const data = await HttpPost('users/ausentismo', JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getFmdsLinea = async (payload) => {
    try {
        const data = await HttpGet(`fallas/andon?${payload}`)
        return data
    } catch (error) {
        return error
    }
}

export const getAndonAuditoriaHoraHora = async (payload = {}) => {
    try {
        const params = new URLSearchParams()

        Object.entries(payload).forEach(([key, value]) => {
            if (value === undefined || value === null || `${value}`.trim() === '') {
                return
            }
            params.append(key, value)
        })

        const qs = params.toString()
        const data = await HttpGet(`andon/auditoria_hora_hora${qs ? `?${qs}` : ''}`)
        return data
    } catch (error) {
        return error
    }
}
