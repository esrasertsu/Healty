import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'
import PhoneInput, { formatPhoneNumber, formatPhoneNumberIntl, isValidPhoneNumber } from 'react-phone-number-input'

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const PhoneNumberInput:React.FC<IProps> = ({input, width,labelName, type, meta:{ touched, error}},
    ...rest) => {

        if(error)
        {
            document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
        }else{
            document.getElementById(labelName) && document.getElementById(labelName)!.classList.remove("errorLabel")
        }
    return (
        <Form.Field 
        // error={input.touched && !!input.error} 
        type={type} 
        width={width}
        >
            <PhoneInput
            width="30%"
            name={input.name}
            initialValueFormat="national"
            defaultCountry="TR"
            placeholder="Telefon numarası"
            value={input.value}
            onChange={input.onChange}
            {...rest}
            />
            {/* {touched && error && (
                <Label basic color='red'>{error}</Label>
            )} */}
        </Form.Field>
    );
};

export default PhoneNumberInput