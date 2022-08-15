import * as React from 'react'
import classNames from "classnames";

export default function Input({
        type="input",
        error=false,
        ...rest
    }) {
    return <div className={"flex flex-col space-y-2"}>
        <input
            type={type}
            {...rest}
            className={classNames(rest.className,
                'bg-[#F8F7F8] text-[#74747F] hover:bg-[#F2F1F2] hover:border-[#E6E6E7] focus:bg-white border border-[#E5E4E7] ' +
                'rounded-md focus:border-[#7C91AD] transition-all outline-transparent ' +
                'focus-visible:outline-[#7C95BE] px-3 py-2',{
                    "border-red-500 hover:border-red-500": error
                })}
        />
        {error && <span className={"text-red-500"}>
            {error}
        </span>}
    </div>
}