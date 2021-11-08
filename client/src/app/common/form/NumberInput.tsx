import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<number, HTMLElement>, FormFieldProps {}

const NumberInput:React.FC<IProps> = ({input, width, type, placeholder,labelName,disabled = false, meta:{ touched, error}}) => {
    if(error && touched )
    {
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
    }else{
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.remove("errorLabel")
    }
    return (
        <Form.Field type={type} width={width}>
            <input {...input} placeholder={placeholder} disabled={disabled} 
            onKeyDown={ (evt) => (evt.key === '.' || evt.key === ',' || evt.key === '-') && evt.preventDefault() }/>
            {touched && error && (
                <label style={{color:"red"}}>{error}</label>
            )}
        </Form.Field>
    );
};

export default NumberInput