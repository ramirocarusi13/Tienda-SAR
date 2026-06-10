import { getInfoByKanban, setPedido, fetchDataFromPedido } from '@services/TiendaService';
import { useEffect, useState } from 'react';
import { egresoTiendaPedido } from '../services/StockService';

const useTienda = (autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])


    const getDataFromKanban = async (kanbanCode, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getInfoByKanban(kanbanCode)

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }


    const grabarPedido = async (payload, withReturn = false) => {
        // setError(null)
        setIsLoading(true)

        try {

            const data = await setPedido(payload)

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            // setError(error)
            setIsLoading(false)

        }

    }

    const getDataFromPedido = async (kanbanCode, withReturn = false) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await fetchDataFromPedido(kanbanCode)

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const egresoTiendaPorPedido = async (pedidoId, withReturn = false) => {

        setIsLoading(true)

        try {

            const data = await egresoTiendaPedido(pedidoId)

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)

            setIsLoading(false)

        }

    }

    return { response, isLoading, error, getDataFromKanban, grabarPedido, egresoTiendaPorPedido, getDataFromPedido }
}


export default useTienda