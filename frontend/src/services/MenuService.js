import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const getMenu = async () => {
    try {
        const data = await HttpGet('menu')
        return data
    } catch (error) {
        return error
    }
}


export const getMenuByUser = async (user) => {
    try {
        const data = await HttpGet(`menu/${user}/user`)
        return data
    } catch (error) {
        return error
    }
}

export const saveMenuUser = async (payload) => {
    try {
        const data = await HttpPost(`menu`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}