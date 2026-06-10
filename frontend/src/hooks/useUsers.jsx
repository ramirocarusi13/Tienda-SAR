import { getUsers, getPolivalencias, setPolivalencia, getUserById, updateData } from '@services/UserService';
import { useEffect } from 'react';
import { useState } from "react";

const useUsers = (autoLoad = false) => {
    const [isLoading, setIsLoading] = useState(false)
    const [response, setResponse] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        if (autoLoad) {
            getData();
        }
    }, [])

    const updateUserData = async (userId, payload, lineaDataPayload) => {

        setError(null)
        setIsLoading(true)

        try {

            const data = await updateData({
                userId,
                data: payload,
                lineaData: lineaDataPayload
            })
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const getData = async (withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getUsers()

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

    const getUser = async (id, withReturn = false) => {
        // if (!userData.id) return
        setError(null)
        setIsLoading(true)

        try {

            const data = await getUserById(id)

            if (withReturn) {
                setIsLoading(false)
                return data
            }

            // setResponse(data)
            setIsLoading(false)
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }

    }

    const getPolivalenciasUsuario = async (userID) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await getPolivalencias(userID)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    const setPolivalenciaUsuario = async (payload) => {
        setError(null)
        setIsLoading(true)

        try {

            const data = await setPolivalencia(payload)
            setIsLoading(false)
            return data
        } catch (error) {
            console.log(error)
            setError(error)
            setIsLoading(false)

        }
    }

    return { response, isLoading, error, updateUserData, getData, getPolivalenciasUsuario, setPolivalenciaUsuario, getUser }
}


export default useUsers