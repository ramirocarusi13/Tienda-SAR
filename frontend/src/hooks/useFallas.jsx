import { getFallas, getFallasTienda } from '@services/FallasService';
import { useEffect, useState } from 'react';

const useFallas = (autoLoad = false, tienda = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            if (tienda) {
                getDataTienda()
            } else {
                getData();
            }
        }
    }, [])


    const getData = async () => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getFallas()
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const getDataTienda = async () => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getFallasTienda()
            setResponse(data.data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }


    return { response, isLoading, error, getData }
}


export default useFallas