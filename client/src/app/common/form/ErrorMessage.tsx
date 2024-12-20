import { AxiosResponse } from 'axios'
import React from 'react'
import { Message } from 'semantic-ui-react'

interface IProps {
    error? : AxiosResponse,
    text?: string
}

export const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  return (
    (error !== null && error !== undefined) ?
    <Message error>
      <Message.Header>{error.statusText === "Bad Request" || error.statusText === "Internal Server Error" ? "" : error.statusText}</Message.Header>
      {error.data && Object.keys(error.data.errors).length > 0 && (
          <Message.List>
            {
              typeof(error.data.errors) === 'string' ?
              <Message.Item key={0}>{ error.data.errors }</Message.Item>
              :
              Object.values(error.data.errors).flat().map((err: any, i) => (
                <Message.Item key={i}>{ err }</Message.Item>
            ))
            }
             
          </Message.List>
      )}
      {/* {text && <Message.Content content={text} />} */}
    </Message>
    : <></>
  );
};
