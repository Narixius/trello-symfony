import * as React from 'react'
import classNames from "classnames";
import {InputHTMLAttributes} from "react";

export default function Input({
        type="input",
        error=undefined,
        small=false,
        ...rest
    }: {
    error?: undefined | string,
    small?: boolean
} & InputHTMLAttributes<HTMLInputElement>
) {
    return <div className={"flex flex-col space-y-1 w-full"}>
        <input
            type={type}
            {...rest}
            className={classNames(rest.className,
                'bg-mellow text-[#74747F] hover:bg-mellow-darker focus:bg-white border border-black hover:border-opacity-30 border-opacity-20 focus:border-opacity-30 ' +
                'rounded-md transition-all outline-transparent ' +
                'focus-visible:outline-[#7C95BE] w-full',{
                    "border-red-500 hover:border-red-500": error,
                    'text-sm h-[30px]': small,
                    'h-[42px]': !small,
                    'px-3 py-2': type !== 'color',
                    'p-1': type === 'color',
                })}
        />
        {error && <span className={"text-red-500 text-sm"}>
            {error}
        </span>}
    </div>
}

export const ColorPicker:React.FC<{
    color?: string,
    onChange: (color: string)=>void,
    colors: string[]
}> = ({
    color,
    colors,
    onChange
}) => {
    const selectNext = () => {
        const index = colors.findIndex(c => c === color);
        onChange(colors[index + 1 >= colors.length ? 0 : index + 1]);
    }
    if(!color)
        color = colors[0]
    return <div className="flex border-black border-opacity-20 hover:border-opacity-30 border w-full rounded-md select-none">
            <div className="w-full h-[30px] px-2 text-sm text-center flex items-center rounded-md" style={{
                backgroundColor: color
            }} onClick={selectNext} >
                <span>Color</span>
            </div>
    </div>
}