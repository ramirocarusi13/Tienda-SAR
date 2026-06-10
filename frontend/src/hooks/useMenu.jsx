import { getMenu, getMenuByUser, saveMenuUser } from '@services/MenuService';
import { useEffect } from 'react';
import { useState } from "react";

const useMenu = (autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)
    const [apps, setApps] = useState([])

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])


    const getData = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getMenu()
            const apps = []

            if (data?.data) {
                data?.data?.forEach(menu => {
                    if (!apps.find(m => m == menu?.app)) {
                        apps.push(menu?.app)
                    }
                });
            }

            setApps(apps)

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

    const getMenuUser = async (userId, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getMenuByUser(userId)

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

    const saveMenu = async (payload, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await saveMenuUser(payload)

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


    return { response, isLoading, error, getData, getMenuUser, saveMenu, apps }
}


export default useMenu