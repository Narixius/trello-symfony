import * as React from 'react'
import classNames from "classnames";

export default function Button({
          ...rest
      }) {
    return <button
        {...rest}
        className={classNames(rest.className,
            "bg-[#5689E3] hover:bg-[#417BDF] transition rounded-md py-2 font-medium text-[#fff]")}
    />
}