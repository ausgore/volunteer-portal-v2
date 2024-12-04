import { ChangeEvent, useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CustomFieldOptions } from "../../../utils/managers/CustomFieldSetManager";

interface CheckboxFieldProps {
    id: string;
    fields: any;
    /** The actual code to update a specific field by its id */
    handleFields?: (id: string, value: any) => void;
    disabled?: boolean;
    className?: string;
    placeholder?: string;
    options: CustomFieldOptions[];
    label: string;
}

export default function CheckboxField(props: CheckboxFieldProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [values, setValues] = useState(props.fields[props.id] as any[]);

    const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);
    const handleClick = (option: CustomFieldOptions) => {
        if (props.handleFields) {
            let newValues = values;
            if (!values.includes(option.value)) newValues = [...values, option.value];
            else newValues = values.filter((v, i) => i != values.indexOf(option.value));
            setValues(newValues);
            props.handleFields(props.id, newValues);
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsMenuOpen(false);
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);


    return <div className={props.className}>
        <div className="w-full md:w-[300px]">
            {/* Label */}
            <label htmlFor={props.id} className={`font-semibold ${props.disabled ? "opacity-40" : ""}`}>{props.label}</label>
            <div className="relative mt-1" ref={dropdownRef}>
                {/* Input */}
                <div className="relative flex items-center">
                    <input type="text" id={props.id} placeholder={`${props.fields[props.id] ? props.fields[props.id].length > 0 ? props.fields[props.id].length : "None" : "None"} selected`} className={`w-full py-2 px-4 rounded-t-[5px] disabled:bg-white disabled:cursor-not-allowed caret-transparent outline-none select-none ${!isMenuOpen ? "rounded-b-[5px]" : ""} cursor-pointer`} onClick={toggleDropdown} disabled={props.disabled} />
                    {!props.disabled && <IoIosArrowDown className="text-secondary absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />}
                </div>
                {/* Dropdown menu */}
                {!props.disabled && isMenuOpen && <div className="absolute z-[1] bg-white w-full rounded-b-[5px] flex flex-col py-2" role="menu" aria-orientation="vertical">
                    {props.options.map((opt: CustomFieldOptions) => {
                        return <div className="inline-block px-4 py-2 items-center gap-x-3 cursor-pointer disabled:cursor-not-allowed hover:bg-gray-100 w-full" onClick={() => handleClick(opt)}>
                            <input type="checkbox" id={`${props.id}-${opt.value}`} className="pointer-events-none" checked={values.includes(opt.id) || values.includes(opt.value)} />
                            <label htmlFor={`${props.id}-${opt.value}`} className="text-sm w-full text-gray-600 ml-4 cursor-pointer pointer-events-none">{opt.label}</label>
                        </div>
                    })}
                </div>}
            </div>
        </div>
    </div>
}