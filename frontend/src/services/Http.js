// import { APIURI } from "@config/config"
// import { getUser } from "@storage/UserAsyncStorage";
// const userData = await getUser();
import { getItem, removeItem } from '../storage/UserAsyncStorage';
const APIURI = import.meta.env.VITE_API_URI;

let goToLogin = () => {
    // Web (Vite + React Router – fallback duro si no inyectás navigate)
    if (typeof window !== 'undefined') window.location.assign('/login');
};

const handleUnauthenticated = async () => {
    await removeItem();
    goToLogin(); // navega a login
};

export const HttpGet = async (uri, destructure = false) => {

    const userData = await getItem()
    const token = JSON.parse(userData)?.token

    // const token = ''
    try {
        const data = await fetch(`${APIURI}${uri}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (data.status === 401 || data.status === 419) {
            await handleUnauthenticated();
            return { error: true, message: 'Unauthenticated', status: data.status };
        }

        const response = await data.json()

        // console.log(response)
        return response;
    } catch (error) {
        // console.log(error)
        return errorResponse(error.response);
    }

    // console.log("USER", userData)

};

export const HttpDelete = async (uri, destructure = false) => {
    const userData = await getItem()
    const token = JSON.parse(userData)?.token
    // const token = ''

    try {
        const data = await fetch(`${APIURI}${uri}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            method: 'DELETE'
        });

        if (data.status === 401 || data.status === 419) {
            await handleUnauthenticated();
            return { error: true, message: 'Unauthenticated', status: data.status };
        }

        const response = await data.json()

        return response.data;
    } catch (error) {
        console.log(error)
        return errorResponse(error.response);
    }
};

export const HttpPost = async (uri, payload = "", withToken = true, optionalHeaders = {}) => {

    const userData = await getItem()
    const token = JSON.parse(userData)?.token
    // const token = ''

    try {
        const headers = withToken
            ? {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
                ...optionalHeaders
            }
            : {
                "Content-Type": "application/json",
                "Accept": "application/json",
                ...optionalHeaders
            };

        const data = await fetch(`${APIURI}${uri}`, {
            method: "POST",
            body: payload,
            headers: headers
        });

        if (data.status === 401 || data.status === 419) {
            await handleUnauthenticated();
            return { error: true, message: 'Unauthenticated', status: data.status };
        }

        const response = await data.json()



        return response;
    } catch (error) {
        return errorResponse(error);
    }
};

export const HttpPostFile = async (uri, payload = "", withToken = true, optionalHeaders = {}) => {
    const userData = await getItem()
    const token = JSON.parse(userData)?.token
    // const token = ''
    try {
        const headers = withToken
            ? {

                Authorization: `Bearer ${token}`,
                // 'content-type': 'multipart/form-data'
            }
            : {
                // 'content-type': 'multipart/form-data'
            };

        const data = await fetch(`${APIURI}${uri}`, {
            method: "POST",
            body: payload,
            headers: headers
        });

        if (data.status === 401 || data.status === 419) {
            await handleUnauthenticated();
            return { error: true, message: 'Unauthenticated', status: data.status };
        }

        const response = await data.json()

        return response;
    } catch (error) {
        return errorResponse(error);
    }
};

export const HttpPostImage = async (uri, payload = "", withToken = true, optionalHeaders = {}) => {
    const userData = await getItem()
    const token = JSON.parse(userData)?.token
    // const token = ''
    try {
        const headers = withToken
            ? {

                Authorization: `Bearer ${token}`,
            }
            : {

            };

        const data = await fetch(`${APIURI}${uri}`, {
            method: "POST",
            body: payload,
            headers: headers
        });

        if (data.status === 401 || data.status === 419) {
            await handleUnauthenticated();
            return { error: true, message: 'Unauthenticated', status: data.status };
        }

        const response = await data.json()

        return response;
    } catch (error) {
        return errorResponse(error);
    }
};

export const HttpPut = async (uri, payload = "") => {
    // const { userData } = useAuth();
    const userData = await getItem()
    const token = JSON.parse(userData)?.token

    try {
        const data = await fetch(`${APIURI}${uri}`, {
            method: "PUT",
            body: payload,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })

        if (data.status === 401 || data.status === 419) {
            await handleUnauthenticated();
            return { error: true, message: 'Unauthenticated', status: data.status };
        }

        const response = await data.json()
        return response;

    } catch (error) {
        return errorResponse(error.response);
    }
};

// export const HttpPatch = async (uri, payload = "", desustructed = false) => {
//     try {
//         const { data } = await axios.patch(`${APIURI}${uri}`, payload, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${userData.token}`,
//             },
//         });
//         if (desustructed) {
//             const response = {
//                 ...data.data,
//                 ...{ status_code: data.status_code },
//                 ...{ message: data.message },
//             };
//             return response;
//         } else {
//             return data;
//         }
//     } catch (error) {
//         return errorResponse(error.response);
//     }
// };

// export const HttpDelete = async (uri, desustructed = false) => {
//     try {
//         const { data } = await axios.delete(`${APIURI}${uri}`, {
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${userData.token}`,
//             },
//         });

//         if (desustructed) {
//             const response = {
//                 ...data.data,
//                 ...{ status_code: data.status_code },
//                 ...{ message: data.message },
//             };
//             return response;
//         } else {
//             return data;
//         }
//     } catch (error) {
//         return errorResponse(error.response);
//     }
// };

const errorResponse = (message) => {
    return {
        data: [],
        status: 404,
        message: `Error en la conexión con el servidor : ${message}`,
        error: true,
    };
};
