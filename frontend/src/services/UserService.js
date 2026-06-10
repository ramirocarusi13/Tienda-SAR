import { HttpGet, HttpPost } from "./Http"

export const getUsers = async () => {
    try {
        const data = await HttpGet('users')
        return data
    } catch (error) {
        return error
    }
}

export const getUsersNL = async () => {
    try {
        const data = await HttpGet('nl_users')
        return data
    } catch (error) {
        return error
    }
}

export const createUser = async (payload) => {
    try {
        const data = await HttpPost(`user`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getUserById = async (id) => {
    try {
        const data = await HttpGet(`users/${id}`)
        return data
    } catch (error) {
        return error
    }
}

export const getPolivalencias = async (userId) => {
    try {
        const data = await HttpGet(`user/${userId}/polivalencias`)
        return data
    } catch (error) {
        return error
    }
}


export const setPolivalencia = async (payload) => {
    try {
        const data = await HttpPost(`user/polivalencias`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const updateData = async (payload) => {
    try {
        const data = await HttpPost(`user/update/data`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getUserProduccion = async () => {
    try {
        const data = await HttpGet(`users/departamento/produccion`)
        return data
    } catch (error) {
        return error
    }
}

export const getTurnoActual = async () => {
    try {
        const data = await HttpGet(`turno_actual`)
        return data
    } catch (error) {
        return error
    }
}

export const validarImpresionQrAutorizacion = async (codigo) => {
    try {
        const data = await HttpPost(
            `public/users/qr-autorizacion/validar`,
            JSON.stringify({ codigo }),
            false
        )
        return data
    } catch (error) {
        return error
    }
}

export const getUsersQrAutorizacion = async ({ codigo = "", search = "", sector = "" } = {}) => {
    try {
        const data = await HttpPost(
            `public/users/qr-autorizacion`,
            JSON.stringify({ codigo, search, sector }),
            false
        )
        return data
    } catch (error) {
        return error
    }
}
