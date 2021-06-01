import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label, Dropdown } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

 const DropdownInput:React.FC<IProps> = ({input,onChange,loading=false,clearable=false, width, options, placeholder,onSearchChange, meta:{ touched, error}}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
         <Dropdown 
         deburr
             value={input.value}
             onChange={(e, data) => onChange(e,data.value)}
            placeholder={placeholder}
            options={options}
            search selection
            clearable={clearable}
            loading={loading}
            fluid
         />
        {touched && error && (
            <Label basic color='red'>{error}</Label>
        )}
    </Form.Field>
    )
}

export default DropdownInput