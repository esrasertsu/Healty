import React, { FC, ReactNode } from 'react'
import "./StepComponent.scss";

interface IProps{
    children?: ReactNode;
}
export const StepsContentWrapper:FC<IProps> = (
    {
        children,
  ...rest
    }
) => {

  return (
    <div className="contents" id="contents" {...rest}>
        {children}
    </div>
  )
}

  


