import React, { FC, ReactNode } from 'react'
import "./StepComponent.scss";

interface IProps{
  children?: ReactNode;
  className?:string;
}
export const StepsComponent:FC<IProps> = ({
  children,
  className,
  ...rest
}) => {

 

  return (
    <div className={className} {...rest}>
      {children}
    </div>
  )
}

  
