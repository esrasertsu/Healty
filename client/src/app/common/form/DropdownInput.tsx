import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label, Dropdown } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

 const DropdownInput:React.FC<IProps> = ({input,onChange,loading=false,clearable=false, width,labelName,emptyError, options, placeholder,onSearchChange, meta:{ touched, error}}) => {
   
    if(emptyError===null || emptyError==="")
    {
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
    }else{
        document.getElementById(labelName) !==null && document.getElementById(labelName)!.classList.remove("errorLabel")
    }

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
            className={input.value !== "" ? "selected" :""}
         />
        {/* {touched && error && (
            <Label basic color='red'>{error}</Label>
        )} */}
    </Form.Field>
    )
}

export default DropdownInput