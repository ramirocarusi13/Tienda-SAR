import React from 'react'

export default function AndonLineasPage2() {
    return (
        <div className='w-full flex flex-col gap-5 justify-between py-2 items-center h-screen bg-black text-white'>

            <div className='w-full flex items-center justify-between px-2'>
                <div className='flex flex-col items-center'>
                    <span className='text-2xl'>MIERCOLES</span>
                    <span className='text-3xl'>14/05/2025</span>
                </div>

                <span className='text-8xl font-semibold text-violet-500'>LINEA M1</span>

                <span className='text-6xl font-semibold'>13:38</span>
            </div>

            <div className='w-full grid grid-cols-5'>
                <div className='flex flex-col items-center'>
                    <span className='text-7xl'>TARGET:</span>
                    <span className='text-8xl font-semibold text-green-600'>150</span>
                </div>

                <div className='flex flex-col items-center'>
                    <span className='text-7xl'>OA:</span>
                    <span className='text-8xl font-semibold text-green-600'>150</span>
                </div>

                <div className='flex flex-col items-center'>
                    <span className='text-7xl'>FTC:</span>
                    <span className='text-8xl font-semibold text-green-600'>150</span>
                </div>

                <div className='flex flex-col items-center'>
                    <span className='text-7xl'>QUALITY:</span>
                    <span className='text-8xl font-semibold text-green-600'>150</span>
                </div>

                <div className='flex flex-col items-center'>
                    <span className='text-7xl'>ACTUAL:</span>
                    <span className='text-8xl font-semibold text-green-600'>150</span>
                </div>
            </div>

            <div className='w-full grid grid-cols-5'>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
                <span className='bg-green-500 w-full p-8 text-8xl border border-white font-semibold'>10</span>
            </div>
        </div>
    )
}
