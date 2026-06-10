import Loader from "@components/Loader"
import { capacidadProduccion, capacidadProduccionDepositos } from "@services/StockService"
import mainLogo from "@assets/main_logo.jpg";
import { useEffect, useState } from "react"

export default function DashboardPage() {

    const [capcidadProdDepositos, setCapcidadProdDepositos] = useState([])
    const [capcidadProd, setCapcidadProd] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getCapacidadProdDepositos = async () => {

        let data = await capacidadProduccionDepositos()
        setCapcidadProdDepositos(data)

        data = await capacidadProduccion()
        setCapcidadProd(data)

        setIsLoading(false)
    }

    // useEffect(() => {
    //     getCapacidadProdDepositos()
    // }, [])

    if (isLoading) {
        return <div className="flex items-center justify-center"><Loader /></div>
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full gap-4">
            <div className="w-[20%]">
                <img src={mainLogo} className='w-full h-full object-cover m-auto' />
            </div>

            <div className="flex flex-col gap-2">
                <span className="font-semibold text-2xl text-gray-500 italic">BIENVENIDO</span>

                {/* <span className="text-blue-700 font-semibold hover:underline hover:cursor-pointer">Configurar dashboard</span> */}
            </div>
        </div>
    )

    // return (
    //     <div>
    //         <div className="flex flex-col gap-2">
    //             <span className="text-xl font-semibold mb-2">Capacidad de producción por piezas</span>
    //             <div className="flex items-start gap-2">
    //                 {capcidadProd?.data?.map((item, idx) => (
    //                     <div className="w-full bg-yellow-200 flex flex-col p-2" key={idx}>
    //                         <span className="font-semibold">{item.nombre} : {item.capacidad} sets</span>
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>

    //         <div className="flex flex-col mt-10">
    //             <span className="text-xl font-semibold mb-2">Capacidad de producción por piezas, por depósito</span>
    //             <div className="grid grid-cols-6 gap-2">
    //                 {capcidadProdDepositos?.data?.map((item, idx) => (
    //                     <div className=" rounded-md w-full bg-yellow-200 flex flex-col p-2" key={idx}>
    //                         <span className="block font-semibold border-b border-black py-2 mb-2">{item.deposito?.descripcion}</span>
    //                         {item?.modelos?.map((mod, idxx) => (
    //                             <span className="font-semibold" key={idxx}>- {mod.nombre} : {mod.capacidad} sets</span>
    //                         ))}
    //                     </div>
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    // )
}
