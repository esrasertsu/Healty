import React, { useState } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Checkbox, Form, FormFieldProps, Label } from 'semantic-ui-react'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const CheckboxInput:React.FC<IProps> = ({input, placeholder,checked, setChecked }) => {


    const handleChange = (e:any) => {
        debugger;
         setChecked(e.target.checked);
    }
    return (
        <Form.Field>
             <Label><input {...input} value={checked===true?"true":"false"} type="checkbox" placeholder={placeholder} 
                      onChange={handleChange}
           />&nbsp;&nbsp;{placeholder}</Label>
        </Form.Field>
    );
};

export default CheckboxInput


