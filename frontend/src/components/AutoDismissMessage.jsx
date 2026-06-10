import { useEffect, useState } from "react";
import { Alert } from "antd";
import { motion, AnimatePresence } from "framer-motion";

const AutoDismissMessage = ({
    message = "Operación realizada con éxito",
    type = "success", // success | info | warning | error
    duration = 3000,  // tiempo en milisegundos antes de desaparecer
    onClose = null,   // callback opcional al cerrar
    random = null
}) => {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onClose) {
                onClose();
            }
        }, duration);
        return () => clearTimeout(timer);
    }, [duration, onClose, message, type]);

    useEffect(() => {
        if (message) {
            setVisible(true)
        }
    }, [random])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    style={{ position: "absolute", bottom: 0, zIndex: 1000, width: "100%" }}
                >
                    <div className={`rounded-md w-full ${(type == 'error') ? 'bg-red-400' : 'bg-green-500'} mt-4 flex items-center justify-center`}>
                        <span className="text-center font-semibold text-4xl py-6 text-white">{message?.toUpperCase()}</span>
                    </div>
                    {/* <Alert message={message} type={type} showIcon closable onClose={() => setVisible(false)} /> */}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AutoDismissMessage;
