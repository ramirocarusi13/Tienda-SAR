import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const getLineas = async () => {
    try {
        const data = await HttpGet('lineas')
        return data
    } catch (error) {
        return error
    }
}