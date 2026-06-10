import { RACK_LEVELS, RACK_ROW_NUMBERS } from "@utils/positionFormat";

const racks = [
    {
        rack: 1,
        racks: [
            'A', 'B'
        ]
    },
    {
        rack: 2,
        racks: [
            'C', 'D'
        ]
    },
    {
        rack: 3,
        racks: [
            'E', 'F'
        ]
    }
]

const posiciones = RACK_ROW_NUMBERS
const niveles = RACK_LEVELS


export default function LayoutDepositoPage() {
    return (
        <div className='flex gap-10 w-full h-screen'>
            {racks.map((r, idx) => (
                <div key={idx} className='bg-gray-300 w-full flex gap-2 p-1 h-full'>
                    {r.racks.map((c, idxx) => (
                        <div className=' w-full h-full flex flex-col items-center justify-between ' key={idxx}>
                            {posiciones.map((p, idxxx) => (
                                <div
                                    key={idxxx}
                                    className={`border-b-2 border-b-black w-full gap-1 text-center ${idxx % 2 == 0 ? 'flex-row' : 'flex-row-reverse'} flex justify-between h-full`}
                                >
                                    {niveles.map((n, idxn) => (
                                        <div className='bg-green-500 w-full' key={idxn}>{c}-{p}-{n}</div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}
