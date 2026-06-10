import { getModelo, getModelos, deleteDadoById, updateModel, updateModeloDatos, updateModelLines, getKanbanPapaByModel, getDadoById, saveDado } from '@services/ModelService';
import { useEffect, useState } from 'react';

const useModels = (autoLoad = true) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])

    const save = async (payload, onSuccess) => {

        setError(null)
        setIsLoading(true)

        try {
            const dataToSend = { ...payload, id: userData.id }
            const data = await storePostulante(dataToSend)

            if (data.error) {
                setError(data.data[0])
            } else {
                // fetch()
                onSuccess()
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

    const update = async (id, payload, onSuccess = null) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await updateModel(id, payload)

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

    const updateLines = async (id, payload, onSuccess = null) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await updateModelLines(id, { lines: payload })

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

    const getData = async (id = null, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {
            let data;
            if (id) {
                data = await getModelo(id)
            } else {
                data = await getModelos()
            }

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

    const fetchKanbanPapa = async (modelId, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getKanbanPapaByModel(modelId)

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

    const fetchDadoById = async (dadoId, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getDadoById(dadoId)

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

    const deleteDado = async (dadoId, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await deleteDadoById(dadoId)

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

    const saveDataDado = async (payload, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await saveDado(payload)

            if (withReturn) {
                setIsLoading(false)
                return data

            }

            // console.log(data.data)
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const updateDatos = async (payload, onSuccess = null) => {
        setError(null)
        setIsLoading(true)

        try {
            const data = await updateModeloDatos(payload)

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

    return { response, isLoading, error, deleteDado, store, getData, updateDatos, update, saveDataDado, updateLines, fetchKanbanPapa, fetchDadoById }
}


export default useModels