import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label, Dropdown } from 'semantic-ui-react'
import { ISubCategory } from '../../models/category'

interface IProps extends FieldRenderProps<string[], HTMLElement>, FormFieldProps {}

 const DropdownMultiple:React.FC<IProps> = ({input,onChange,loading=false, width, options, placeholder, meta:{ touched, error}}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
         <Dropdown 
          value={input.value || []}
             onChange={(e, data) => onChange(e,data.value)}
            fluid
            multiple
            search
            selection
            loading={loading}
            placeholder={placeholder}
            options={options}
         />
        {touched && error && (
            <Label basic color='red'>{error}</Label>
        )}
    </Form.Field>
    )
}

export default DropdownMultiple