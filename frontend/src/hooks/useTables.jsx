import { getTable, getTableStandard, postTableStandard, deleteTableStandard, updateCreateTable } from '../services/TableService';
import { useEffect } from 'react';
import { useState } from "react";

const useTables = (table = null, autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])

    const saveTable = async (payload, onSuccess = null, tableNameOpt = '') => {
        // console.log("EWNTR")
        setError(null)
        setIsLoading(true)

        try {
            const data = await updateCreateTable(tableNameOpt != '' ? tableNameOpt : table, payload)

            if (onSuccess) {
                onSuccess(data)
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setIsLoading(false)
        }

    }

    const store = (payload, onSuccess) => {
        save(payload, onSuccess)
    }

    const getData = async (tableFetch = null, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getTable(tableFetch ? tableFetch : table)

            if (withReturn) {
                setIsLoading(false)
                if (!data?.error) {
                    setResponse(data?.data)
                } else {
                    setError(data)
                }
                return data
            }

            if (!data?.error) {
                setResponse(data.data)
            } else {
                setError(data)
            }
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)
            throw new Error(error)
        }

    }

    const fetchTable = async (tableFetch, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getTableStandard(tableFetch)
            // console.log(data)

            if (withReturn) {
                setIsLoading(false)
                return data.data
            }
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const saveStandardTable = async (payload, onSuccess = null) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await postTableStandard(payload)

            if (data.error) {
                setError(data.message)
            } else {
                // fetch()
                if (onSuccess) {
                    onSuccess(data)
                }
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const deleteTable = async (payload, onSuccess = null) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await deleteTableStandard(payload)

            if (data.error) {
                setError(data.message)
            } else {
                // fetch()
                if (onSuccess) {
                    onSuccess(data)
                }
            }

            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    return { response, isLoading, error, saveTable, getData, deleteTable, fetchTable, saveStandardTable }
}


export default useTables