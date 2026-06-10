import { createKanban, createKanbanSar, getKanbans, changeStatusKanban, verificaExistenciaKanbanEstado, getKanbansFilters, getKanban } from '../services/KanbanService';
import { useEffect } from 'react';
import { useState } from "react";

const useKanban = (autoload = true) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoload) {
            getData();
        }
    }, [])

    const save = async (payload, onSuccess = null, enSar = false) => {

        setError(null)
        setIsLoading(true)

        try {
            let data;

            if (enSar) {
                data = await createKanbanSar(payload)
            } else {
                data = await createKanban(payload)
            }
            // console.log("HOOK", data)
            if (data.error) {
                setError(data.message)
            } else {
                // fetch()
                setIsLoading(false)

                if (onSuccess) {
                    onSuccess(data)
                }
            }

        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setIsLoading(false)
        }

    }

    const store = async (payload, onSuccess, enSar = false) => {
        await save(payload, onSuccess, enSar)
    }

    const filterKanban = async (payload) => {

        setError(null)
        setIsLoading(true)

        try {
            const data = await getKanbansFilters(payload)
            setResponse(data.data)
            setIsLoading(false)

        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getData = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getKanbans()

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

    const changeStatus = async (payload) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await changeStatusKanban(payload)
            setIsLoading(false)
            return data

        } catch (error) {
            console.log(error)
            setError(error)
        } finally {
            setIsLoading(false)
        }
    }

    const getKanbanByCode = async (kanbanCode, withReturn = false) => {

        setError(null)
        setIsLoading(true)

        try {

            const data = await getKanban(kanbanCode)
            if (withReturn) {
                setIsLoading(false)
                return data
            }
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const existenciaKanbanByEstado = async (payload, withReturn = false) => {

        setError(null)
        setIsLoading(true)

        try {

            const data = await verificaExistenciaKanbanEstado(payload)
            if (withReturn) {
                setIsLoading(false)
                return data
            }
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }


    return { response, isLoading, error, store, getData, existenciaKanbanByEstado, changeStatus, filterKanban, getKanbanByCode }

}



export default useKanban