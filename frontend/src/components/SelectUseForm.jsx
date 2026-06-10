import { Spin } from 'antd';
import { Select } from 'antd';
import { Controller } from "react-hook-form";

export default function SelectUseForm({ register, name, errors, placeholder, label, control = null, multiple = false, search = false, options = [], className = "", size = "large", classNameSelect = "", classNameLabel = "", popupClassName = "", rules = {}, loading = false, disabled = false, onKeyPress = null, onSelect = null, onClear = null }) {
    const filterOption = (input, option) => {
        // console.log(input, option)
        const data = input.split(' ')

        if (data?.length == 1) {
            return (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
        } else {
            let incs = ""
            data.forEach(d => {
                incs = incs + ((option?.label ?? '').toLowerCase().includes(d.toLowerCase()) ? "1" : "0")
            })

            return !incs.includes("0")
        }

    }
    if (search) {
        return (
            <div className={className}>
                {label && <label className={`text-start block font-semibold ${classNameLabel} ${size == "default" && " mb-1 mt-2 "}  ${size == "large" && " mb-3 mt-5 "}`}>{label} {rules.required && <span className="text-red-500">*</span>}</label>}
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field }) =>
                        <Select
                            onClear={onClear}
                            popupClassName={popupClassName}
                            allowClear
                            mode={multiple ? "multiple" : undefined}
                            // dropdownStyle={{ padding: 20 }}
                            // rootClassName='bg-red-500 '
                            className={classNameSelect + ` disabled:opacity-25  rounded-md w-full mb-2 ${multiple && '!text-xs'} ${size == 'default' && "  "} ${size == 'large' && " text-sm  "} ` + (errors[`${name}`] && " border-red-500 border")}
                            size={size}
                            {...field}
                            notFoundContent={loading ? <Spin size="small" /> : null}
                            showSearch
                            onSelect={(item) => {
                                if (onSelect) {
                                    onSelect(item)
                                }
                            }}
                            // popupClassName="!text-2xl"
                            // loading={loading}
                            placeholder={placeholder}
                            optionFilterProp="children"
                            filterOption={filterOption}
                            options={options}
                            onKeyDown={(e) => {
                                if (onKeyPress) {
                                    onKeyPress(e)
                                }
                            }}
                        />
                    }
                />
                {errors[`${name}`] && <div className="text-start"><span className="text-red-500 text-sm italic text-start">{errors[`${name}`].message}</span></div>}
            </div>
        )
    } else {
        return (
            <div className={className}>
                {label && <label className="text-start block font-semibold mb-2 mt-5">{label} {rules.required && <span className="text-red-500">*</span>}</label>}
                <select

                    disabled={disabled}
                    {...register(name, rules)}
                    className={classNameSelect + " disabled:opacity-25 text-sm p-2 rounded-md w-full mb-2 bg-gray-50 py-4 px-4" + (errors[`${name}`] && " border-red-500")}
                    placeholder={placeholder}
                >
                    <option value="">Seleccionar</option>
                    {options.map((item, key) => (
                        <option key={key} value={item.value}>{item.name}</option>
                    ))}
                </select>
                {errors[`${name}`] && <div className="text-start"><span className="text-red-500 text-sm italic text-start">{errors[`${name}`].message}</span></div>}

            </div>
        )
    }
}
