import { Progress } from "antd"
export default function ProgressStock({ max, val }) {

    const percent = (val * 100) / max

    return (
        <Progress percent={percent} />
    )
}
