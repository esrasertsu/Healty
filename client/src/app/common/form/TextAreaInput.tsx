import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const TextAreaInput:React.FC<IProps> = ({input, rows, placeholder,className, disabled=false,meta:{ touched, error}}) => {
    return (
        <Form.Field className={className} error={touched && !!error}>
        <textarea {...input} placeholder={placeholder} rows={rows}  maxLength={500} disabled={disabled}/>
        {touched && error && (
            <Label basic color='red'>{error}</Label>
        )}
    </Form.Field>
    )
}

export default TextAreaInput

