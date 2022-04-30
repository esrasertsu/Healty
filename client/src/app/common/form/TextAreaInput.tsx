import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const TextAreaInput:React.FC<IProps> = ({input, rows, placeholder,className,labelName,label, disabled=false,meta:{ touched, error}}) => {
    if(touched && error)
    {
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
    }else{
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.remove("errorLabel")
    }
    
    return (
        <Form.Field className={className} >
        {label && <label id={labelName}>{label}</label>}
        <textarea {...input} placeholder={placeholder} rows={rows}  maxLength={500} disabled={disabled}/>
        {touched && error && (
            <label style={{color:"red"}}>{error}</label>
        )}
    </Form.Field>
    )
}

export default TextAreaInput

