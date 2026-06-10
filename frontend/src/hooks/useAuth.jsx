import { getItem, removeItem, setItem } from "@storage/UserAsyncStorage";
import { routesNames } from "@utils/Constants";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [authed, setAuthed] = useState(false);

    const [userData, setUserData] = useState({
        isLogged: false,
        name: '',
        token: ''
    })

    const navigate = useNavigate();


    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {

        const data = await getItem()

        // console.log("11PASO")
        if (data) {
            const dataUser = JSON.parse(data);
            let today = new Date();

            if (today.getTime() > dataUser.expiration) {
                console.log("EXPIRO")
                logout()
                return
            }
            // console.log(data)
            setUserData({ ...JSON.parse(data), isLogged: true })

        } else {
            // logout()
        }
    }


    const login = async (data) => {
        let today = new Date();

        //Tiempo de sesion, 3 horas (10800000 milisegundos)
        const loginData = {
            ...data, isLogged: true, expiration: today.getTime() + 100800000
        }

        await setItem(loginData)
        setUserData(loginData)
    };

    const logout = async () => {

        const result = await removeItem()

        setUserData({ isLogged: false, token: null, name: null })
        navigate(routesNames.LOGIN)
    };


    return (
        <AuthContext.Provider value={{ authed, setAuthed, login, logout, userData }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);