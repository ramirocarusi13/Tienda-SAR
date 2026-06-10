import { stockPiezas, stockPiezasTienda } from "@services/StockService"
import { useEffect } from 'react';
import { useState } from "react";

const useStockPiezas = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)


    const getData = async (payload, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await stockPiezas(payload)
            setResponse(data)
            setIsLoading(false)

            if (withReturn) {
                return data
            }
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const getDataStockTienda = async (payload, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await stockPiezasTienda(payload)
            setResponse(data)
            setIsLoading(false)

            if (withReturn) {
                return data
            }
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }



    return { response, isLoading, error, getData, getDataStockTienda }
}


export default useStockPiezas