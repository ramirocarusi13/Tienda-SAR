import { useState } from "react";

const useCaptureScan = () => {
    const [captureText, setCaptureText] = useState("")
    const [enabledText, setEnabledText] = useState(false)
    const [finalText, setFinalText] = useState(null)

    const onKeyDown = (e) => {
        // console.log(e.key)
        // console.log(captureText)
        if (e.key == 'Enter') {
            if (enabledText) {
                // console.log(captureText)
                setFinalText(captureText)
                setCaptureText("")
                setEnabledText(false)
            }
        } else if (e.key == 'Shift') {
            // console.log("COMENZO")
            setFinalText(null)
            setEnabledText(true)
        } else {
            if (enabledText) {
                setCaptureText(captureText + e.key)
            }
        }
    }

    return { onKeyDown, finalText, setFinalText, enabledText }
}

export default useCaptureScan