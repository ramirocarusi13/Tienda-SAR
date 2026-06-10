import { Modal } from 'antd'
import Loader from "@components/Loader"

export default function ModalLoading({ isVisible, label = 'Cargando' }) {
    return (
        <Modal
            open={isVisible}
            footer={[]}
            closable={false}
        >
            <div className='flex flex-col gap-10 items-center justify-center'>
                <span className='text-5xl font-semibold'>{label}</span>
                <Loader fontSize={100} />
            </div>
        </Modal >
    )
}
