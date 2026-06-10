import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"


export const getDataQr = async (payload) => {
    try {
        const data = await HttpPost(`qr/informacion`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}