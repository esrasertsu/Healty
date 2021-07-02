import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label, Dropdown } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string[], HTMLElement>, FormFieldProps {}

 const DropdownMultiple:React.FC<IProps> = ({input,onChange,loading=false, width, options, placeholder, meta:{ touched, error}}) => {
    return (
        <Form.Field error={touched && !!error} width={width}>
         <Dropdown 
          value={input.value || []}
          deburr
             onChange={(e, data) => onChange(e,data.value)}
            fluid
            multiple
            search
            selection
            loading={loading}
            placeholder={placeholder}
            options={options}
            className={input.value.length >0 ? "selected" :""}
            wrapSelection={false}
            clearable={true}
         />
        {touched && error && (
            <Label basic color='red'>{error}</Label>
        )}
    </Form.Field>
    )
}

export default DropdownMultiple