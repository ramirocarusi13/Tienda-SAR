import { DatePicker } from "antd";
import { Controller } from "react-hook-form";

const { RangePicker } = DatePicker;

export default function InputUseForm({ register, name, errors, placeholder, label, control = null, type = "text", className = "", classNameInput = "", classNameLabel = "", picker = "date", rules = {}, disabled = false, format = "DD/MM/YYYY", onKeyPress = null, onChangeFn = null, size = "small" }) {

    return (
        <div className={className}>
            {label && <label className={`${classNameLabel} text-start block font-semibold ${size == "large" && "mb-0 mt-3"} ${size == "small" && "mb-1 mt-2"}`}>{label} {rules.required && <span className="text-red-500">*</span>}</label>}
            {type == 'date' ? (
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, value, ref } }) =>
                        <DatePicker
                            value={value}
                            ref={ref}
                            className={classNameInput + " disabled:opacity-25 text-sm rounded-md  w-full p-2 mb-2 border border-gray-300 " + (errors[`${name}`] && " border-red-500")}
                            format={format}
                            placeholder={placeholder}
                            picker={picker}
                            disabled={disabled}
                            onChange={(date) => {
                                if (onChangeFn) {
                                    onChangeFn(date)
                                }
                                onChange(date)
                            }}
                        />
                    }
                />
            ) : (type == 'range') ? (
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) =>
                        <RangePicker
                            {...field}
                            format={format}
                            className={"disabled:opacity-25 text-sm rounded-md border p-2 w-full mb-2 " + (errors[`${name}`] && " border-red-500")}
                            placeholder={placeholder}
                            picker={picker}
                            disabled={disabled}
                        />
                    }
                />
            ) : (
                <input
                    disabled={disabled}
                    autoComplete="off"
                    {...register(name, rules)}
                    type={type}
                    className={classNameInput + ` disabled:opacity-25 rounded-md  w-full ${size == "small" && "py-1 px-2 mb-1 text-sm"} ${size == "large" && "py-2 mt-2 px-2 text-sm"} border border-gray-300 ` + (errors[`${name}`] && " border-red-500")}
                    placeholder={placeholder}
                    onKeyDown={(e) => {
                        if (onKeyPress) {
                            onKeyPress(e)
                        }
                    }}
                />
            )}
            {errors[`${name}`] && <div className="text-start"><span className="text-red-500 text-sm italic text-start">{errors[`${name}`].message}</span></div>}

        </div>
    )
}
