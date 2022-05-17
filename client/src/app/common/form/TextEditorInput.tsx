import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const TextEditorInput:React.FC<IProps> = ({input, width, type, maxLength, placeholder,labelName, label, meta:{ touched, error}}) => {

    if(touched && error)
    {
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
    }else{
        document.getElementById(labelName) && document.getElementById(labelName)!.classList.remove("errorLabel")
    }
    let elRef = null; 
    return (
        <Form.Field  type={type} width={width}>
            {label && <label id={labelName}>{label}</label>}
            <ReactQuill 
                ref={(el) => { elRef = el }}
                theme={"snow"}
                placeholder={placeholder}
                value={input.value}
                onChange={(event:any) => input.onChange(event)}
                onBlur={(event:any) => input.onBlur(event)}
                />

            {touched && error && (
                <label style={{color:"red"}}>{error}</label>
            )} 
        </Form.Field>
    )
};

export default TextEditorInput