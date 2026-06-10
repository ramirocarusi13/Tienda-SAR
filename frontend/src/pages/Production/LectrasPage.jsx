const data = [
    {
        modelo: 'SFEP',
        diario: 4.2,
        stock: 44.1,
        vehiculo: 'C3Q',
        tipo: 'LOW'
    },
    {
        modelo: 'SFMR',
        diario: 71,
        stock: 440,
        vehiculo: 'C4S',
        tipo: 'HI'
    },
    {
        modelo: 'SFKN',
        diario: 26,
        stock: 119,
        vehiculo: 'C4Y',
        tipo: 'LOW'
    },
    {
        modelo: 'SFKQ',
        diario: 11,
        stock: 29,
        vehiculo: 'C4H',
        tipo: 'LOW'
    },
    {
        modelo: 'SFKQ',
        diario: 3,
        stock: 9,
        vehiculo: 'C4H',
        tipo: 'LOW'
    },
    {
        modelo: 'SFKQ',
        diario: 3,
        stock: 18,
        vehiculo: 'C4H',
        tipo: 'LOW'
    }
    ,
    {
        modelo: 'SFKQ',
        diario: 12,
        stock: 18,
        vehiculo: 'C4H',
        tipo: 'LOW'
    }
]

const Bar = ({ stock }) => {
    // console.log(stock * 10)
    const classStock = Math.round((stock + 5) * 15)
    return <div style={{ height: `${classStock}px` }} className={` w-20 ${stock >= 3 ? 'bg-green-400' : (stock <= 2 ? 'bg-red-500' : 'bg-yellow-300')} border-b-2 border-black`}>
        {/* {stock.toFixed(1)} */}
    </div>
}

export default function LectrasPage() {
    return (
        <div className="flex gap-1 items-end w-full relative">

            <div className="border-b-2 border-dashed border-blue-600 w-[70%] left-4 absolute flex items-end justify-end" style={{ bottom: `${(6 * 29) + 102}px` }}><span className="font-semibold">Target 6.0 DOH</span></div>
            <div className="border-b-2 border-dashed border-blue-600 w-[70%] left-4 absolute flex items-end justify-end" style={{ bottom: `${(3 * 41) + 109}px` }}><span className="font-semibold">Target 3.0 DOH</span></div>
            {data.map((d, idx) => {
                const stock = d.stock / d.diario

                return <div key={idx} className="">
                    <span className="text-center block font-semibold">{stock.toFixed(1)}</span>
                    <Bar stock={stock} />
                    <div className="flex flex-col gap-1 items-center border-r-2 border-black">
                        <span className="rotate-90 font-semibold my-4">{d.modelo}</span>
                        <span className="font-semibold text-xs">{d.vehiculo}</span>
                        <span className="font-semibold text-xs">{d.diario}</span>
                        <span className="font-semibold text-xs">{d.tipo}</span>
                    </div>
                </div>
            })}
        </div>
    )
}


// import LectraView from '@components/LectraView'

// const lectras = [
//     {
//         name: 'Lectra 1',
//         status: 'Operativa',
//         corte: 'SFHP'
//     },
//     {
//         name: 'Lectra 2',
//         status: 'Error',
//         time: '2024-02-23 09:48:00',
//         corte: 'SFHP'
//     },
//     {
//         name: 'Lectra 3',
//         status: '',
//         corte: 'SFKQ'
//     },
//     {
//         name: 'Lectra 4',
//         status: '',
//         corte: 'HSHS'
//     },

// ]

// export default function LectrasPage() {

//     return (
//         <div>
//             <div className='grid grid-cols-4 grid-rows-2 grid-flow-row gap-2  h-[85vh]'>
//                 {lectras.map((lectra, idx) => (
//                     <LectraView lectra={lectra} key={idx} />
//                 ))}
//             </div>
//         </div>
//     )
// }
