import useLongPress from "@hooks/useLongPress"
import { useEffect } from "react";
import Loader from "@components/Loader"
import { useState } from "react";
const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

export default function DrawItem({ image, circles, addCircle, deleteCircle, classes = '' }) {

    const [isLoading, setIsLoading] = useState(true)

    const defaultOptions = {
        shouldPreventDefault: true,
        delay: 500,
    };

    useEffect(() => {
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 500)
    }, [image])

    const onLongPress = () => {
        console.log('longpress is triggered');
        // setlongPressCount(longPressCount + 1)
    };

    const longPressEvent = useLongPress(onLongPress, defaultOptions);

    if (isLoading) {
        return <div className='w-full h-full flex items-center justify-center bg-no-repeat relative bg-white bg-contain bg-center border-2 border-green-500'>
            <Loader fontSize={200} />
        </div>
    }

    return (
        <div  onClick={addCircle} style={{ backgroundImage: `url(${PUBLIC_URI}uploads/${image.image})` }}
            className={`${classes} w-full h-full bg-no-repeat relative bg-white bg-contain bg-center border-2 border-green-500`}
        >
            {circles.filter(f => f.imageId == image.id).map((c, idx) => (
                <div
                    {...longPressEvent}
                    id={c.id}
                    className={`${c.cantidad > 1 && "border-2 border-black"} rounded-full font-semibold absolute cursor-pointer w-10 h-10 flex flex-col items-center justify-center div-circle-falla`}
                    style={{ left: `${c.x}%`, top: `${c.y}%`, backgroundColor: `#${c.color}` }}
                    key={idx}

                    onContextMenu={(e) => {
                        e.preventDefault()
                        deleteCircle(c.id)
                    }}
                >
                    {c.falla.codigo}
                    {/* {c.cantidad > 1 && c.cantidad} */}
                </div>
            ))}
        </div>
    )
}
