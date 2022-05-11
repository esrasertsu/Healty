import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'
import { DateTimePicker } from 'react-widgets'

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {}
const DateInput: React.FC<IProps> = ({
  input,
  width,
  label,
  placeholder,
  disabled,
  date = false,
  time = false,
  min,
  meta: { touched, error },
  ...rest
}) => {
  return (
    <Form.Field width={width}>
      <label className={input.value.toString() === "" ? "errorLabel" :""}>{label}</label>
      <DateTimePicker
        disabled={disabled}
        placeholder={placeholder}
        value={input.value || null}
        onChange={input.onChange}
        onBlur={() => input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        date = {date}
        time = {time}
        min={min}
        messages={input.messages}
        id={input.id}
        {...rest}
        culture="tr"
      />
      {touched && error && (
        <label style={{color:"red"}}>
          {error}
        </label>
      )}
    </Form.Field>
  );
};

export default DateInput