import { Modal } from "antd"
import { setItemLocalStorage, removeItem, setItem } from "@storage/UserAsyncStorage";

const lectras = [
    {
        value: 1,
        name: "LECTRA 1"
    },
    {
        value: 2,
        name: "LECTRA 2"
    },
    {
        value: 3,
        name: "LECTRA 3"
    },
    {
        value: 4,
        name: "LECTRA 4"
    }
]

export default function ModalSelectLectra({ isVisible, setIsVisible }) {
    return (
        <Modal
            footer={[]}
            closable={false}
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            width="60%"
        >
            {/* <span>modal lectra</span> */}
            <span className="block text-center text-4xl font-bold mb-10 my-2">SELECCIONE LA LECTRA</span>
            <div className="flex items-center gap-2 w-full">
                {lectras.map((lectra, idx) => (
                    <button
                        onClick={async () => {
                            await setItemLocalStorage("lectra", lectra)
                            setIsVisible(false)
                        }}
                        className="w-full bg-emerald-500 py-10 text-2xl font-semibold"
                        key={idx}
                    >
                        {lectra.name}
                    </button>
                ))}
            </div>
        </Modal>
    )
}
