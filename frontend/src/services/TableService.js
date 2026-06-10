import { HttpGet, HttpPost, HttpPostImage, HttpPut, HttpDelete } from "./Http"

export const updateCreateTable = async (table, payload) => {
    // console.log(table)
    try {
        const data = await HttpPost(table, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const getTable = async (table) => {
    try {
        const data = await HttpGet(table)
        return data
    } catch (error) {
        throw new Error(error)
        // return error
    }
}

export const getTableStandard = async (table) => {
    try {
        const data = await HttpGet(`tabla/${table}`)
        return data
    } catch (error) {
        return error
    }
}

export const postTableStandard = async (payload) => {
    try {
        const data = await HttpPost(`tabla`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}

export const deleteTableStandard = async (payload) => {
    try {
        const data = await HttpPost(`tabla/delete`, JSON.stringify(payload))
        return data
    } catch (error) {
        return error
    }
}