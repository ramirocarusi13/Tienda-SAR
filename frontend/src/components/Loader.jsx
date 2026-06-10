import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";
export default function Loader({ fontSize = 24, color = "text-red-500" }) {
    return (
        <Spin
            indicator={
                <LoadingOutlined
                    className={`${color}`}
                    style={{
                        fontSize: fontSize,
                    }}
                    spin
                />
            }
        />
    )
}
