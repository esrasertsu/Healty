import React, { useEffect, useState } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps } from 'semantic-ui-react'
import { EditorState, convertToRaw,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import cx from 'classnames';

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const WYSIWYGEditor:React.FC<IProps> = ({ input,labelName,  meta:{ touched, error} }) => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    useEffect(() => {
     
        if (toHtml(editorState) === input.value) return //added
    
        setEditorState(
          EditorState.push(
            editorState,
            ContentState.createFromBlockArray(
              htmlToDraft(input.value || '').contentBlocks,
            ),
            "adjust-depth"
          ),
        )
      }, [input.value])
    
      function toHtml(es: EditorState) {
        return draftToHtml(convertToRaw(es.getCurrentContent())) // added
      }

    const [focused, setFocused] = useState(false);
 

    const onEditorStateChange = (meditorState:EditorState) => {
        setEditorState(meditorState);
        const html = toHtml(meditorState) //added
        if (input.value !== html) {
            input.onChange({ target: { name: 'text', value: html } })
            if(html && html.length < 50)
            {
              document.getElementById(labelName) && document.getElementById(labelName)!.classList.add("errorLabel")
            }else{
              document.getElementById(labelName) && document.getElementById(labelName)!.classList.remove("errorLabel")
          }
        }

    } 
    const onFocus = () => setFocused(true);
    const onBlur = () => setFocused(false);

 
          return (
              <Form.Field error={!!error}>
                <div className="editor">
                                <Editor 
                                editorState={editorState} 
                                wrapperClassName="html-editor-wrapper"
                                editorClassName={cx("html-editor",{focused})}
                                onEditorStateChange={onEditorStateChange}
                               onBlur={onBlur}
                               onFocus={onFocus}
                                toolbar={{
                                    options:  ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
                                }}
                                />
                            </div>
                            <label style={{color:"red"}}>{error}</label>
              </Form.Field>
           
        )
}

export default WYSIWYGEditor