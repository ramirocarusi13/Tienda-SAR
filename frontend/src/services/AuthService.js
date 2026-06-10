import { HttpGet, HttpPost } from "./Http"

export const login = async (user, password) => {

    const payload = {
        user,
        password
    }

    const data = await HttpPost('login', JSON.stringify(payload), false)
    return data;
}


export const validaUsuarioPorCodigoValidacion = async (codigo) => {

    const payload = {
        codigo: codigo
    }

    try {
        const data = await HttpPost(`auth/validar_usuario`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}
