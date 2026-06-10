import { useEffect } from "react";
import useAudio from "../hooks/useAudio";

export default function SoundPlayer({ url, play = false }) {
    const { playing, toggle, setPlaying } = useAudio(url);

    useEffect(() => {
        setPlaying(play)
    }, [play])

    return (
        <div>
            <button onClick={toggle}>{playing ? "Pause" : "Play"}</button>
        </div>
    );
};
