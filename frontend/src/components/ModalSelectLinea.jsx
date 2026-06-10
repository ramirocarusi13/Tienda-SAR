import { Modal } from "antd"
import { setItemLocalStorage, removeItem, setItem } from "@storage/UserAsyncStorage";

const lineas = [
    { codigo: 1, linea: 'M1' },
    { codigo: 2, linea: 'M2' },
    { codigo: 3, linea: 'M3' },
    { codigo: 4, linea: 'M4' },
    { codigo: 5, linea: 'M5' },
    { codigo: 6, linea: 'M6' },
    { codigo: 10, linea: 'M10' },
    // {codigo:8, linea: 'M1'},
    { codigo: 11, linea: 'M11' },
]

export default function ModalSelectLinea({ isVisible, setIsVisible }) {
    return (
        <Modal
            footer={[]}
            closable={false}
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            width="60%"
        >
            {/* <span>modal lectra</span> */}
            <span className="block text-center text-4xl font-bold mb-10 my-2">SELECCIONE LA LINEA</span>
            <div className="flex items-center gap-2 w-full">


                {lineas?.map((l, idx) => (
                    <button
                        onClick={async () => {
                            await setItemLocalStorage("linea", l.codigo)
                            setIsVisible(false)
                        }}
                        className="w-full bg-emerald-500 py-10 text-2xl font-semibold"
                        key={`linea${idx}`}>{l?.linea}</button>
                ))}
            </div>

        </Modal>
    )
}
