import { HttpGet, HttpPost, HttpPostImage, HttpPostFile, HttpPut, HttpDelete } from "./Http"

export const uploadImportFile = async (uri, formData) => {
    try {
        const data = await HttpPostFile(uri, formData)
        return data
    } catch (error) {
        return error
    }
}


export const uploadImage = async (uri, formData) => {
    try {
        const data = await HttpPostImage(uri, formData)
        return data
    } catch (error) {
        return error
    }
}