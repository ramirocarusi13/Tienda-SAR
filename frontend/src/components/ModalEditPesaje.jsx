import { Modal } from 'antd'
import { TIPO_MATERIALES } from '../utils/Constants'

export default function ModalEditPesaje({ isModalOpen, setPesaje, handleCancel, handleOk, pesaje, tipoMaterial }) {
    return (
        <Modal footer={[
            <button onClick={handleCancel} className="bg-red-500 text-sm">Cancelar</button>,
            <button onClick={handleOk} className="bg-success ml-2 text-sm">Confirmar</button>
        ]}
            title={tipoMaterial == TIPO_MATERIALES.TELA ? 'Editar pesaje' : 'Editar cantidad'} open={isModalOpen}
        >
            <div className="flex flex-col items-start">
                <label className="text-lg my-2">{tipoMaterial == TIPO_MATERIALES.TELA ? 'Pesaje' : 'Cantidad'}</label>
                <input
                    value={pesaje}
                    onChange={(e) => setPesaje(e.target.value)}
                    type="number"
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            handleOk()
                        }
                    }}
                    className="border border-gray-400 rounded-md w-full p-2 text-lg"
                />
            </div>
        </Modal>
    )
}
