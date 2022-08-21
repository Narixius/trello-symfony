import * as React from 'react'
import classNames from "classnames";

export const Container:React.FC<{
    children: React.ReactNode,
    className: string
}> = (props:any) => {
    const {children, ...rest} = props;
    return <div className={classNames("max-w-7xl mx-auto px-4 relative", rest.className)}>
        {props.children}
    </div>
}