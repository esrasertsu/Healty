import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label, Select } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

 const SelectInput:React.FC<IProps> = ({input, width, options, placeholder,emptyError ,labelName,meta:{ touched, error}}) => {
    if((emptyError===null || emptyError==="") && touched)
    {
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
    }else{
        document.getElementById(labelName) !==null && document.getElementById(labelName)!.classList.remove("errorLabel")
    }
    return (
        <Form.Field error={touched && !!error} width={width}>
         <Select 
             value={input.value}
             onChange={(e, data) => input.onChange(data.value)}
             onBlur={(event:any) => input.onBlur(event)}
             placeholder={placeholder}
             options={options}
         />
        {touched && error && (
                <label style={{color:"red"}}>{error}</label>
            )} 
    </Form.Field>
    )
}

export default SelectInput
