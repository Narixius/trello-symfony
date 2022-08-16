import * as React from 'react'
import classNames from "classnames";

export default function Button({
                                    small= false,
                                    outline = false,
                                    danger=false,
                                   ...rest
      }) {
    return <button
        {...rest}
        className={classNames(rest.className,
            "transition rounded-md",
            {
                "text-xs py-1 font-normal": small,
                "py-2 font-medium": !small,
                "border border-gray-300 text-gray-400 bg-mellow": outline && !danger,
                "border border-red-300 text-red-400": outline && danger,
                "bg-primary hover:bg-primary-darker text-[#fff]": !outline && !danger,
                "bg-red-400 hover:bg-red-400 text-[#fff]": !outline && danger,
            })}
    />
}