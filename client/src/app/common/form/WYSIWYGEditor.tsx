import React, { useState } from 'react'
import { FieldRenderProps } from 'react-final-form'
import { Form, FormFieldProps, Label } from 'semantic-ui-react'
import { EditorState, convertToRaw,convertFromHTML ,CompositeDecorator,ContentState} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {}

const WYSIWYGEditor:React.FC<IProps> = ({ input,  meta:{ touched, error} }) => {
    const blocksFromHTML = convertFromHTML(input.value);
    const state = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap,
      );

    const [editorState, setEditorState] = useState(EditorState.createWithContent(state));

    const onEditorStateChange = (editorState:EditorState) => {
        setEditorState(editorState);
        return input.onChange(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    } 
          return (
              <Form.Field error={touched && !!error}>
                <div className="editor">
                                <Editor 
                                editorState={editorState} 
                                wrapperClassName="html-editor-wrapper"
                                editorClassName="html-editor"
                                onEditorStateChange={onEditorStateChange}
                                toolbar={{
                                    options:  ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link', 'embedded', 'emoji', 'image', 'remove', 'history']
                                }}
                                />
                                {
                                    console.log('editorState => ', convertToRaw(editorState.getCurrentContent()))
                                }
                            </div>
              </Form.Field>
           
        )
  
   
}


export default WYSIWYGEditor