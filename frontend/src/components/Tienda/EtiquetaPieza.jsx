import QRCode from "react-qr-code";
import { useReactToPrint } from 'react-to-print';
import { useRef, useState } from 'react';

const cleanCode = (code) => {

    let tmpCode = code
    const letter = tmpCode.substring(tmpCode.length - 1, tmpCode.length)

    //REEMPLAZO PARENTESIS Y CONTENIDO
    const init = tmpCode.indexOf("(")
    const end = tmpCode.indexOf(")")

    if (init > 0 && end > 0) {
        //REMPLAZO CONTENIDO
        tmpCode = `${tmpCode.substring(0, init)}${tmpCode.substring(end + 1)}`
    }

    if (letter == "R" || letter == "L") {
        return tmpCode.substring(0, tmpCode.length - 1)
    }

    return tmpCode

}

const cleanLado = (lado) => {
    if (lado == "100%" || lado == '100 %') {
        return "-"
    }

    return lado
}

// const letras = ['A', 'B', 'C']
// const subletras = ['A', 'B']

export default function EtiquetaPieza({ codigo, modelo, lado }) {

    // return (

    //     letras.map(letra => (
    //         subletras.map((sub, idx) => (
    //             <div key={idx} className={`${idx % 5 == 0 && idx > 4 && "break-before-all bg-red-500"} flex flex-col items-center !w-[95mm] !h-[95mm] !border-8 border-black p-1`}>
    //                 <QRCode className="mt-6 h-[45mm]" value={letra + "-" + sub + "-0"} />
    //                 <span className="text-9xl font-semibold tracking-tighter">{letra}-{sub}-0</span>
    //             </div>
    //         ))
    //     ))

    // )

    return (
        // <button key={1} onClick={() => print("X7A13-A2900A")}>

        <div className=" h-[12mm] w-[65mm] gap-0 mb-1 border border-black flex items-center">
            {/* <div className='py-2 h-full'> */}
            <QRCode className="py-0 h-full w-[15mm]" value={modelo + "|" + codigo + "|" + lado} />
            {/* </div> */}
            <div className="flex items-start justify-between flex-col w-full h-full py-0">
                <div className="flex items-start flex-col gap-0 w-full">
                    <div className="flex flex-col items-center w-full justify-between">
                        <div className="w-full flex items-center justify-between bg-black py-0 my-0">
                            <span className="text-white text-center border-r text-xs w-[33%] !py-0 !my-0">MODELO</span>
                            <span className="text-white text-center border-r text-xs w-[47%] !py-0 !my-0">N° PIEZA</span>
                            <span className="text-white text-center border-r text-xs w-[20%] !py-0 !my-0">LADO</span>
                        </div>

                        <div className="w-full flex items-center justify-between ">
                            <span className="w-[33%] text-center border-r border-black font-bold text-xl">{modelo}</span>
                            <span className={`w-[47%] text-center border-r border-black font-bold text-xl`}>{cleanCode(codigo)}</span>
                            <span className="w-[20%] text-center  font-bold text-xl">{cleanLado(lado)}</span>
                        </div>

                        {/* <div className="flex flex-col">
                                <span className="bg-black text-white">MODELO</span>
                                <span className="text-sm font-bold">{modelo}</span>
                            </div>
                            <span className="block text-sm font-bold">{codigo}</span>
                            <span className="block text-sm font-bold">{lado}</span> */}
                    </div>
                </div>

                {/* <div className=" w-full flex items-end justify-between">
                    <span className="text-2xl font-bold">{codInterno}</span>
                    <span className="text-sm font-semibold">50.55ML | 90.99M2</span>
                </div>
                <span className="text-sm font-semibold">{lote}</span> */}
            </div>
        </div>
        // </button>
    )
}
