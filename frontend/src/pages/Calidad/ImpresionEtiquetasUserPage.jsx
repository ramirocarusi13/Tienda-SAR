import { getUsers } from "@services/UserService"
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react"
// import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import QRCode from "react-qr-code";
import Loader from "@components/Loader"

export default function ImpresionEtiquetasUserPage({ departamento = null }) {
    const [valuePrint, setValuePrint] = useState(null)
    const [nameUser, setNameUser] = useState(null)
    const [users, setUsers] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const componentRef = useRef();
    const handlePrint = useReactToPrint({ content: () => componentRef?.current, });

    const fetchUsers = async () => {
        setIsLoading(true)
        const data = await getUsers()

        if (departamento) {
            setUsers(data?.data?.filter(d => d.departamento == departamento))
        } else {
            setUsers(data?.data)
        }
        setIsLoading(false)
    }

    const print = (text, name) => {
        setNameUser(name)
        setValuePrint(text)
        setTimeout(() => { handlePrint() }, [100])
    }

    useEffect(() => {
        fetchUsers()
    }, [])


    return (
        <div>
            {isLoading && <div className="w-full flex items-center justify-center"><Loader fontSize={100} /></div>}

            {!isLoading &&
                <div className="grid grid-cols-6 gap-4">
                    {users?.filter(u => u.cod_autorizacion != null && u.cod_autorizacion != '')?.map((user, idx) => {
                        return <div className="flex flex-col items-center gap-2" key={idx}>
                            <button onClick={() => print(user.cod_autorizacion, user.email)} className="h-[40mm] flex flex-col gap-1 items-center">
                                <QRCode className="py-1 h-full w-[30mm]" value={user.cod_autorizacion} />
                                {/* <Barcode className='w-full' value={user.cod_autorizacion} height={60} width={2} /> */}
                                <span>{user.email}</span>
                                {/* <span>{user.cod_autorizacion}</span> */}
                            </button>
                        </div>
                    })}
                </div>
            }
            {/* <button onClick={() => print("")}>
                Imprimir
            </button> */}

            <div className="print:flex hidden" ref={componentRef}>
                {/* {users?.filter(u => u.cod_autorizacion != null && u.cod_autorizacion != '')?.map((user, idx) => { */}

                {/* <Barcode className='w-full' value={valuePrint || ""} height={60} width={1} /> */}

                {/* <QRCode className="p-0 m-0 w-[25mm]  h-[25mm]" value={valuePrint || ""} /> */}
                {/* <div className="flex flex-col gap-0 items-center" > */}
                {/* <span className="text-lg font-semibold">REPO STRAP</span> */}
                <div className="flex flex-col items-center gap-0">
                    <QRCode className="px-2 m-0 w-[25mm] h-[25mm]" value={valuePrint || ""} />
                    <span className="text-xs">{nameUser}</span>
                </div>
                {/* <span className="text-lg font-semibold">{user.email}</span> */}
                {/* </div> */}
                {/* })} */}
            </div>
        </div>
    )
}
