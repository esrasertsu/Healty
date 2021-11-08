import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label, Dropdown } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string[], HTMLElement>, FormFieldProps {}

 const DropdownMultiple:React.FC<IProps> = ({input,onChange,loading=false, width, options,labelName,emptyError, placeholder, meta:{ touched, error}}) => {
  
    if((emptyError===null ||emptyError===undefined || emptyError.length === 0))
    {
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
    }else{
        document.getElementById(labelName) !==null && document.getElementById(labelName)!.classList.remove("errorLabel")
    }

  
    return (
        <Form.Field error={touched && !!error} width={width}>
         <Dropdown 
          value={input.value || []}
          deburr
             onChange={(e, data) => onChange(e,data.value)}
             onBlur={(event:any) => input.onBlur(event)}

            fluid
            multiple
            search
            selection
            loading={loading}
            placeholder={placeholder}
            options={options}
            className={input.value.length >0 ? "selected scrollHeight" :""}
            wrapSelection={false}
            clearable={true}
            closeOnChange

         />
        {touched && error && (
                <label style={{color:"red"}}>{error}</label>
            )} 
    </Form.Field>
    )
}

export default DropdownMultiple