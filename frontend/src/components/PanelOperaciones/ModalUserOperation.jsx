import Loader from "@components/Loader";
import { Modal, Progress } from 'antd';
import { AsyncImage } from "loadable-image";
import { useEffect, useState } from "react";
import useUsers from "@hooks/useUsers";
import { getColorLevelOperationLine, getNivelName } from "@utils/Utils";
const PUBLIC_URI = import.meta.env.VITE_API_PUBLIC_URI;

const getPercentage = (val) => {
    if (val == 1) {
        return 25
    } else if (val == 2) {
        return 50
    } else if (val == 3) {
        return 75
    } else if (val == 4) {
        return 83
    } else if (val == 5) {
        return 91
    } else if (val == 6) {
        return 100
    } else {
        return 0
    }
}

export default function ModalUserOperation({ isVisible, setIsVisible, user }) {
    const [userData, setUserData] = useState(null)
    const { getUser, isLoading } = useUsers()
    const [photoVisible, setPhotoVisible] = useState(false)

    const fetchUser = async () => {
        const data = await getUser(user, true)
        setUserData(data?.data)
    }

    useEffect(() => {
        if (isVisible) {
            fetchUser()
        }
    }, [isVisible])

    return (
        <Modal
            width={"40%"}
            open={isVisible}
            onCancel={() => setIsVisible(false)}
            okButtonProps={{ className: 'bg-green-500' }}
            onOk={() => setIsVisible(false)}
        >
            <div className="flex items-start flex-col gap-2 ">
                <span className="text-2xl font-bold">{userData?.email}</span>

                <div className="flex items-start w-full gap-4">
                    <div className="w-[200px] flex flex-col">
                        {photoVisible &&
                            <AsyncImage
                                style={{ width: "200px", height: "250px" }}
                                src={`${PUBLIC_URI}usuarios/${user}.jpg`}
                                loader={<div className="flex items-center justify-center"><Loader /></div>}
                            />
                        }

                        {isVisible && !photoVisible &&
                            <video onEnded={() => setPhotoVisible(true)} width="200" height="100" autoPlay autoFocus >
                                <source src={`${PUBLIC_URI}presentacion/8.mp4`} type="video/mp4"></source>
                            </video>
                        }
                    </div>

                    <div className="flex items-start flex-col w-full">
                        <span className="text-xl font-bold block mb-2">Polivalencias</span>

                        {isLoading && <div className="flex items-center justify-center"><Loader /></div>}

                        {!isLoading && userData?.polivalencias?.filter(p => p.polivalencia > 0)?.map((p, idx) => {
                            const percentage = getPercentage(p?.polivalencia)

                            return <div className="flex items-center gap-4 border-b border-black w-full " key={idx}>
                                <div className="flex items-center gap-2 w-20">
                                    <span className="font-bold text-xs">{p?.operacion?.linea}</span>
                                    <span className="font-semibold text-xs">{p?.operacion?.nombre}</span>
                                    {p?.operacion?.nivel && <span className={`font-semibold px-2 text-xs ${getColorLevelOperationLine(p?.operacion?.nivel)}`}>{getNivelName(p?.operacion?.nivel)}</span>}
                                </div>
                                <Progress
                                    strokeColor={percentage < 50 ? 'red' : (percentage < 85 ? 'orange' : 'green')}
                                    className='w-full'
                                    percent={percentage}
                                // size="small"
                                />
                            </div>
                        })}
                    </div>
                </div>
                {/* <video width="200" height="100" autoPlay autoFocus loop>
                    <source src={`${PUBLIC_URI}presentacion/${user}.mp4`} type="video/mp4"></source>
                </video> */}



            </div>
        </Modal>
    )
}
