import React, { FC, ReactNode } from 'react'
import "./StepComponent.scss";

interface IProps{
  children?: ReactNode;
  className?:string;
  stepId:number;
}
export const StepContent:FC<IProps> = ({
  children,
  className,
  stepId,
  ...rest
}) => {


  return (
     
        <div className={"content " + className} data-step={stepId.toString()} {...rest}>
            <div className="content__box">
            {children}
            </div>
        </div>
  )
}

  
