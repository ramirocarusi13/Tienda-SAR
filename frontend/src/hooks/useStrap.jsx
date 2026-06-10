import { getKanbanRemoto, getStrap, getVerificaKanbanStrap, insertStrap, verificaModeloStrap } from '@services/StrapService';
import { useEffect, useState } from 'react';
import { getPartsModel, verifyPartNumber, anularStrap, filterStrap, validaEventoStrap, getPlanillaRemoto } from '@services/StrapService';
import { filterStrapMovimientos } from '../services/StrapService';

const useStrap = (autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingAlt, setIsLoadingAlt] = useState(false)
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
            const data = await insertStrap(payload)

            // if (data.error) {
            //     setError(data.message)
            // } else {
            // fetch()
            if (onSuccess) {
                onSuccess(data)
            }
            // }

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

    const getData = async () => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getStrap()
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const filterData = async (payload, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await filterStrap(payload)

            if (withReturn) {
                setIsLoading(false)
                return data?.data
            }

            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const filterMovimientos = async (payload, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await filterStrapMovimientos(payload)

            if (withReturn) {
                setIsLoading(false)
                return data?.data
            }

            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const verificaExistenciaModeloStrap = async (modelo) => {

        setError(null)
        setIsLoading(true)

        try {

            const data = await verificaModeloStrap(modelo)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const verificaExistenciaRemoto = async (codigo) => {

        setError(null)
        setIsLoading(true)

        try {
            let data;

            if (codigo.toUpperCase().substring(0, 1) == 'R') {
                data = await getPlanillaRemoto(codigo)
            } else {
                data = await getKanbanRemoto(codigo)
            }

            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const verificaModeloStrapKanban = async (payload) => {

        setError(null)
        setIsLoading(true)

        try {

            const data = await getVerificaKanbanStrap(payload)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const getPartsByModelo = async (modelo) => {

        setError(null)
        setIsLoading(true)

        try {

            const data = await getPartsModel(modelo)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const verificarPartNumber = async (partNumber) => {

        setError(null)
        setIsLoadingAlt(true)

        try {

            const data = await verifyPartNumber(partNumber)
            setIsLoadingAlt(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoadingAlt(false)

        }
    }

    const validaCodigoAutorizacion = async (payload) => {
        setError(null)
        setIsLoadingAlt(true)

        try {

            const data = await validaEventoStrap(payload)
            setIsLoadingAlt(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoadingAlt(false)

        }
    }

    const anular = async (id, userId) => {

        setError(null)
        setIsLoadingAlt(true)

        try {
            const data = await anularStrap(id, userId)
            setIsLoadingAlt(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoadingAlt(false)

        }
    }

    return { response, isLoading, error, anular, filterMovimientos, isLoadingAlt, filterData, save, validaCodigoAutorizacion, verificaExistenciaModeloStrap, getPartsByModelo, verificarPartNumber, getData, verificaModeloStrapKanban, verificaExistenciaRemoto }
}


export default useStrap