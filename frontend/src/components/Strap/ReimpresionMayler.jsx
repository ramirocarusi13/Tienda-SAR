import { Modal } from 'antd';
import { useRef, useState } from 'react';
import Barcode from 'react-barcode';
import { useReactToPrint } from 'react-to-print';
import QRCode from "react-qr-code";


export default function ReimpresionMayler({ isOpen, setIsOpen }) {

    const [valuePrint, setValuePrint] = useState(null)

    const componentRef = useRef();

    const handlePrint = useReactToPrint({ content: () => componentRef?.current, });

    const print = (text) => {
        setValuePrint(text)
        setTimeout(() => {
            handlePrint()
        }, [100])
    }

    return (
        <Modal
            footer={[
                <button key={"btn1"}
                    onClick={() => setIsOpen(false)}
                    className='bg-red-400 px-6'
                >Cerrar</button>
            ]}

            cancelButtonProps={{ className: "bg-red-500 px-6" }}
            okButtonProps={{ className: "bg-green-500 px-6" }}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            width={"90%"}
        >

            <span className='block text-center w-full text-2xl font-semibold my-4 bg-yellow-200 py-2'>SELECCIONE UNA ETIQUETA PARA IMPRIMIRLA</span>

            <div className="grid grid-cols-3" >
                <button key={1} onClick={() => print("X7A13-A2900A")}>
                    <Barcode className='w-full' value="X7A13-A2900A" height={60} width={2} />
                    {/* <QRCode className="w-[300px] h-[300px]" value="R|X7A16-A2903A" /> */}

                </button>

                <button key={2} onClick={() => print("X7A14-A2901A")}>
                    <Barcode className='w-full' value="X7A14-A2901A" height={60} width={2} />
                </button>

                <button key={3} onClick={() => print("X7A15-A2902A")}>
                    <Barcode className='w-full' value="X7A15-A2902A" height={60} width={2} />
                </button>

                <button key={4} onClick={() => print("X7A16-A2903A")}>
                    <Barcode className='w-full' value="X7A16-A2903A" height={60} width={2} />
                </button>

                <button key={5} onClick={() => print("X7A19-A2917B")}>
                    <Barcode className='w-full' value="X7A19-A2917B" height={60} width={2} />
                </button>

                <button key={6} onClick={() => print("X7A20-A2918B")}>
                    <Barcode className='w-full' value="X7A20-A2918B" height={60} width={2} />
                </button>

                <button key={7} onClick={() => print("X7A17-A2904A")}>
                    <Barcode className='w-full' value="X7A17-A2904A" height={60} width={2} />
                </button>

                <button key={8} onClick={() => print("X7A18-A2905A")}>
                    <Barcode className='w-full' value="X7A18-A2905A" height={60} width={2} />
                </button>
            </div>

            <div className="hidden print:flex" ref={componentRef}>
                <Barcode className='w-full' value={valuePrint || ""} height={60} width={2} />
            </div>
        </Modal>
    )
}
