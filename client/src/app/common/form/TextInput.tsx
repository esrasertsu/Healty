import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const TextInput:React.FC<IProps> = ({input, width, type, placeholder,labelName, label, meta:{ touched, error}}) => {

    if(touched && error)
    {
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
    }else{
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.remove("errorLabel")
    }

    return (
        <Form.Field  type={type} width={width}>
            {label && <label id={labelName}>{label}</label>}
            <input {...input} placeholder={placeholder}/>
            {touched && error && (
                <label style={{color:"red"}}>{error}</label>
            )} 
        </Form.Field>
    )
};

export default TextInput
